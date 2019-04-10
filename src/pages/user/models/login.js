import {fakeAccountLogin, getFakeCaptcha} from "@/services/api";
import {reloadAuthorized} from "@/utils/Authorized";
import {routerRedux} from "dva/router";
import {getPageQuery} from "@/utils/utils";
import {setAuthority} from "@/utils/authority";
import {cacheUserToken} from "@/utils/userInfo";
import {stringify} from "qs";

export default {
    namespace: 'login',
    state: {
        token: undefined,
        username: undefined
    },
    effects: {
        * submit({payload}, {call, put}) {
            const res = yield call(fakeAccountLogin, payload);
            yield put({
                type: "loginHandle",
                payload: res
            });
            let load = {username:payload.username,token:res.token};
            // yield put({
            //     type:"user/saveCurrentToken",
            //     payload: load,
            // });
            if (res.status === 'ok') {
                reloadAuthorized();
                cacheUserToken(load);
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let {redirect} = params;
                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        redirect = null;
                    }
                }
                yield put(routerRedux.replace({
                    pathname: redirect || '/',
                    state: {token: res.token, username: payload.username}
                }));
            }
        },
        * getCaptcha({payload}, {call}) {
            yield call(getFakeCaptcha, payload);
        },
        * logout(_, {put}) {
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    status: false,
                    currentAuthority: 'guest',
                },
            });
            yield put({
                type:"user/saveCurrentToken",
                payload:{},
            });
            reloadAuthorized();
            cacheUserToken(undefined);

            // redirect
            if (window.location.pathname !== '/user/login') {
                yield put(
                    routerRedux.replace({
                        pathname: '/user/login',
                        search: stringify({
                            redirect: window.location.href,
                        }),
                    })
                );
            }
        },
    },

    reducers: {
        //login
        loginHandle(state, {payload}) {
            setAuthority(payload.currentAuthority);
            return {
                ...state,
                status: payload.status,
                token: payload.token,
                type: payload.type,
                username: payload.username
            }
        },
        //logout
        changeLoginStatus(state, {payload}) {
            setAuthority(payload.currentAuthority);
            return {
                ...state,
                status: payload.status,
                type: payload.type,
            };
        },
    }
}