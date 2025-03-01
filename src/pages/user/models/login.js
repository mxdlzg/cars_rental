import {fakeAccountLogin, getFakeCaptcha} from "@/services/api";
import {reloadAuthorized} from "@/utils/Authorized";
import {routerRedux} from "dva/router";
import {getPageQuery, getPageQueryParams, getPageQueryUrl} from "@/utils/utils";
import {setAuthority, setAuthorization} from "@/utils/authority";
import {cacheUserToken} from "@/utils/userInfo";
import {stringify} from "qs";
import {message} from 'antd';
import router from "umi/router"

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
            let load = {username:payload.username};
            // yield put({
            //     type:"user/fetchCurrent",
            // });
            if (res.status === 'ok') {
                reloadAuthorized();
                cacheUserToken(load);
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let {redirect,query} = params;
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
                if (query) {
                    redirect = getPageQueryUrl(redirect);
                }else {
                    query = getPageQueryParams(redirect);
                    redirect = getPageQueryUrl(redirect);
                }
                message.success(res.msg);
                yield put(router.replace({
                    pathname: redirect || '/',
                    search:stringify({
                        ...query
                    }),
                    // state: {token: res.token, username: payload.username}
                }));
            }else {
                message.error(res.msg);
            }
        },
        * getCaptcha({payload}, {call}) {
            yield call(getFakeCaptcha, payload);
        },
        * logout(_, {put}) {
            //重新定义当前状态
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    status: false,
                    data:{
                        currentAuthority: 'guest'
                    }
                },
            });

            //清理用户信息
            yield put({
                type:"user/saveCurrentUser",
                payload:{status:'invalid'},
            });
            reloadAuthorized();
            cacheUserToken(undefined);
            setAuthorization(undefined);

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
            setAuthority(payload.data.currentAuthority);
            return {
                ...state,
                status: payload.status,
                //token: payload.data.token,
                type: payload.type,
                //username: payload.username
            }
        },
        //logout
        changeLoginStatus(state, {payload}) {
            setAuthority(payload.data.currentAuthority);
            return {
                ...state,
                status: payload.status,
                type: payload.type,
            };
        },
    }
}