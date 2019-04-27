import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCarDetail(params) {
    return request(`/api/car/${params}`);
}

export async function queryOrderPriceDetail(params) {
    return request(`/api/order/queryPrice?${stringify(params)}`);
}

export async function addOrder(params) {
    return request(`/api/order/submitOrder`,{
        method:"POST",
        body:{
            ...params,
            method :"post"
        }
    })
}

export async function queryPayInfo(params) {
    return request(`/api/order/queryPayInfo?${stringify(params)}`);
}