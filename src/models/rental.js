import {queryRentalOptions, queryStores, queryCars} from '@/services/rental';

export default {
    namespace: 'rental',

    state: {
        filterOptions: undefined,
        filterOptionsLoading: true,
        cascaderStartData: [],
        cascaderEndData: [],
        originLocation: undefined,
        aimLocation: undefined,
        dates: undefined,
        tabIndex: 1,
        shortRent:[],weekRent:[],monthRent:[]
    },
    effects: {
        * fetchStores({payload}, {call, put}) {
            const res = yield call(queryStores, payload.data);
            yield put({
                type: 'saveStores',
                payload: {type: payload.type, data: res.data}
            })
        },
        * searchRental(_, {call, put, select}) {
            const payload = yield select((state) => ({
                start: state.rental.originLocation,
                end: state.rental.aimLocation,
                dates: state.rental.dates,
                tabIndex: state.rental.tabIndex
            }));
            const res = yield call(queryCars, payload);
            yield put({
                type: 'saveCars',
                payload: {tab:payload.tabIndex,data:res.data}
            })
        },
        * fetchOptions(_, {call, put, select}) {
            const res = yield call(queryRentalOptions);
            yield put({
                type: 'saveOptions',
                payload: res.data,
            })
        }
    },
    reducers: {
        saveStores(state, {payload}) {
            if (payload.type === 'start') {
                return {
                    ...state,
                    cascaderStartData: payload.data
                }
            } else {
                return {
                    ...state,
                    cascaderEndData: payload.data
                }
            }
        },
        saveOptions(state, {payload}) {
            return {
                ...state,
                filterOptions: payload,
            }
        },
        saveCars(state, {payload}) {
            return {
                ...state,
                shortRent: payload.data.short,
                weekRent: payload.data.week,
                monthRent: payload.data.month,
            };
        },
        changeOptions(state, {payload}) {
            switch (payload.type) {
                case 'car':
                    state.filterOptions.optionsCar.forEach((item, key) => {
                        item.selected = payload.key === key;
                    });
                    break;
                default:
                    break;
            }
        },
        changeSearchParams(state, {payload}) {
            switch (payload.id) {
                case 'selectStart':
                    return {
                        ...state,
                        originLocation: payload.value
                    };
                case "selectEnd":
                    return {
                        ...state,
                        aimLocation: payload.value
                    };
                default:
                    return {
                        ...state,
                        dates: payload.value
                    };
            }
        },
        changeTab(state, {payload}) {
            return {
                ...state,
                tabIndex: payload
            }
        }
    },
    subscriptions: {}
}