import performanceData from './dataBank/data2.json';
import scoreData from './dataBank/score.json';

import ApiMethods from "./ApiMethods";
import { PerformanceData, PerformanceScore } from '../types/Types';
import ENDPOINTS from './Endpoints';

const BASE_URL = 'api.xyz.com';
const DEMO = true;

class ApiManager {
    static getPerformanceData(): Promise<Array<PerformanceData>> {
        let timestamp = new Date().valueOf();
        let url = `${BASE_URL}${ENDPOINTS.DATA(timestamp)}`;
        if (DEMO) {
            return new Promise((resolve) => {
                console.log('Fetching overview data...');
                setTimeout(() => {
                    console.log('Data fetched!');
                    resolve(performanceData);
                }, 2000)
            })
        }
        
        return ApiMethods.get<Array<PerformanceData>>(url);
    }

    static getPerformanceScore(): Promise<PerformanceScore> {
        let timestamp = new Date().valueOf();
        let url = `${BASE_URL}${ENDPOINTS.SCORE(timestamp)}`;
        if (DEMO) {
            return new Promise((resolve) => {
                console.log('Fetching overview data...');
                setTimeout(() => {
                    console.log('Data fetched!');
                    resolve(scoreData);
                }, 2000)
            })
        }
        
        return ApiMethods.get<PerformanceScore>(url);
    }
}

export default ApiManager;
