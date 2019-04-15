/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
