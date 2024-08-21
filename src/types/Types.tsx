interface PerformanceData {
    param_id: string;
    param_name: string;
    param_score: number;
    last_week_score: number;
    children: Array<string>;
    primary: boolean;
}

interface PerformanceScore {
    total_score: number;
    score: number;
    last_week_score: number;
}

export type { PerformanceData, PerformanceScore };
