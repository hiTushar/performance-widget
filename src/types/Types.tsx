interface ApiData {
    components: PerformanceData[];
    score: number;
    last_week_score: number;
}

interface PerformanceData {
    param_id: string;
    param_name: string;
    param_score: number;
    last_week_score: number;
    children: Array<string>;
    primary: boolean;
}

interface RingInterface {
    ringId: RingId,
    allRingsData: { [key in RingId]: Array<RingParamUI> },
    hierarchy: { [key in RingId]: string },
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: PerformanceData, ringId: RingId) => void,
    apiData: PerformanceData[]
}

interface ScoreRingInterface {
    score: number,
    lastWeekScore: number,
    hierarchy: { [key in RingId]: string }
}

type RingId = 'ring0' | 'ring1' | 'ring2';

type DataStatusType = 'LOADING' | 'OK' | 'EMPTY' | 'ERROR';

type HierarchyInterface = {
    [key in RingId]: string;
}

type RingParamUI = {
    param_id: String,
    param_color: String
}

type RingDataRef = {
    [key in RingId]: Array<RingParamUI>;
}

type BranchInterface = {
    ringId: RingId,
    hierarchy: { [key in RingId]: string },
    allRingsData: { [key in RingId]: Array<RingParamUI> }
}

export type { ApiData, PerformanceData, RingInterface, RingId, ScoreRingInterface, DataStatusType, HierarchyInterface, RingDataRef, RingParamUI, BranchInterface };
