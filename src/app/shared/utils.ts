export function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}
