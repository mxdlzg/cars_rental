import request from '@/utils/request';
import {stringify} from "qs";

export async function query() {
    return request('/api/users');
}

export async function queryCurrent(params) {
    return request(`/api/currentUser?${stringify(params)}`,null,false);
}
export async function queryCurrentMI() {
    return request(`/api/currentUser/permissions`);
}