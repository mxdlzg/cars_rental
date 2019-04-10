import {query as queryUsers, queryCurrent} from '@/services/user';
import {getUserToken} from "@/utils/userInfo";

export default {
    namespace: 'user',

    state: {
        list: [],
        currentUser: {},
        currentToken: {},
    },

    effects: {
        * fetch(_, {call, put}) {
            const response = yield call(queryUsers);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        * fetchCurrent(_, {call, put}) {
            let token = getUserToken();
            if (token.username) {
                const response = yield call(queryCurrent, token);
                yield put({
                    type: 'saveCurrentUser',
                    payload: response,
                });
            }else {
                yield put({
                    type: 'saveCurrentUser',
                    payload: {status:"invalid"},
                });
            }
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        saveCurrentToken(state, action) {
            return {
                ...state,
                currentToken: action.payload || {}
            }
        },
        saveCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload || {},
            };
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload.totalCount,
                    unreadCount: action.payload.unreadCount,
                },
            };
        },
    },
};
