const inRadians = (degrees: number): number => degrees * Math.PI / 180;

const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return +Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2);
}

export { inRadians, getDistance};