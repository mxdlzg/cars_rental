import {message} from 'antd';
import {addOrder, queryCarDetail, queryOrderPriceDetail} from "@/services/order"
import router from "umi/router";

export default {
    namespace: 'order',
    state: {},
    effects: {
        * initPageInfo({payload}, {call, put}) {
            const carInfoRes = yield call(queryCarDetail,payload.carId);
            const orderPriceDetailRes = yield call(queryOrderPriceDetail,payload);

            yield put({
                type: 'saveInitInfo',
                payload: {carInfoRes,orderPriceDetailRes}
            })
        },

        * submit({payload},{call,put}){
            const res = yield call(addOrder,payload);
            if (res.success) {
                router.push({
                    pathname:'/order/OrderResult',
                    search:res.data
                })
            }else {
                message.warn(res.msg);
            }
        }
    },
    reducers: {
        saveInitInfo(state,{payload}){
            return{
                ...state,
                ...payload,
            }
        },
    },
    subscriptions: {}
}