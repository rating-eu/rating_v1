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

package eu.hermeneut.utils.range;

public class DiscreteRange {
    private Integer min;
    private Integer max;

    public DiscreteRange(Integer min, Integer max) {
        this.min = Math.min(min, max);
        this.max = Math.max(min, max);
    }

    public Integer getMin() {
        return min;
    }

    public void setMin(Integer min) {
        this.min = min;
    }

    public Integer getMax() {
        return max;
    }

    public void setMax(Integer max) {
        this.max = max;
    }

    public Integer getWidth() {
        return this.max - this.min;
    }

    public Integer convert(Integer oldValue, DiscreteRange newRange) {
        // https://stackoverflow.com/questions/929103/convert-a-number-range-to-another-range-maintaining-ratio
        Integer oldMin = this.getMin();
        Integer oldMax = this.getMax();
        Integer oldWidth = this.getWidth();

        if (oldValue < oldMin || oldValue > oldMax) {
            throw new IllegalArgumentException("OldValue (" + oldValue + ") must be within the range [" + oldMin + " - " + oldMax + "]");
        }

        Integer newMin = newRange.getMin();
        Integer newMax = newRange.getMax();
        Integer newWidth = newRange.getWidth();

        Double ratio = (double) newWidth / (double) oldWidth;

        Double row = ratio * (oldValue - newMin) + newMin;

        Integer newValue = (int) Math.ceil(row);

        return newValue;
    }
}
