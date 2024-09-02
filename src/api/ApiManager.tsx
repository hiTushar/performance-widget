import performanceData from './dataBank/data2.json';

import ApiMethods from "./ApiMethods";
import { ApiData } from '../types/Types';
import ENDPOINTS from './Endpoints';

const BASE_URL = 'api.xyz.com';
const DEMO = true;

class ApiManager {
    static getPerformanceData(): Promise<ApiData> {
        let timestamp = new Date().valueOf();
        let url = `${BASE_URL}${ENDPOINTS.DATA(timestamp)}`;
        if (DEMO) {
            return new Promise((resolve) => {
                console.log('Fetching overview data...');
                setTimeout(() => {
                    console.log('Data fetched!');
                    resolve(performanceData as ApiData);
                }, 1500)
            })
        }
        
        return ApiMethods.get<ApiData>(url);
    }
}

export default ApiManager;
