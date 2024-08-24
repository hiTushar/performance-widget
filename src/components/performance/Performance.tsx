import { useRef, useState } from "react";
import _, { set } from "lodash";
import './Performance.css'
import { collapseSvg, expandSvg } from "../../assets/assets";
import data2 from '../../api/dataBank/data2.json';
import Ring from "../ring/Ring";
import { PerformanceData } from "../../types/Types";

const MAX_RINGS = 3;

const Performance = () => {
    const [hierarchy, setHierarchy] = useState<{ [key: regex]: string }>({
        ring0: '',
        ring1: '',
        ring2: ''
    })

    const [expand, setExpand] = useState<boolean | null>(null);

    const ringDataRef = useRef<{ [key: regex]: string[] }>({
        ring0: [],
        ring1: [],
        ring2: []
    });

    const dataRef = useRef(data2);
    const expandRef = useRef<HTMLDivElement>(null);

    const [openPanel, setOpenPanel] = useState(false);



    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: PerformanceData, ringId: regex) => {
        console.log(e.currentTarget.dataset.angle);
        let hierarchyObj;
        if (expand !== true) {
            setExpand(true);
        }
        else {
            setHierarchy(prev => {
                hierarchyObj = { ...prev };
                hierarchyObj[ringId] = data.param_id;
                for (let i = +ringId.slice(-1) + 1; i < MAX_RINGS; i++) {
                    hierarchyObj[`ring${i}`] = '';
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
        if(expandParam) {
            setHierarchy({
                ring0: '',
                ring1: '',
                ring2: ''
            });

            let tempPrimary = _.filter(dataRef.current, { primary: true }).map(param => param.param_id);
            ringDataRef.current = {
                ring0: [...tempPrimary],
                ring1: [],
                ring2: []
            };
        }
        setExpand(expandParam => !expandParam);
        // eventEmitter.emit('expand', !prev);
    }

    if (!hierarchy.ring0) {
        let tempPrimary = _.filter(dataRef.current, { primary: true }).map(param => param.param_id);
        ringDataRef.current.ring0 = tempPrimary;
    }
    else {
        let newObj: { [key: string]: string[] } = { ...ringDataRef.current };
        for (let i = 0; i < MAX_RINGS; i++) {
            if (i !== MAX_RINGS - 1) {
                let tempSecondary = _.filter(dataRef.current, { param_id: hierarchy[`ring${i}`] })[0]?.children;
                if (tempSecondary) {
                    newObj[`ring${i + 1}`] = tempSecondary;
                }
                else {
                    newObj[`ring${i + 1}`] = [];
                }
            }
            ringDataRef.current = { ...newObj };
        }
    }

    return (
        <div
            className='performance'
            style={{
                animation: getAnimation(expand)
            }}
            onAnimationEnd={() => expandRef.current!.style.display = 'block'}
        >
            <div ref={expandRef} className='performance__expand' onClick={() => expandWidget(expand)}>
                {
                    expand ? <img src={collapseSvg} alt='collapse' /> : <img src={expandSvg} alt='expand' />
                }
            </div>
            <div className='performance__rings'>
                {
                    Object.keys(ringDataRef.current).map(ringId => (
                        <Ring
                            ringId={ringId}
                            ringData={ringDataRef.current[ringId]}
                            hierarchy={hierarchy}
                            handleClick={handleClick}
                            setExpand={setExpand}
                            dataRef={dataRef}
                            ringDataRef={ringDataRef}
                            key={ringId}
                        />
                    ))
                }
            </div>
            <div className='performance__inspect'></div>
        </div>
    )
}

export default Performance;
