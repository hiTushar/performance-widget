import './Ring.css';
import { PerformanceData, RingInterface } from '../../types/Types';
import { useEffect, useMemo, useRef } from 'react';
import { inRadians } from '../../utils/Utils';
import { get } from 'lodash';

const MAX_RINGS = 3;
const RING_BASE_POSITION = -120;
const RING_GAP = 25;
const FIRST_RING_GAP = 36;
const RING_WIDTH = 117;
const RING_ITEM_SIZE = 6;
const GAP_ANGLE = [30, 20.5, 15.7];
const MAIN_ANGLE = 90;

const Ring: React.FC<RingInterface> = ({ ringId, ringData, hierarchy, handleClick, setExpand, dataRef, ringDataRef }) => {
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
        let totalOffset = 0;

        let initialOffset = -(RING_WIDTH + 2 * +ringId.slice(-1) * RING_GAP);
        totalOffset += initialOffset;

        if(hierarchy[ringId].length) {
            let hierarchySetOffset = FIRST_RING_GAP + RING_GAP * +ringId.slice(-1);
            totalOffset += hierarchySetOffset;
        }

        if(!hierarchy[ringId].length && ringDataRef.current[ringId].length) {
            let dataSetOffset = 0;
            if(ringId !== 'ring0') {
                dataSetOffset += FIRST_RING_GAP;
                dataSetOffset += RING_GAP * (+ringId.slice(-1) - 1);
            }
            totalOffset += dataSetOffset;
        }

        return `${totalOffset}cqw`;
    }

    const getSlideInOffset = (ringId: regex) => {
        if(ringId === 'ring0') {
            return FIRST_RING_GAP;
        }
        else {
            return RING_GAP;
        }
    }

    const getRingAnimation = (ringId: regex) => {
        if (!hierarchy[ringId].length && ringDataRef.current[ringId].length) {
            return 'slideIn 0.5s linear 0.5s 1 forwards';
        }
        return '';
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

    const getOpacity = (ringId: regex) => {
        let opacity = 1;
        if(ringId === 'ring0') {
            opacity = 1;
        }
        else {
            if(!ringDataRef.current[ringId].length) 
                opacity = 0;
            else {
                if(!hierarchy[ringId].length) 
                    opacity = 0;
                else 
                    opacity = 1;
            }
        }
        return opacity;
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
                top: getTopOffset(ringId), // a static offset value when no animation is needed
                animation: getRingAnimation(ringId), // instead of using a class toggle, applying animation directly inline
                '--slide-in-offset': `${getSlideInOffset(ringId)}cqw`,
                width: `${ringWidth}cqw`,
                opacity: getOpacity(ringId)
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
