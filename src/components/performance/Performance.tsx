import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import './Performance.css'
import { collapseSvg, expandSvg } from "../../assets/assets";
import data2 from '../../api/dataBank/data2.json';
import Ring from "../ring/Ring";
import { ApiData, DataStatusType, HierarchyInterface, PerformanceData, RingDataRef, RingId } from "../../types/Types";
import ScoreRing from "../scoreRing/ScoreRing";
import ApiManager from "../../api/ApiManager";
import DataStatusScreen from "../dataStatus/DataStatus";
import { useDispatch } from "react-redux";
import { toggleModal } from "../../redux/actions/modalAction";

const MAX_RINGS = 3;

const Performance = () => {
    const [hierarchy, setHierarchy] = useState<HierarchyInterface>({
        ring0: '',
        ring1: '',
        ring2: ''
    })

    const [expand, setExpand] = useState<boolean | null>(null);

    const ringDataRef = useRef<RingDataRef>({
        ring0: [],
        ring1: [],
        ring2: []
    });

    const dataStatus = useRef<DataStatusType>('LOADING');
    const [data, setData] = useState<ApiData>({ components: [], score: 0, last_week_score: 0 });

    // const dataRef = useRef(data2.components);
    const scoreRef = useRef({ score: data2.score, last_week_score: data2.last_week_score });

    const expandRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();
    // const [openPanel, setOpenPanel] = useState(false);

    useEffect(() => {
        if (data.components.length === 0) {
            dataStatus.current = 'LOADING';
            ApiManager.getPerformanceData().then((res: ApiData) => {
                if (res.components.length === 0 || Object.keys(res).length === 0) {
                    setData(res);
                    dataStatus.current = 'EMPTY';
                }
                else {
                    setData(res);
                    dataStatus.current = 'OK';
                }
            }).catch(() => {
                setData({ components: [], score: 0, last_week_score: 0 })
                dataStatus.current = 'ERROR';
            });
        }
    }, [])


    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: PerformanceData, ringId: RingId) => {
        console.log(e);
        let hierarchyObj;
        if (expand !== true) {
            setExpand(true);
        }
        else {
            setHierarchy(prev => {
                hierarchyObj = { ...prev };
                hierarchyObj[ringId] = data.param_id;
                for (let i = +ringId.slice(-1) + 1; i < MAX_RINGS; i++) {
                    hierarchyObj[`ring${i}` as RingId] = '';
                }
                return hierarchyObj;
            })
        }
    }

    const getAnimation = (expand: boolean | null) => {
        if (expand === null) {
            return '';
        }
        else {
            if (expand) {
                return 'expand 1s ease-in-out 1s forwards';
            }
            else {
                return 'collapse 1s ease-in-out forwards';
            }
        }
    }

    const expandWidget = (expandParam: boolean | null) => {
        // document.querySelector<HTMLElement>('.performance__expand')!.style.display = 'none';
        expandRef.current!.style.display = 'none';

        let event = new CustomEvent('expand', { detail: { expand: !expandParam } });
        document.dispatchEvent(event);

        if (expandParam) {
            setHierarchy({
                ring0: '',
                ring1: '',
                ring2: ''
            });

            // let tempPrimary = _.filter(dataRef.current, { primary: true }).map(param => param.param_id);
            // ringDataRef.current = {
            //     ring0: [...tempPrimary],
            //     ring1: [],
            //     ring2: []
            // };
        }
        setExpand(expandParam => !expandParam);
        // eventEmitter.emit('expand', !prev);
    }

    if (!hierarchy.ring0) {
        let tempPrimary = _.filter(data.components, { primary: true }).map((param, idx) => ({ 'param_id': param.param_id, 'param_color': `var(--item-${idx + 1})` }));
        ringDataRef.current = {
            ring0: [...tempPrimary],
            ring1: [],
            ring2: []
        };
    }
    else {
        let newObj = { ...ringDataRef.current };
        for (let i = 0; i < MAX_RINGS; i++) {
            if (i !== MAX_RINGS - 1) {
                let tempSecondary = _.filter(data.components, { param_id: hierarchy[`ring${i}` as RingId] })[0]?.children;
                if (tempSecondary) {
                    newObj[`ring${i + 1}` as RingId] = tempSecondary.map((paramId, idx) => ({ 'param_id': paramId, 'param_color': `var(--item-${idx + 1})` }));
                }
                else {
                    newObj[`ring${i + 1}` as RingId] = [];
                }
            }
            ringDataRef.current = { ...newObj };
        }
    }

    return (
        dataStatus.current !== 'OK' ? (
            <DataStatusScreen status={dataStatus.current} />
        ) : (
            <div
                className='performance'
                style={{
                    animation: getAnimation(expand)
                }}
                onAnimationEnd={() => {
                    expandRef.current!.style.display = 'block'
                    if(expand) {
                        document.querySelector<HTMLElement>('.performance__modal-button')!.style.display = 'block';
                    }
                }}
            >
                <div style={{
                    opacity: 0,
                    position: 'absolute',
                    zIndex: 10,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        border: 'solid 1px yellow',
                        flex: 1
                    }}></div>
                    <div style={{
                        border: 'solid 1px yellow',
                        flex: 1
                    }}></div>
                </div>
                <div ref={expandRef} className='performance__expand' onClick={() => expandWidget(expand)}>
                    {
                        expand ? <img src={collapseSvg} alt='collapse' /> : <img src={expandSvg} alt='expand' />
                    }
                </div>
                <div className='performance__rings'>
                    <ScoreRing
                        score={scoreRef.current.score}
                        lastWeekScore={scoreRef.current.last_week_score}
                        hierarchy={hierarchy}
                    />
                    {
                        Object.keys(ringDataRef.current).map((ringId) => (
                            <Ring
                                ringId={ringId as RingId}
                                allRingsData={ringDataRef.current}
                                hierarchy={hierarchy}
                                handleClick={handleClick}
                                apiData={data.components}
                                key={ringId}
                            />
                        ))
                    }
                </div>
                <div className='performance__inspect'></div>
                {
                    expand && (
                        <div 
                            className='performance__modal-button'
                            onClick={() => dispatch(toggleModal(true))}
                        >
                            How is this scored?
                        </div>
                    )
                }
            </div>
        )
    )
}

export default Performance;
