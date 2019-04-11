//import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryRentalOptions() {
    return request('/api/rental/filter-conditions');
}