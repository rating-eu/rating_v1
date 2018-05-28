/**
 * In mathematics, a fraction is a number that represents a part of a whole.
 * It consists of a numerator and a denominator.
 * The numerator represents the number of equal parts of a whole,
 * while the denominator is the total number of parts that make up said whole.
 */
export class Fraction {
    constructor(public part = 0, public whole = 0) {
    }

    toPercentage(): number {
        if (this.part === 0 || this.whole === 0) {
            return 0;
        } else {
            return this.part * 100 / this.whole;
        }
    }
}
