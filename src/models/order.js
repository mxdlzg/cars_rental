import {message} from 'antd';
import {
    addOrder, cancelOrder, checkout, comments, fetchComments,
    orderDetail, payOrder,
    queryCarDetail,
    queryOrderList,
    queryOrderPriceDetail,
    queryPayInfo, takeCar
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
        comment:"",
        rate:0,
        commentShow:false
    },
    effects: {
        * initPageInfo({payload}, {call, put}) {
            const carInfo = yield call(queryCarDetail, payload.carId);
            const orderPriceDetailRes = yield call(queryOrderPriceDetail, payload);

            let carInfoRes = carInfo.data;
            // let orderPriceDetailRes = orderPriceDetail.data;
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
                        operateDate: res.data.date,
                        type: "success",
                        id: res.data.orderId,
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
        },
        * cancelOrder({payload},{call,put}){
            const res = yield call(cancelOrder, payload);
            if (res.success) {
                yield put({
                    type: "orderDetail",
                    payload: payload,
                })
            } else {
                message.error(res.msg);
            }
        },
        * payOrder({payload},{call,put}){
            const res = yield call(payOrder, payload);
            if (res.success) {
                message.success("支付成功！");
                router.push({
                    pathname:"/order/OrderDetail",
                    search:stringify({
                        id:payload.id
                    })
                })
            } else {
                message.error(res.msg);
            }
        },
        * takeCar({payload},{call,put}){
            const res = yield call(takeCar, payload);
            if (res.success) {
                message.success("取车成功，此订单成功取车！");
                yield put({
                    type: "orderDetail",
                    payload: payload,
                })
            } else {
                message.error(res.msg);
            }
        },
        * checkout({payload},{call,put}){
            const res = yield call(checkout, payload);
            if (res.success) {
                message.success("结算完毕！");
                yield put({
                    type: "orderDetail",
                    payload: payload,
                })
            } else {
                message.error(res.msg);
            }
        },
        * comments({payload},{call,put}){
            if (payload === null) {
                yield put({
                    type:"saveComments",
                    payload:null
                });
                return;
            }
            const res = yield call(comments, payload);
            if (res.success) {
                message.success("评价更新完毕！");
                yield put({
                    type:"saveComments",
                    payload:null
                });
            } else {
                message.error(res.msg);
            }
        },
        * showComments({payload},{call,put}){
            const res = yield call(fetchComments, payload);
            if (res.success) {
                yield put({
                    type:"saveComments",
                    payload:res.data
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
        },
        saveComments(state,{payload}){
            if (payload === null) {
                return {
                    ...state,
                    commentShow:false
                }
            }
            return {
                ...state,
                comment:payload.content,
                rate:payload.rate,
                commentShow:true
            }
        }
    },
    subscriptions: {}
}