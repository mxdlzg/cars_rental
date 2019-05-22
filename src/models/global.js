import {changeNoticeRead, clearNotices, queryNotices} from '@/services/api';
import {message} from 'antd';

export default {
    namespace: 'global',

    state: {
        collapsed: false,
        notices: [],
    },

    effects: {
        * fetchNotices(_, {call, put, select}) {
            const data = yield call(queryNotices);
            if (data.success) {
                yield put({
                    type: 'saveNotices',
                    payload: data.data,
                });
                const unreadCount = yield select(
                    state => state.global.notices.filter(item => !item.read).length
                );
                yield put({
                    type: 'user/changeNotifyCount',
                    payload: {
                        totalCount: data.data.length,
                        unreadCount,
                    },
                });
            }else {
                message.warn("通知获取失败，"+data.msg);
            }
        },
        * clearNotices({payload}, {call, put, select}) {
            const res = yield call(clearNotices,{"type":payload});
            if (res.success) {
                yield put({
                    type: 'saveClearedNotices',
                    payload,
                });
                const count = yield select(state => state.global.notices.length);
                const unreadCount = yield select(
                    state => state.global.notices.filter(item => !item.read).length
                );
                yield put({
                    type: 'user/changeNotifyCount',
                    payload: {
                        totalCount: count,
                        unreadCount,
                    },
                });
            }else {
                message.warn(res.msg);
            }
        },
        * changeNoticeReadState({payload}, {call, put, select}) {
            const res = yield call(changeNoticeRead,{"id":payload,"read":true});
            if (res.success && res.data) {
                const notices = yield select(state =>
                    state.global.notices.map(item => {
                        const notice = {...item};
                        if (notice.id === payload) {
                            notice.read = true;
                        }
                        return notice;
                    })
                );
                yield put({
                    type: 'saveNotices',
                    payload: notices,
                });
                yield put({
                    type: 'user/changeNotifyCount',
                    payload: {
                        totalCount: notices.length,
                        unreadCount: notices.filter(item => !item.read).length,
                    },
                });
            }else {
                message.error(res.msg);
            }
        },
    },

    reducers: {
        changeLayoutCollapsed(state, {payload}) {
            return {
                ...state,
                collapsed: payload,
            };
        },
        saveNotices(state, {payload}) {
            return {
                ...state,
                notices: payload,
            };
        },
        saveClearedNotices(state, {payload}) {
            return {
                ...state,
                notices: state.notices.filter(item => item.type !== payload),
            };
        },
    },

    subscriptions: {
        setup({history}) {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            return history.listen(({pathname, search}) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        },
    },
};
