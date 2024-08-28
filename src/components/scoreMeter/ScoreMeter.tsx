import './ScoreMeter.css';

const ScoreMeter = (props: { score: number }) => {
    const { score } = props;

    const getColor = (score: number) => {
        if (score < 30) {
            return 'var(--item-1)';
        } else if (score < 70) {
            return 'var(--item-2)';
        } else {
            return 'var(--item-3)';
        }
    }

    const getArcLength = (score: number) => {
        let arcLength = 140 * (score / 100);
        return `${arcLength}`;
    }

    return (
        <div className='score-meter'>
            <div className='score-meter__arc'>
                <svg width="100cqw" height="50cqw" viewBox="0 -4 100 50" preserveAspectRatio="none">
                    <path
                        d='M 4 46
                        A 2 2, 0, 0, 1, 94 46'
                        fill="none"
                        stroke='var(--gray-1)'
                        strokeWidth='4cqw'
                        strokeLinecap="round"
                    />
                    <path
                        d='M 4 46
                        A 2 2, 0, 0, 1, 94 46'
                        fill="none"
                        stroke={getColor(score)}
                        strokeWidth='4cqw'
                        strokeLinecap="round"
                        strokeDasharray={`${getArcLength(70)} 140`}
                    >
                    </path>
                </svg>
            </div>
            <div
                className="score-meter__val"
                style={{
                    '--score-color': getColor(score)
                } as React.CSSProperties}
            >
                {score}
                <span>%</span>
            </div>
        </div>
    )
}

export default ScoreMeter;
