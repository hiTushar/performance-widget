import React, { useMemo, useRef } from 'react';
import _ from 'lodash';
import './Ring.css';
import { BranchInterface, HierarchyInterface, PerformanceData, RingId, RingInterface, RingParamUI } from '../../types/Types';
import { getDistance, inRadians, rotateArray } from '../../utils/Utils';

const MAX_RINGS = 3;
const RING_GAP = 19;
const FIRST_RING_GAP = 40;
const RING_WIDTH = 117;
const RING_ITEM_SIZE = 6;
const ITEM_GAP_ANGLE = [30, 22.5, 18];
const BRANCH_GAP_ANGLE = [70, 68, 66];
const MAIN_ANGLE = 90;

const Ring: React.FC<RingInterface> = ({ ringId, allRingsData, hierarchy, handleClick, apiData, expand }) => {
    const ringRef = useRef<HTMLDivElement>(null);
    const branchRef = useRef<HTMLDivElement>(null);

    const ringWidth = useMemo(() => {
        return RING_WIDTH + 2 * +ringId.slice(-1) * RING_GAP;
    }, [ringId]);

    const anglePosArray = useMemo(() => {
        let ringData = allRingsData[ringId as RingId];
        let centerIndex = Math.floor(ringData.length / 2);
        let tempAnglePosArray = ringData.map((_, index) => MAIN_ANGLE - ITEM_GAP_ANGLE[+ringId.slice(-1)] * (index - centerIndex));
        if (hierarchy[ringId].length) {
            let selectedScoreIndex = _.findIndex(ringData, (param) => param.param_id === hierarchy[ringId]);
            let indexDiff = centerIndex - selectedScoreIndex;
            tempAnglePosArray = rotateArray(tempAnglePosArray, indexDiff);
        }
        return tempAnglePosArray;
    }, [hierarchy]);

    const getTopOffset = (ringId: RingId) => {
        let totalOffset = 0;

        let initialOffset = -(RING_WIDTH + 2 * +ringId.slice(-1) * RING_GAP);
        totalOffset += initialOffset;

        if (hierarchy[ringId].length) {
            let hierarchySetOffset = FIRST_RING_GAP + RING_GAP * +ringId.slice(-1);
            totalOffset += hierarchySetOffset;
        }

        if (!hierarchy[ringId].length && allRingsData[ringId as RingId].length) {
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
        if (!hierarchy[ringId].length && allRingsData[ringId as RingId].length) {
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
            if (!allRingsData[ringId as RingId].length)
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

    const scoreClick = (data: PerformanceData, ringId: RingId) => {
        // let angle = e.currentTarget.dataset.angle;
        // let centerAngle = MAIN_ANGLE;
        // rotationAngleRef.current = centerAngle - +angle;
        handleClick(data, ringId)
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

    const getBorderColor = (hierarchy: HierarchyInterface, ringId: RingId, allRingsData: { [key in RingId]: Array<RingParamUI> }) => {
        if (hierarchy[ringId as RingId]) {
            let selectedParamColor = allRingsData[ringId as RingId].find((param) => param.param_id === hierarchy[ringId as RingId])!.param_color.replace(')', '-mild)');
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

    const Branches: React.FC<BranchInterface> = ({ ringId, hierarchy, allRingsData }) => {
        if (!allRingsData[ringId as RingId].length) return;
        let centerIndex = Math.floor(allRingsData[ringId as RingId].length / 2);
        let stdAnglePosArray = allRingsData[ringId as RingId].map((_, index) => MAIN_ANGLE - ITEM_GAP_ANGLE[+ringId.slice(-1)] * (index - centerIndex));

        let allRingItemCoords = allRingsData[ringId as RingId].reduce<{ [key: string]: [number, number] }>((acc, _, index) => {
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

        let allRingItemLengths = allRingsData[ringId as RingId].reduce<{ [key: string]: number }>((acc, _, index) => {
            return { ...acc, [`item${index}`]: getDistance(allRingItemCoords[`item${index}`][0], allRingItemCoords[`item${index}`][1], rootCoords[0], rootCoords[1]) };
        }, {});

        let branchAngleArray = allRingsData[ringId as RingId].map((_, index) => MAIN_ANGLE - BRANCH_GAP_ANGLE[+ringId.slice(-1)] * (index - centerIndex));

        const getVerticalBranchColor = (ringId: RingId, hierarchy: HierarchyInterface, allRingsData: { [key in RingId]: Array<RingParamUI> }) => {
            let previousHierarchyParam: String, previousHierarchyParamColor;
            if (ringId === 'ring0') {
                previousHierarchyParamColor = 'var(--gray-6)';
            }
            else {
                previousHierarchyParam = hierarchy[`ring${+ringId.slice(-1) - 1}` as RingId];
                previousHierarchyParamColor = allRingsData[`ring${+ringId.slice(-1) - 1}` as RingId].find((param) => param.param_id === previousHierarchyParam)!.param_color.replace(')', '-mild)');
            }

            let currentHierarchyParam: String, currentHierarchyParamColor;
            if (!hierarchy[ringId as RingId]) {
                currentHierarchyParamColor = 'var(--gray-6)';
            }
            else {
                currentHierarchyParam = hierarchy[ringId as RingId];
                currentHierarchyParamColor = allRingsData[ringId as RingId].find((param) => param.param_id === currentHierarchyParam)!.param_color.replace(')', '-mild)');
            }
            return `linear-gradient(to right, ${previousHierarchyParamColor} 10%, ${currentHierarchyParamColor})`;
        }

        const getObliqueBranchColor = (ringId: RingId, hierarchy: HierarchyInterface, allRingsData: { [key in RingId]: Array<RingParamUI> }) => {
            if (ringId === 'ring0') return 'var(--gray-6)';
            else {
                let previousHierarchyParam = hierarchy[`ring${+ringId.slice(-1) - 1}` as RingId];
                let previousHierarchyParamColor = allRingsData[`ring${+ringId.slice(-1) - 1}` as RingId].find((param) => param.param_id === previousHierarchyParam)!.param_color.replace(')', '-mild)');
                return previousHierarchyParamColor;
            }
        }

        return (
            <div
                className={`ring-branches ${!hierarchy[ringId as RingId].length ? 'branch-fade-in' : ''}`}
                ref={branchRef}
                style={{
                    '--branch-opacity': hierarchy[ringId as RingId].length ? '1' : '0'
                } as React.CSSProperties}
            >
                {
                    Object.keys(allRingItemLengths).map((key, index) => {
                        if (hierarchy[ringId as RingId].length && index !== centerIndex) return null;
                        return (
                            <div
                                className={`ring-branches__branch ${index === centerIndex ? '' : 'dashed'}`}
                                style={{
                                    '--branch-left': `${rootCoords[0]}cqw`,
                                    '--branch-top': `${rootCoords[1]}cqw`,
                                    '--branch-width': `${allRingItemLengths[key] - 0.5}cqw`,
                                    '--branch-transform': `rotate(${branchAngleArray[index]}deg)`,
                                    '--branch-color': index === centerIndex ? getVerticalBranchColor(ringId, hierarchy, allRingsData) : '',
                                    '--branch-border-color': index !== centerIndex ? getObliqueBranchColor(ringId, hierarchy, allRingsData) : ''
                                } as React.CSSProperties}
                                key={allRingItemLengths[key] + index}
                            >
                            </div>
                        )
                    })
                }
            </div>
        )
    };

    const getPreviousDiff = (score: number, lastWeekScore: number) => {
        let diff = score - lastWeekScore;
        if (diff >= 0) {
            return `+${diff}`;
        }
        else {
            return `${diff}`;
        }
    }

    const getPreviousDiffColor = (score: number, lastWeekScore: number) => {
        if (lastWeekScore > score) {
            return 'var(--item-1)';
        }
        else if (lastWeekScore < score) {
            return 'var(--item-3)';
        }
        else {
            return 'var(--item-2)';
        }
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
                borderColor: getBorderColor(hierarchy, ringId, allRingsData),
                '--ring-base-color': `var(--ring-${ringId.slice(-1)})`
            } as React.CSSProperties}
            ref={ringRef}
        >
            <Branches ringId={ringId} hierarchy={hierarchy} allRingsData={allRingsData} />
            <div style={{
                opacity: 0,
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
                allRingsData[ringId as RingId].map((param_ring: { param_id: String, param_color: String }, index: number) => {
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
                                animation: getItemAnimation(param_ring.param_id, hierarchy[ringId]),
                                cursor: expand ? 'pointer' : 'default'
                            } as React.CSSProperties}
                            onClick={() => scoreClick(data, ringId)}
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
                                } as React.CSSProperties}
                            >
                                {data.param_name}
                            </div>
                            {
                                data.param_id === hierarchy[ringId] && (
                                    <div className='ring-item__previous'>
                                        <div
                                            className='ring-item__previous__diff'
                                            style={{
                                                '--prev-color': getPreviousDiffColor(data.param_score, data.last_week_score)
                                            } as React.CSSProperties}
                                        >
                                            {getPreviousDiff(data.param_score, data.last_week_score)}
                                        </div>
                                        <div className='ring-item__previous__title'>since last week</div>
                                    </div>
                                )
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Ring;
