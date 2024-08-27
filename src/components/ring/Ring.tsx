import './Ring.css';
import { HierarchyInterface, PerformanceData, RingId, RingInterface, RingParamUI } from '../../types/Types';
import React, { useMemo, useRef } from 'react';
import { getDistance, inRadians } from '../../utils/Utils';
import _ from 'lodash';

const MAX_RINGS = 3;
const RING_GAP = 19;
const FIRST_RING_GAP = 40;
const RING_WIDTH = 117;
const RING_ITEM_SIZE = 6;
const ITEM_GAP_ANGLE = [30, 22.5, 18];
const BRANCH_GAP_ANGLE = [70, 68, 66];
const MAIN_ANGLE = 90;

const Ring: React.FC<RingInterface> = ({ ringId, ringData, hierarchy, handleClick, apiData }) => {
    const ringRef = useRef<HTMLDivElement>(null);

    const ringWidth = useMemo(() => {
        return RING_WIDTH + 2 * +ringId.slice(-1) * RING_GAP;
    }, [ringId]);

    const anglePosArray = useMemo(() => {
        let centerIndex = Math.floor(ringData.length / 2);
        let anglePosArray = ringData.map((_, index) => MAIN_ANGLE - ITEM_GAP_ANGLE[+ringId.slice(-1)] * (index - centerIndex));
        if (hierarchy[ringId].length) {
            let selectedScoreIndex = _.findIndex(ringData, (param) => param.param_id === hierarchy[ringId]);


            let indexDiff = selectedScoreIndex - centerIndex;
            if (indexDiff < 0) {

            }
            let temp = anglePosArray[centerIndex];
            anglePosArray[centerIndex] = anglePosArray[selectedScoreIndex];
            anglePosArray[selectedScoreIndex] = temp;
        }
        return anglePosArray;
    }, [hierarchy]);

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
        let originCenter = ringWidth / 2 - RING_ITEM_SIZE / 2;
        let x = originCenter + Math.cos(inRadians(theta)) * (ringWidth) / 2;
        return `${x}cqw`;
    }

    const getYPosition = (index: number) => {
        let theta = anglePosArray[index];
        let originCenter = ringWidth / 2 - RING_ITEM_SIZE / 2;
        let y = originCenter + Math.sin(inRadians(theta)) * (ringWidth) / 2;
        return `${y}cqw`;
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

    const Branches = () => {
        if (!ringData.length) return;
        let centerIndex = Math.floor(ringData.length / 2);
        let stdAnglePosArray = ringData.map((_, index) => MAIN_ANGLE - ITEM_GAP_ANGLE[+ringId.slice(-1)] * (index - centerIndex));

        let allRingItemCoords = ringData.reduce<{ [key: string]: [number, number] }>((acc, _, index) => {
            let theta = stdAnglePosArray[index];
            let originCenter = ringWidth / 2;
            let x = originCenter + Math.cos(inRadians(theta)) * (ringWidth) / 2;
            let y = originCenter + Math.sin(inRadians(theta)) * (ringWidth) / 2;
            return Object.assign(acc, {
                [`item${index}`]: [x, y]
            });
        }, {});

        let rootCoords = [
            allRingItemCoords[`item${centerIndex}`][0],
            allRingItemCoords[`item${centerIndex}`][1] - RING_GAP
        ];

        let allRingItemLengths = ringData.reduce<{ [key: string]: number }>((acc, _, index) => {
            return { ...acc, [`item${index}`]: getDistance(allRingItemCoords[`item${index}`][0], allRingItemCoords[`item${index}`][1], rootCoords[0], rootCoords[1]) };
        }, {});

        let branchAngleArray = ringData.map((_, index) => MAIN_ANGLE - BRANCH_GAP_ANGLE[+ringId.slice(-1)] * (index - centerIndex));

        return (
            <div className='ring-branches'>
                {
                    Object.keys(allRingItemLengths).map((key, index) => {
                        return (
                            <div
                                className='ring-branches__branch'
                                style={{
                                    '--branch-left': `${rootCoords[0]}cqw`,
                                    '--branch-top': `${rootCoords[1]}cqw`,
                                    '--branch-width': `${allRingItemLengths[key]}cqw`,
                                    '--branch-transform': `rotate(${branchAngleArray[index]}deg)`,
                                } as React.CSSProperties}
                                key={allRingItemLengths[key] + index}
                            >

                            </div>
                        )
                    })
                }
            </div>
        )
    }

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
            <Branches />
            <div style={{
                position: 'absolute',
                zIndex: 10,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                pointerEvents: 'none'
            }}>
                <div style={{
                    border: 'solid 1px yellow'
                }}></div>
                <div style={{
                    border: 'solid 1px yellow'
                }}></div>
                <div style={{
                    border: 'solid 1px yellow'
                }}></div>
                <div style={{
                    border: 'solid 1px yellow'
                }}></div>
            </div>
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
