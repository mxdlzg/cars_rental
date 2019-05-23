import {message} from 'antd';
import {
    addOrder,
    orderDetail,
    queryCarDetail,
    queryOrderList,
    queryOrderPriceDetail,
    queryPayInfo
} from "@/services/order"
import router from "umi/router";
import {stringify} from "qs";
import {getUserToken} from "@/utils/userInfo";

export default {
    namespace: 'order',
    state: {
        list: [],
        page: 0,
        last: true,
    },
    effects: {
        * initPageInfo({payload}, {call, put}) {
            const carInfoRes = yield call(queryCarDetail, payload.carId);
            const orderPriceDetailRes = yield call(queryOrderPriceDetail, payload);

            yield put({
                type: 'saveInitInfo',
                payload: {carInfoRes, orderPriceDetailRes}
            })
        },

        * submit({payload}, {call, put}) {
            const res = yield call(addOrder, payload);
            if (res.success) {
                router.push({
                    pathname: '/order/OrderResult',
                    search: stringify({
                        current: 1,
                        operateDate: res.data.createdDate,
                        type: "success",
                        id: res.data.id,
                        needPay: true,
                        description: "提交结果页用于反馈一系列操作任务的处理结果，如果仅是简单操作，使用 Message 全局提示反馈即可。本文字区域可以展示简单的补充说明，如果有类似展示“单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。",
                    })
                })
            } else {
                message.warn(res.msg);
            }
        },

        * queryOrderPayInfo({payload}, {call, put}) {
            const res = yield call(queryPayInfo, payload);
            if (res.success) {
                if (res.data.finished) {
                    yield put(router.replace({
                        pathname: "/order/OrderResult",
                        search: stringify({
                            current: 2,
                            operateDate: res.data.payDate,
                            type: "success",
                            id: res.data.id,
                            description: "这是一段有关于支付结果的详细描述！！！",
                        })
                    }))
                } else {
                    yield put({
                        type: "savePayInfo",
                        payload: res.data,
                    })
                }
            } else {
                message.warn(res.msg);
            }
        },
        * queryOrderList({payload}, {call, put}) {
            let token = getUserToken();
            if (payload.page >= 0 || payload.isInit) {
                const res = yield call(queryOrderList, {name: token.username, page: payload.isInit?0:payload.page+1});
                if (res.success) {
                    yield put({
                        type: "saveOrderList",
                        payload: {res: res, isMore: payload.isMore}
                    })
                } else {
                    message.error(res.msg);
                }
            } else {
                message.success("已全部加载完毕!");
            }
        },
        * orderDetail({payload}, {call, put}) {
            const res = yield call(orderDetail, payload);
            if (res.success) {
                yield put({
                    type: "saveOrderDetail",
                    payload: res.data,
                })
            } else {
                message.error(res.msg);
            }
        }
    },
    reducers: {
        saveInitInfo(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        },
        savePayInfo(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        },
        saveOrderList(state, {payload}) {
            const {data} = payload.res;
            state.page = data.last ? -1 : data.number;
            state.last = data.last;
            if (payload.isMore) {
                state.list = state.list.concat(data.content);
            } else {
                state.list = data.content;
            }
        },
        saveOrderDetail(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        }
    },
    subscriptions: {}
}