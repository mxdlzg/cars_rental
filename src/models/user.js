import {query as queryUsers, queryCurrent, queryCurrentMI} from '@/services/user';
import {getUserToken} from "@/utils/userInfo";
import {message} from 'antd';

export default {
    namespace: 'user',

    state: {
        list: [],
        currentUser: {},
        currentToken: {},
        currentUserMI:[]
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
        * fetchUserManagementInfo(_,{call,put}){
            const res = yield call(queryCurrentMI);
            if (res.success) {
                yield put({
                    type:"saveMI",
                    payload:res.data,
                })
            }else {
                message.warn(res.msg);
            }
        }
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
                currentUser: action.payload.data || {},
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
        saveMI(state,{payload}){
            return{
                ...state,
                currentUserMI:payload
            }
        }
    },
};
