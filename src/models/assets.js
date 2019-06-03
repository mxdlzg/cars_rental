import {addCar, fetchRanking, queryCouponsList, queryStoreCarList, removeCars} from "@/services/assets";
import {getUserToken} from "@/utils/userInfo";
import {message} from "antd/lib/index";
import {queryCurrentMI} from "@/services/user";

export default {
    namespace: 'assets',

    state: {
        list: [],
        page: 0,
        last: true,
        pagination:{},
        ranking:[0,0,0]
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
        * fetchRanking({payload}, {call, put}){
            const res = yield call(fetchRanking,payload);
            if (res.success) {
                yield put({
                    type:"saveRanking",
                    payload:res.data
                })
            }else {
                message.warn(res.msg);
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
            const {data} = payload.res;
            state.page = data.last ? -1 : data.number;
            state.last = data.last;
            if (payload.isMore) {
                state.list = state.list.concat(data.content);
            } else {
                state.list = data.content;
            }
        },
        saveCarList(state,{payload}){
            state.list = payload;
        },
        saveRanking(state,{payload}){
            state.ranking = payload
        }
    },
};
