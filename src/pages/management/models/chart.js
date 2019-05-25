import {fetchOverview, fetchSaleSta, fetchSaleType, fetchStoreSale, fetchStoresSale} from '@/services/api';
import moment from 'moment';

export default {
    namespace: 'chart',

    state: {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
        loading: false,
    },

    effects: {
        * fetch(_, {call, put}) {
            const ovRes = yield call(fetchOverview);
            const saleStaRes = yield call(fetchSaleSta,{"type":"week","start":0,"end":0});
            const saleTypeRes = yield call(fetchSaleType);
            const storesSaleRes = yield call(fetchStoresSale);
            let storeSale = [];
            if (storesSaleRes.success && storesSaleRes.data.length>0) {
                let id = storesSaleRes.data[0].label.match(/(\d+)/)[0];
                storeSale = yield call(fetchStoreSale,id);
            }
            yield put({
                type: 'save',
                payload: {
                    visitData:ovRes.data,
                    salesData:saleStaRes.data.list,
                    rankingListData:saleStaRes.data.storeRankingList,
                    salesTypeData:saleTypeRes.data,
                    offlineData : storesSaleRes.data,
                    offlineChartData : storeSale.data,
                },
            });
        },
        * fetchSalesData({payload}, {call, put}) {
            const saleStaRes = yield call(fetchSaleSta,{"type":"","start":payload[0].unix(),"end":payload[1].unix()});
            yield put({
                type: 'save',
                payload: {
                    salesData:saleStaRes.data.list,
                    rankingListData:saleStaRes.data.storeRankingList
                },
            });
        },
    },

    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                ...payload,
            };
        },
        clear() {
            return {
                visitData: [],
                visitData2: [],
                salesData: [],
                searchData: [],
                offlineData: [],
                offlineChartData: [],
                salesTypeData: [],
                salesTypeDataOnline: [],
                salesTypeDataOffline: [],
                radarData: [],
            };
        },
    },
};
