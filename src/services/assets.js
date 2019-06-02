import request from "@/utils/request";
import {stringify} from "qs";

export async function queryCouponsList(params) {
    return request(`/api/assets/queryCouponsList?${stringify(params)}`)
}

export async function queryStoreCarList(params) {
    return request(`/api/assets/storeCarList?${stringify(params)}`)
}

export async function addCar(params) {
    return request(`/api/assets/addCar`, {
        method: 'POST',
        body: {
            ...params,
            method: 'post',
        },
    });
}

export async function removeCars(params) {
    return request(`/api/assets/removeCars?${stringify(params)}`, {
        method: 'PUT',
        body: {
            ...params,
        },
    });
}