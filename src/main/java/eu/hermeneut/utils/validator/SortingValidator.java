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

package eu.hermeneut.utils.validator;

import java.lang.reflect.Array;
import java.util.stream.IntStream;

public class SortingValidator<T extends Comparable<T>> {

    private Class<T> clazz;

    public SortingValidator(Class<T> clazz) {
        this.clazz = clazz;
    }

    public boolean validate(Comparable<T>[] array) {
        return IntStream.range(0, array.length - 1).allMatch(i -> array[i].compareTo((T) array[i + 1]) <= 0);
    }

    public boolean validate(Comparable<T>[][] matrix) {

        if (matrix.length > 0) {
            int rows = matrix.length;
            int cols = matrix[0].length;

            if (rows == 1) {// Horizontal Array case
                if (cols > 1) {
                    // Check if the elements are sorted.
                    return validate(matrix[0]);
                } else {
                    // Singleton
                    return true;
                }
            } else if (cols == 1) { // Vertical Array case
                if (rows > 1) {
                    // check if the elements are sorted.
                    return validate(matrix[0]);
                } else {
                    // Singleton
                    return true;
                }
            } else {// Matrix
                // TODO Check that all rows are properly sorted
                for (int r = 0; r < rows; r++) {
                    if (!validate(matrix[r])) {
                        return false;
                    }
                }

                // TODO Check that all cols are properly sorted
                for (int c = 0; c < cols; c++) {
                    T[] column = (T[]) Array.newInstance(this.clazz, rows);

                    for (int r = 0; r < rows; r++) {
                        column[r] = (T) matrix[r][c];
                    }

                    if (!validate(column)) {
                        return false;
                    }
                }

                return true;
            }
        } else {
            return false;
        }
    }
}
