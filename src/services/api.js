import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
    return request('/api/project/notice');
}

export async function queryActivities() {
    return request('/api/activities');
}

export async function queryRule(params) {
    return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
    return request('/api/rule', {
        method: 'POST',
        body: {
            ...params,
            method: 'delete',
        },
    });
}

export async function addRule(params) {
    return request('/api/rule', {
        method: 'POST',
        body: {
            ...params,
            method: 'post',
        },
    });
}

export async function updateRule(params = {}) {
    return request(`/api/rule?${stringify(params.query)}`, {
        method: 'POST',
        body: {
            ...params.body,
            method: 'update',
        },
    });
}

export async function fakeSubmitForm(params) {
    return request('/api/forms', {
        method: 'POST',
        body: params,
    });
}

export async function fetchOverview() {
    return request('/api/analysis/overview');
}

export async function fetchSaleSta(params) {
    return request(`/api/analysis/saleStatistic?${stringify(params)}`)
}

export async function fetchSaleType() {
    return request('/api/analysis/saleType');
}

export async function fetchStoresSale() {
    return request('/api/analysis/storesSale');
}

export async function fetchStoreSale(params) {
    return request(`/api/analysis/storesSale/${params}`)
}

export async function queryTags() {
    return request('/api/tags');
}

export async function queryBasicProfile(id) {
    return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
    return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
    return request(`/api/fake_list?${stringify(params)}`);
}

export async function queryIndexList() {
    return request(`/api/indexList`);
}

export async function queryIndexListMore(params) {
    return request(`/api/indexList/more?${stringify(params)}`);
}

export async function removeFakeList(params) {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
        method: 'POST',
        body: {
            ...restParams,
            method: 'delete',
        },
    });
}

export async function addFakeList(params) {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
        method: 'POST',
        body: {
            ...restParams,
            method: 'post',
        },
    });
}

export async function updateFakeList(params) {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
        method: 'POST',
        body: {
            ...restParams,
            method: 'update',
        },
    });
}

export async function fakeAccountLogin(params) {
    return request('/api/login/account', {
        method: 'POST',
        body: params,
    });
}

export async function fakeRegister(params) {
    return request('/api/register', {
        method: 'POST',
        body: params,
    });
}

export async function queryNotices(params = {}) {
    return request(`/api/notices?${stringify(params)}`);
}

//TODO:: 便于后端获取参数，此处请求编入URL
export async function clearNotices(params) {
    return request(`/api/clearNotices?${stringify(params)}`, {
        method: 'DELETE',
        body: params,
    });
}

export async function changeNoticeRead(params) {
    return request(`/api/changeNoticeRead?${stringify(params)}`, {
        method: 'PUT',
        body: params,
    });
}

export async function getFakeCaptcha(mobile) {
    return request(`/api/captcha?mobile=${mobile}`);
}