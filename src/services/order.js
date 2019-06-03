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

export async function queryOrderList(params) {
    return request(`/api/order/queryOrderList?${stringify(params)}`)
}

export async function orderDetail(params) {
    return request(`/api/order/orderDetail?${stringify(params)}`)
}

export async function cancelOrder(params) {
    return request(`/api/order/cancelOrder?${stringify(params)}`,{
        method:"DELETE",
        body:{
            params,
            method :"DELETE"
        }
    })
}

export async function payOrder(params) {
    return request(`/api/pay/payment?${stringify(params)}`,{
        method:"PUT",
        body:{
            params,
        }
    })
}

export async function takeCar(params) {
    return request(`/api/order/takeCar?${stringify(params)}`,{
        method:"PUT",
        body:{
            params,
        }
    })
}

export async function checkout(params) {
    return request(`/api/pay/checkout?${stringify(params)}`,{
        method:"PUT",
        body:{
            params,
        }
    })
}

export async function comments(params) {
    return request(`/api/order/comments`,{
        method:"PUT",
        body:{
            ...params,
            method:"put",
        }
    })
}

export async function fetchComments(params) {
    return request(`/api/order/fetchComments?${stringify(params)}`);
}