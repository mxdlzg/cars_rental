import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryRentalOptions() {
    return request('/api/rental/filter-conditions');
}

export async function queryStores(params) {
    return request(`/api/rental/stores?${stringify(params)}`);
}

export async function queryCars(params) {
    return request(`/api/rental/cars?${stringify(params)}`);
}