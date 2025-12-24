
/**
 * Deterministic Random Number Generator
 * Uses a simple LCG (Linear Congruential Generator) to ensure
 * simulation results are reproducible given the same seed.
 */

const A = 1664525;
const C = 1013904223;
const M = 4294967296; // 2^32

let state = 42; // Default seed

export function setSeed(seed: number) {
    state = seed;
}

export function getSeed(): number {
    return state;
}

/**
 * Returns a pseudo-random float between 0 (inclusive) and 1 (exclusive).
 */
export function random(): number {
    state = (A * state + C) % M;
    return state / M;
}

/**
 * Returns a pseudo-random integer between min (inclusive) and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * Returns a pseudo-random float between min (inclusive) and max (exclusive).
 */
export function randomFloat(min: number, max: number): number {
    return random() * (max - min) + min;
}

/**
 * Returns a boolean based on probability (0-1).
 */
export function chance(probability: number): boolean {
    return random() < probability;
}

/**
 * Picks a random element from an array.
 */
export function sample<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)];
}
