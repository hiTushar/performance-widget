const ENDPOINTS = {
    DATA: (timestamp: number) => `/performance/data?t=${timestamp}`,
    SCORE: (timestamp: number) => `/performance/score?t=${timestamp}`,
}

export default ENDPOINTS;
