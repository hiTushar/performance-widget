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
        let arcLength = 152 * (score / 100);
        return `${arcLength}`;
    }

    return (
        <div
            className='score-meter'

        >
            <div className='score-meter__arc'>
                <svg width="100cqw" height="50cqw" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path
                        d='M 2 50
                        A 30 30, 0, 0, 1, 98 50'
                        fill="none"
                        stroke='var(--gray-1)'
                        strokeWidth='4cqw'
                        strokeLinecap="round"
                    />
                    <path
                        d='M 2 50
                        A 30 30, 0, 0, 1, 98 50'
                        fill="none"
                        stroke={getColor(score)}
                        strokeWidth='4cqw'
                        strokeLinecap="round"
                        strokeDasharray={`${getArcLength(score)} 152`}
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
