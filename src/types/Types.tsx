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

interface RingInterface {
    ringId: string, 
    ringData: string[], 
    hierarchy: { [key: RingId]: string }, 
    handleClick: (data: PerformanceData, ringId: string) => void, 
    rotationAngle: number, 
    setExpand: (expand: boolean | null) => void, 
    dataRef: React.MutableRefObject<PerformanceData[]>, 
    ringDataRef: React.MutableRefObject<PerformanceData[]> 
}

type RingId = 'ring0' | 'ring1' | 'ring2';

export type { PerformanceData, PerformanceScore, RingInterface, RingId };
