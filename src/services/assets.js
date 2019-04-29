import request from "@/utils/request";
import {stringify} from "qs";

export async function queryCouponsList(params) {
    return request(`/api/assets/queryCouponsList?${stringify(params)}`)
}