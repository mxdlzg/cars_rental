import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCarDetail(params) {
    return request(`/api/car/${params}`);
}

export async function queryOrderPriceDetail(params) {
    return request(`/api/order/queryPrice?${stringify(params)}`);
}