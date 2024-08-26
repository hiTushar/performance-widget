import { ScoreRingInterface } from '../../types/Types';
import './ScoreRing.css';
import { infoSvg } from '../../assets/assets';
import ScoreMeter from '../scoreMeter/ScoreMeter';

const SCORE_RING_WIDTH = 95;
const SLIDE_IN_SCORE_RING_OFFSET = 28;


const ScoreRing: React.FC<ScoreRingInterface> = ({ hierarchy, score, lastWeekScore, expand }) => {
    console.log(expand);
    const getTopOffset = () => {
        let totalOffset = 0;

        let initialOffset = -SCORE_RING_WIDTH;
        totalOffset += initialOffset;

        if(hierarchy.ring0.length) {
            let hierarchySetOffset = 28;
            totalOffset += hierarchySetOffset;
        }
        // if(expand) {
        //     let expandOffset = 10;
        //     totalOffset += expandOffset;
        // }

        return `${totalOffset}cqw`;
    }

    const getAnimation = () => {
        if(!hierarchy.ring0.length) {
            return 'slideInScoreRing 0.5s linear 0.5s 1 forwards';
        }
        else if(expand) {
            // return 'slideInExtra 0.5s linear 0.5s 1 forwards';
        }
        return '';
    }

    const getSlideInOffset = () => {
        let totalOffset = 0;
        // if(expand) {
        //     totalOffset += 10;
        // }
        totalOffset += SLIDE_IN_SCORE_RING_OFFSET;
        
        return `${totalOffset}cqw`;
    }

    const getSlideInExtraOffset = () => {
        let totalOffset = 0;
        totalOffset += SLIDE_IN_SCORE_RING_OFFSET;
        if(expand) {
            totalOffset += 10;
        }
        return `${totalOffset}cqw`;
    }
    
    const getPreviousDiff = () => {
        let diff = score - lastWeekScore;
        if(diff >= 0) {
            return `+${diff}`;
        }
        else {
            return `${diff}`;
        }
    }

    const getPreviousDiffColor = () => {
        if(lastWeekScore > score) {
            return 'var(--item-1)';
        }
        else if(lastWeekScore < score) {
            return 'var(--item-3)';
        }
        else {
            return 'var(--item-2)';
        }
    }
    
    return (
        <div 
            className='score-ring'
            style={{
                top: getTopOffset(),
                animation: getAnimation(),
                '--slide-in-score-ring-offset': getSlideInOffset(),
                '--slide-in-extra': getSlideInExtraOffset(),
                '--score-ring-width': `${SCORE_RING_WIDTH}cqw`
            } as React.CSSProperties}
        >
            <div className='score-ring-dotted-bg'></div>
            <div className='score-ring__info'>
                <div className='score-ring__meter'>
                    <ScoreMeter score={score} />
                </div>
                <div className='score-ring__text'>
                    <div className='text__title'>Your Performance Score</div>
                    <div className='text__i'>
                        <img src={infoSvg} alt='info' />
                    </div>
                </div>
                <div className='score-ring__previous'>
                    <div 
                        className='previous__diff'
                        style={{
                            '--prev-color': getPreviousDiffColor()
                        } as React.CSSProperties}
                    >
                        {getPreviousDiff()}
                    </div>
                    <div className='previous__title'>since last week</div>
                </div>
            </div>
        </div>
    )
}

export default ScoreRing;
