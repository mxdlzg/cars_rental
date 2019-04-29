import {queryCouponsList} from "@/services/assets";
import {getUserToken} from "@/utils/userInfo";
import {message} from "antd/lib/index";

export default {
    namespace: 'assets',

    state: {
        list: [],
        page: 0,
        last: true,
    },

    effects: {
        * fetch({payload}, {call, put}) {
            let token = getUserToken();
            if (payload.page >= 0 || payload.isInit) {
                const res = yield call(queryCouponsList, {name: token.username, page: payload.page});
                if (res.success) {
                    yield put({
                        type: "saveCouponsList",
                        payload: {res: res, isMore: payload.isMore}
                    })
                } else {
                    message.error(res.msg);
                }
            } else {
                message.success("已全部加载完毕!");
            }
        },
    },

    reducers: {
        saveCouponsList(state, {payload}) {
            state.page = payload.res.last ? -1 : payload.res.number;
            state.last = payload.res.last;
            if (payload.isMore) {
                state.list = state.list.concat(payload.res.content);
            } else {
                state.list = payload.res.content;
            }
        },

    },
};
