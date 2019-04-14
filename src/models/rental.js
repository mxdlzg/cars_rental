import {queryRentalOptions,queryStores,queryCars} from '@/services/rental';

export default {
    namespace:'rental',

    state:{
        filterOptions:undefined,
        filterOptionsLoading:true,
        cascaderStartData: [],
        cascaderEndData: [],
    },
    effects:{
        *fetchStores({payload},{call,put}){
            const res = yield call(queryStores,payload.data);
            yield put({
                type:'saveStores',
                payload:{type:payload.type,data:res.data}
            })
        },
        *searchRental(_,{call,put}){
            const res = yield call(queryCars);
            yield put({
                type:'saveCars',
                payload:res.data
            })
        },
        *fetchOptions(_,{call,put,select}){
            const res = yield call(queryRentalOptions);
            yield put({
                type:'saveOptions',
                payload:res.data,
            })
        }
    },
    reducers:{
        saveStores(state,{payload}){
            if (payload.type === 'start') {
                return{
                    ...state,
                    cascaderStartData:payload.data
                }
            }else {
                return{
                    ...state,
                    cascaderEndData:payload.data
                }
            }
        },
        saveOptions(state,{payload}){
            return{
                ...state,
                filterOptions:payload,
            }
        },
        saveCars(state,{payload}){
            return{...state};
        },
        changeOptions(state,{payload}){
            switch (payload.type){
                case 'car':
                    state.filterOptions.optionsCar.forEach((item,key)=>{
                        item.selected = payload.key === key;
                    });
                    break;
                default:break;
            }
        }
    },
    subscriptions:{

    }
}