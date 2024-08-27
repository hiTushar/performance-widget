import './Ring.css';
import { HierarchyInterface, PerformanceData, RingId, RingInterface, RingParamUI } from '../../types/Types';
import React, { useMemo, useRef } from 'react';
import { inRadians } from '../../utils/Utils';
import _ from 'lodash';

const MAX_RINGS = 3;
const RING_GAP = 19;
const FIRST_RING_GAP = 40;
const RING_WIDTH = 117;
const RING_ITEM_SIZE = 6;
const GAP_ANGLE = [30, 22.5, 18];
const MAIN_ANGLE = 90;

const Ring: React.FC<RingInterface> = ({ ringId, ringData, hierarchy, handleClick, apiData }) => {
    const ringRef = useRef<HTMLDivElement>(null);

    const ringWidth = useMemo(() => {
        return RING_WIDTH + 2 * +ringId.slice(-1) * RING_GAP;
    }, [ringId]);

    const anglePosArray = useMemo(() => {
        let centerIndex = Math.floor(ringData.length / 2);
        let anglePosArray = ringData.map((_, index) => MAIN_ANGLE - GAP_ANGLE[+ringId.slice(-1)] * (index - centerIndex));
        if (hierarchy[ringId].length) {
            let selectedScoreIndex = _.findIndex(ringData, (param) => param.param_id === hierarchy[ringId]);


            let indexDiff = selectedScoreIndex - centerIndex;
            if(indexDiff < 0) {
                
            }
            let temp = anglePosArray[centerIndex];
            anglePosArray[centerIndex] = anglePosArray[selectedScoreIndex];
            anglePosArray[selectedScoreIndex] = temp;
        }
        return anglePosArray;
    }, [hierarchy]);

    // console.log(anglePosArray);

    const getTopOffset = (ringId: RingId) => {
        let totalOffset = 0;

        let initialOffset = -(RING_WIDTH + 2 * +ringId.slice(-1) * RING_GAP);
        totalOffset += initialOffset;

        if (hierarchy[ringId].length) {
            let hierarchySetOffset = FIRST_RING_GAP + RING_GAP * +ringId.slice(-1);
            totalOffset += hierarchySetOffset;
        }

        if (!hierarchy[ringId].length && ringData.length) {
            let dataSetOffset = 0;
            if (ringId !== 'ring0') {
                dataSetOffset += FIRST_RING_GAP;
                dataSetOffset += RING_GAP * (+ringId.slice(-1) - 1);
            }
            totalOffset += dataSetOffset;
        }

        return `${totalOffset}cqw`;
    }

    const getSlideInOffset = (ringId: RingId) => {
        if (ringId === 'ring0') {
            return FIRST_RING_GAP;
        }
        else {
            return RING_GAP;
        }
    }

    const getRingAnimation = (ringId: RingId) => {
        if (!hierarchy[ringId].length && ringData.length) {
            return 'slideIn 0.5s linear 0.5s 1 forwards';
        }
        return '';
    }

    const getXPosition = (index: number) => {
        let theta = anglePosArray[index];
        let x = Math.cos(inRadians(theta)) * (ringWidth) / 2 + ringWidth / 2 - RING_ITEM_SIZE / 2;
        return `${x - 2}cqw`;
    }

    const getYPosition = (index: number) => {
        let theta = anglePosArray[index];
        let y = Math.sin(inRadians(theta)) * (ringWidth) / 2 + ringWidth / 2 - RING_ITEM_SIZE / 2;
        return `${y - 0.75}cqw`;
    }

    const getOpacity = (ringId: RingId) => {
        let opacity = 1;
        if (ringId === 'ring0') {
            opacity = 1;
        }
        else {
            if (!ringData.length)
                opacity = 0;
            else {
                if (!hierarchy[ringId].length)
                    opacity = 0;
                else
                    opacity = 1;
            }
        }
        return opacity;
    }

    const scoreClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: PerformanceData, ringId: RingId) => {
        // let angle = e.currentTarget.dataset.angle;
        // let centerAngle = MAIN_ANGLE;
        // rotationAngleRef.current = centerAngle - +angle;
        handleClick(e, data, ringId)
    }

    const getItemAnimation = (paramId: String, selectedParamId: string) => {
        if (!selectedParamId) return '';

        if (paramId === selectedParamId) {
            return 'selected 1s linear 0s 1 forwards';
        }
        else {
            return 'notSelected 1s linear 0s 1 forwards';
        }
    }

    const getBorderColor = (hierarchy: HierarchyInterface, ringId: RingId, ringData: Array<RingParamUI>) => {
        if (hierarchy[ringId as RingId]) {
            let selectedParamColor = ringData.find((param) => param.param_id === hierarchy[ringId as RingId])!.param_color.replace(')', '-mild)');
            return selectedParamColor;
        }
        else {
            return 'var(--blue-1)';
        }
    }

    const getTextColor = (hierarchy: HierarchyInterface, ringId: RingId, paramId: String) => {
        if (hierarchy[ringId]) {
            if (paramId === hierarchy[ringId]) {
                return 'var(--white)';
            }
            else {
                return 'var(--gray-2)';
            }
        }
        else {
            return 'var(--white)';
        }
    }

    console.log({ ringId, ringData, hierarchy });
    return (
        <div
            id={ringId}
            className="ring"
            style={{
                zIndex: MAX_RINGS - +ringId.slice(-1),
                top: getTopOffset(ringId), // a static offset value when no animation is needed
                animation: getRingAnimation(ringId), // instead of using a class toggle, applying animation directly inline
                '--slide-in-offset': `${getSlideInOffset(ringId)}cqw`,
                width: `${ringWidth}cqw`,
                opacity: getOpacity(ringId),
                borderColor: getBorderColor(hierarchy, ringId, ringData)
            } as React.CSSProperties}
            ref={ringRef}
        >
            {
                ringData.map((param_ring: { param_id: String, param_color: String }, index: number) => {
                    let data: PerformanceData = apiData.find((param: PerformanceData) => param.param_id === param_ring.param_id)!;
                    return (
                        <div
                            className={`ring-item ${!hierarchy[ringId].length ? 'popup' : ''}`} // don't animate if a param (hierarchy) from this ring has already been selected
                            style={{
                                '--scale': `${!hierarchy[ringId].length ? 0 : 1}`,
                                // transform: `scale(${!hierarchy[ringId].length ? 0 : 1})`,
                                left: getXPosition(index),
                                top: getYPosition(index),
                                '--item-color': param_ring.param_color,
                                animation: getItemAnimation(param_ring.param_id, hierarchy[ringId])
                            } as React.CSSProperties}
                            onClick={(e) => scoreClick(e, data, ringId)}
                            key={`${ringId}-${param_ring.param_id}`}
                            data-angle={anglePosArray[index]}
                        >
                            <div
                                className="ring-item__score"
                                style={{
                                    color: getTextColor(hierarchy, ringId, data.param_id)
                                }}
                            >
                                {data.param_score}
                            </div>
                            <div
                                className="ring-item__name"
                                style={{
                                    color: getTextColor(hierarchy, ringId, data.param_id)
                                }}
                            >
                                {data.param_name}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Ring;
