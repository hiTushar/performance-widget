import { useEffect, useRef, useState } from 'react'
import _ from 'lodash';
import './App.css';
import data2 from './data2.json';

const MAX_RINGS = 3;
const RING_HEIGHT = 100;

function App() {
  const [hierarchy, setHierarchy] = useState<{ [key: string]: string }>({
    ring0: '',
    ring1: '',
    ring2: ''
  })

  // const [ringData, setRingData] = useState<{ [key: string]: Array<string> }>({
  //   ring0: [],
  //   ring1: [],
  //   ring2: []
  // });

  const ringDataRef = useRef({
    ring0: [],
    ring1: [],
    ring2: []
  });

  const dataRef = useRef(data2);

  const [openPanel, setOpenPanel] = useState(false);

  useEffect(() => {
    // let tempPrimary = _.filter(dataRef.current, { primary: true }).map(param => param.param_id);
    // setRingData(prev => ({ ...prev, ring0: tempPrimary }))
  }, [])

  useEffect(() => {
    if (!hierarchy.ring0) return;
    // let newObj = { ...ringData };
    // for (let i = 0; i < MAX_RINGS; i++) {
    //   if (i !== MAX_RINGS - 1) {
    //     let tempSecondary = _.filter(dataRef.current, { param_id: hierarchy[`ring${i}`] })[0]?.children;
    //     if (tempSecondary) {
    //       newObj[`ring${i + 1}`] = tempSecondary;
    //     }
    //     else {
    //       newObj[`ring${i + 1}`] = [];
    //     }
    //   }
    //   else if (i === MAX_RINGS - 1) {
    //     // api call
    //     setOpenPanel(true);
    //   }
    //   setRingData(newObj);
    // }
  }, [hierarchy])

  const handleClick = (data, ringId) => {
    let hierarchyObj;
    setHierarchy(prev => {
      hierarchyObj = { ...prev };
      hierarchyObj[ringId] = data.param_id;
      for (let i = +ringId.slice(-1) + 1; i < MAX_RINGS; i++) {
        hierarchyObj[`ring${i}`] = '';
      }
      return hierarchyObj;
    })
  }

  const getTopOffset = (ringId) => {
    if(hierarchy[ringId].length && ringDataRef.current[ringId].length) {
      return `${(RING_HEIGHT * (+ringId.slice(-1) + 1))}px`;
    }
    if(!hierarchy[ringId].length && ringDataRef.current[ringId].length) {
      return `${(RING_HEIGHT * (+ringId.slice(-1)))}px`;
    }
  }

  const getRingAnimation = (ringId) => {
    if(hierarchy[ringId].length && ringDataRef.current[ringId].length) {
      return '';
    }
    if(!hierarchy[ringId].length && ringDataRef.current[ringId].length) {
      return 'slideIn 0.5s linear 0.5s 1 forwards';
    }
  }

  const Ring = ({ ringId, ringData }) => {
    return (
      <div 
        id={ringId}
        className="ring"
        style={{
          zIndex: MAX_RINGS - +ringId.slice(-1),
          top: getTopOffset(ringId),
          animation: getRingAnimation(ringId), // instead of using a class toggle, applying animation directly inline
          '--slide-in-offset': `${RING_HEIGHT}px`
        }} 
      >
        {
          ringData.map(paramId => {
            let data = dataRef.current.find(param => param.param_id === paramId);
            return (
              <div 
                className={`ring-item ${!hierarchy[ringId].length ? 'popup' : ''}`} // don't animate if a param (hierarchy) from this ring has already been selected
                style={{
                  transform: `scale(${!hierarchy[ringId].length ? 0 : 1})`
                }} 
                onClick={() => handleClick(data, ringId)}
                key={`${ringId}-${paramId}`}
              >
                <div>{data.param_name}</div>
                <div>{data.param_score}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  if(!hierarchy.ring0) {
    let tempPrimary = _.filter(dataRef.current, { primary: true }).map(param => param.param_id);
    ringDataRef.current.ring0 = tempPrimary;
  }
  else {
    let newObj = { ...ringDataRef.current };
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

  console.log(ringDataRef.current);

  return (
    <div className='app'>
      <div className='ring-container'>
        {
          Object.keys(ringDataRef.current).map(ringId => <Ring ringId={ringId} ringData={ringDataRef.current[ringId]} key={ringId} />)
        }
      </div>
    </div>
  )
}

export default App
