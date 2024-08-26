import './Ring.css';
import { PerformanceData, RingId, RingInterface } from '../../types/Types';
import { useMemo, useRef } from 'react';
import { inRadians } from '../../utils/Utils';
import _ from 'lodash';

const MAX_RINGS = 3;
const RING_GAP = 19;
const FIRST_RING_GAP = 40;
const RING_WIDTH = 117;
const RING_ITEM_SIZE = 6;
const GAP_ANGLE = [30, 22.5, 18];
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
        if (hierarchy[ringId].length) {
            let selectedScoreIndex = _.findIndex(ringData, (param) => param.param_id === hierarchy[ringId]);

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

        if (!hierarchy[ringId].length && ringDataRef.current[ringId].length) {
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
        if (!hierarchy[ringId].length && ringDataRef.current[ringId].length) {
            return 'slideIn 0.5s linear 0.5s 1 forwards';
        }
        return '';
    }

    const getXPosition = (index) => {
        let theta = anglePosArray[index];
        let x = Math.cos(inRadians(theta)) * (ringWidth) / 2 + ringWidth / 2 - RING_ITEM_SIZE / 2;
        return `${x - 3}cqw`;
    }

    const getYPosition = (index) => {
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
            if (!ringDataRef.current[ringId].length)
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

    const scoreClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: PerformanceData, ringId: regex) => {
        // let angle = e.currentTarget.dataset.angle;
        // let centerAngle = MAIN_ANGLE;
        // rotationAngleRef.current = centerAngle - +angle;
        handleClick(e, data, ringId)
    }

    const getItemAnimation = (paramId: string, selectedParamId: string) => {
        if (!selectedParamId) return '';

        if (paramId === selectedParamId) {
            return 'selected 1s linear 0s 1 forwards';
        }
        else {
            return 'notSelected 1s linear 0s 1 forwards';
        }
    }

    const getBorderColor = (hierarchy, ringId, ringData) => {
        if (hierarchy[ringId]) {
            let selectedParamColor = _.filter(ringData, { param_id: hierarchy[ringId] })[0].param_color.replace(')', '-mild)');
            return selectedParamColor;
        }
        else {
            return 'var(--blue-1)';
        }
    }

    const getTextColor = (hierarchy, ringId, paramId) => {
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
            }}
            ref={ringRef}
        >
            {
                ringData.map((param_ring: { param_id: string, param_color: string }, index: number) => {
                    let data: PerformanceData = dataRef.current.find((param: PerformanceData) => param.param_id === param_ring.param_id)!;
                    return (
                        <div
                            className={`ring-item ${!hierarchy[ringId].length ? 'popup' : ''}`} // don't animate if a param (hierarchy) from this ring has already been selected
                            style={{
                                '--scale': `${!hierarchy[ringId].length ? 0 : 1}`,
                                // transform: `scale(${!hierarchy[ringId].length ? 0 : 1})`,
                                left: getXPosition(index, ringId),
                                top: getYPosition(index, ringId),
                                '--item-color': param_ring.param_color,
                                animation: getItemAnimation(param_ring.param_id, hierarchy[ringId])
                            }}
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
