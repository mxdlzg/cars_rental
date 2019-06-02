import {addCar, queryCouponsList, queryStoreCarList, removeCars} from "@/services/assets";
import {getUserToken} from "@/utils/userInfo";
import {message} from "antd/lib/index";
import {queryCurrentMI} from "@/services/user";

export default {
    namespace: 'assets',

    state: {
        list: [],
        page: 0,
        last: true,
        pagination:{}
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
        * fetchStoreCarList({payload},{call,put}){
            const res = yield call(queryStoreCarList,payload);
            if (res.success) {
                yield put({
                    type:"saveCarList",
                    payload:res.data,
                })
            }else {
                message.warn(res.msg);
            }
        },
        * createCar({payload},{call,put}){
            const res = yield call(addCar,payload);
            if (res.success) {
                message.success("添加成功");
            }else {
                message.warn(res.msg);
            }
        },
        * removeCars({payload},{call,put}){
            const res = yield call(removeCars,payload);
            if (res.success) {
                message.success("修改成功");
            }else {
                message.warn(res.msg);
            }
        }
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
        saveCarList(state,{payload}){
            state.list = payload;
        }
    },
};
