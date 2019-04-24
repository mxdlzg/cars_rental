import {queryRentalOptions, queryStores, queryCars} from '@/services/rental';
import {message} from "antd";

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
        shortRent: [], weekRent: [], monthRent: [],
        loadedPage: [-1, -1, -1]
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
                type: state.rental.tabIndex,
                ...state.rental.dates,
            }));
            const res = yield call(queryCars, payload);
            const localPay = yield select((state) => ({
                tabIndex: state.rental.tabIndex
            }));
            yield put({
                type: 'saveCars',
                payload: {tab: localPay.tabIndex, ...res.data}
            })
        },
        * searchRentalLoadMore(_, {call, put, select}) {
            const pay = yield select((state) => ({
                more: true,
                start: state.rental.originLocation,
                end: state.rental.aimLocation,
                ...state.rental.dates,
                type: state.rental.tabIndex,
                page: state.rental.loadedPage[state.rental.tabIndex - 1],
            }));
            const localPay = yield select((state) => ({
                tabIndex: state.rental.tabIndex
            }));
            if (pay.page === -1) {
                message.success("已加载全部内容");
                return;
            }
            const res = yield call(queryCars, pay);
            yield put({
                type: 'saveCars',
                payload: {tab: localPay.tabIndex, ...res.data}
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
            if (payload) {
                state.loadedPage[payload.tab-1] = payload.last ? -1 : payload.number;
                switch (payload.tab) {
                    case 1:
                        state.shortRent = state.shortRent.concat(payload.content);
                        break;
                    case 2:
                        state.weekRent = state.weekRent.concat(payload.content);
                        break;
                    case 3:
                        state.monthRent = state.monthRent.concat(payload.content);
                        break;
                    default:
                        return {
                            ...state,
                            shortRent: payload.data.short,
                            weekRent: payload.data.week,
                            monthRent: payload.data.month,
                            loadedPage: [0, 0, 0]
                        };
                }
            }
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