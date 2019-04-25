import {message} from 'antd';
import {queryCarDetail, queryOrderPriceDetail} from "@/services/order"

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