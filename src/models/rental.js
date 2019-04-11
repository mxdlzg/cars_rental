import {queryRentalOptions} from '@/services/rental';

export default {
    namespace:'rental',

    state:{
        filterOptions:undefined,
        filterOptionsLoading:true
    },
    effects:{
        *fetchOptions(_,{call,put,select}){
            const res = yield call(queryRentalOptions);
            yield put({
                type:'saveOptions',
                payload:res.data,
            })
        }
    },
    reducers:{
        saveOptions(state,{payload}){
            return{
                ...state,
                filterOptions:payload,
            }
        }
    },
    subscriptions:{

    }
}