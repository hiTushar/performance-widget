import './Ring.css';
import { PerformanceData } from '../../types/Types';
import { useMemo, useRef } from 'react';
import { inRadians } from '../../utils/Utils';

const MAX_RINGS = 3;
const RING_BASE_POSITION = -120;
const RING_GAP = 18;
const RING_WIDTH = 117;
const RING_ITEM_SIZE = 6;
const GAP_ANGLE = [40, 29.5, 23.5];
const MAIN_ANGLE = 90;

const Ring: React.FC<{ ringId: string, ringData: string[], hierarchy: { [key: regex]: string }, handleClick: (data: PerformanceData, ringId: string) => void, setExpand: (expand: boolean | null) => void, dataRef: React.MutableRefObject<PerformanceData[]>, ringDataRef: React.MutableRefObject<PerformanceData[][]> }> = ({ ringId, ringData, hierarchy, handleClick, setExpand, dataRef, ringDataRef }) => {
    const ringRef = useRef<HTMLDivElement>(null);
    const rotationAngleRef = useRef<number>(0);

    const ringWidth = useMemo(() => {
        return RING_WIDTH + 2 * +ringId.slice(-1) * RING_GAP;
    }, [ringId]);

    const anglePosArray = useMemo(() => {
        let centerIndex = Math.floor(ringData.length / 2);
        let anglePosArray = ringData.map((_, index) => MAIN_ANGLE - GAP_ANGLE[+ringId.slice(-1)] * (index - centerIndex));
        return anglePosArray;
    }, [hierarchy]);
    console.log(anglePosArray);

    const getTopOffset = (ringId: regex) => {
        if (hierarchy[ringId].length && ringDataRef.current[ringId].length) {
            return `${(RING_GAP * (+ringId.slice(-1) + 1)) + RING_BASE_POSITION - 2 * +ringId.slice(-1) * RING_GAP}cqw`;
        }
        if (!hierarchy[ringId].length && ringDataRef.current[ringId].length) {
            return `${(RING_GAP * (+ringId.slice(-1))) + RING_BASE_POSITION - 2 * +ringId.slice(-1) * RING_GAP}cqw`;
        }
    }

    const getRingAnimation = (ringId: regex) => {
        if (hierarchy[ringId].length && ringDataRef.current[ringId].length) {
            return '';
        }
        if (!hierarchy[ringId].length && ringDataRef.current[ringId].length) {
            return 'slideIn 0.5s linear 0.5s 1 forwards';
        }
    }

    const getXPosition = (index, ringId) => {
        let theta = anglePosArray[index];
        let x = Math.cos(inRadians(theta)) * (ringWidth) / 2 + ringWidth / 2 - RING_ITEM_SIZE / 2;
        return `${x - 2}cqw`;
    }

    const getYPosition = (index) => {
        let theta = anglePosArray[index];
        let y = Math.sin(inRadians(theta)) * (ringWidth) / 2 + ringWidth / 2 - RING_ITEM_SIZE / 2;
        return `${y - 0.5}cqw`;
    }

    const scoreClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: PerformanceData, ringId: regex) => {
        let angle = e.currentTarget.dataset.angle;
        let centerAngle = MAIN_ANGLE;
        rotationAngleRef.current = centerAngle - +angle;
        handleClick(e, data, ringId)
    }

    return (
        <div
            id={ringId}
            className="ring"
            style={{
                zIndex: MAX_RINGS - +ringId.slice(-1),
                top: getTopOffset(ringId), // a static offset value when no animation is needed
                animation: getRingAnimation(ringId), // instead of using a class toggle, applying animation directly inline
                '--slide-in-offset': `${RING_GAP}cqw`,
                width: `${ringWidth}cqw`,
                opacity: ringData.length ? 1 : 0
            }}
            ref={ringRef}
        >
            {
                ringData.map((paramId: string, index: number) => {
                    let data: PerformanceData = dataRef.current.find((param: PerformanceData) => param.param_id === paramId)!;
                    return (
                        <div
                            className={`ring-item ${!hierarchy[ringId].length ? 'popup' : ''}`} // don't animate if a param (hierarchy) from this ring has already been selected
                            style={{
                                '--scale': `${!hierarchy[ringId].length ? 0 : 1}`,
                                // transform: `scale(${!hierarchy[ringId].length ? 0 : 1})`,
                                left: getXPosition(index, ringId),
                                top: getYPosition(index, ringId)
                            }}
                            onClick={(e) => scoreClick(e, data, ringId)}
                            key={`${ringId}-${paramId}`}
                            data-angle={anglePosArray[index]}
                        >
                            <div className="ring-item__name">{data.param_name}</div>
                            <div className="ring-item__score">{data.param_score}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Ring;
