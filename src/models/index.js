import {
    queryFakeList,
    removeFakeList,
    addFakeList,
    updateFakeList,
    queryIndexList,
    queryIndexListMore
} from '@/services/api';

import {message} from 'antd';
import {queryCarDetail} from "@/services/order";

export default {
    namespace: 'index',

    state: {
        recommendation: [{
            title: "车辆名称",
            updatedAt: "2019-05-26 10:28",
            description: "测试车辆",
            href: 2,
            logo: "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
            percent: 0.5
        }, {
            title: "车辆名称",
            updatedAt: "2019-05-26 10:28",
            description: "测试车辆",
            href: 2,
            logo: "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
            percent: 0.5
        }],
        strategy: [{
            title: "这是一篇攻略",
            cover: "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
            subDescription: "这是攻略的简略缩写，攻略概览、攻略介绍",
            updatedAt: "2019-05-26 10:28",
            members: [{
                id: 1,
                name: "mxdlzg",
                avatar: "https://image01.oneplus.cn/user/201707/09/192/bc4092498dd6db5acbee464189ea8e4f.jpg"
            }]
        }],
        comments: [{
            id: 11,
            star: 5,
            like: 152,
            message: 19,
            title: "车辆名称",
            href: "https://ant.design",
            content: "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
            updatedAt: "2019-05-26 10:28",
            avatar: "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
            owner: "系统",
            label: "短租|1.5排量"
        }],
        currentPage: [-1, -1, -1],
        currentCarDetail: undefined
    },

    effects: {
        * fetch(_, {call, put}) {
            const response = yield call(queryIndexList);
            yield put({
                type: 'queryList',
                payload: response.data,
            });
        },
        * appendFetch({payload}, {call, put}) {
            const response = yield call(queryIndexListMore, payload);
            if (response.success) {
                yield put({
                    type: 'appendList',
                    payload: {"data": response.data, "from": payload.from},
                });
            } else {
                message.error(response.msg);
            }
        },
        * fetchCarDetail({payload}, {call, put}) {
            const response = yield call(queryCarDetail, payload);
            if (response.success) {
                yield put({
                    type: 'saveCar',
                    payload: response.data,
                });
            } else {
                message.error(response.msg);
            }
        }
    },

    reducers: {
        queryList(state, {payload}) {
            const {recommendation, strategy} = payload;
            state.currentPage[0] = recommendation.last ? -1 : 0;
            state.currentPage[1] = strategy.last ? -1 : 0;
            return {
                comments: [],
                currentPage: state.currentPage,
                recommendation: recommendation.content,
                strategy: strategy.content,
            };
        },
        appendList(state, action) {
            const {data, from} = action.payload;
            let list = data.data;
            state.currentPage[from] = list.last ? -1 : list.number;
            switch (from) {
                case 0:
                    state.recommendation = state.recommendation.concat(list.content);
                    break;
                case 1:
                    state.strategy = state.strategy.concat(list.content);
                    break;
                case 2:
                    state.comments = state.comments.concat(list.content);
                    break;
                default:
                    break;
            }
            return {
                ...state,
            };
        },
        saveCar(state, {payload}) {
            return {
                ...state,
                currentCarDetail: payload
            }
        }
    },
};
