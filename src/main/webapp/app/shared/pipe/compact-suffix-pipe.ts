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

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'compactSuffix'})
export class CompactSuffixPipe implements PipeTransform {
    transform(value: number, decimals: number = 2): string {
        if (value) {
            // https://crusaders-of-the-lost-idols.fandom.com/wiki/Large_Number_Abbreviations
            const suffixes = ['', 'K', 'M', 'B', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'T', 'Qt', 'Qd', 'Sd', 'St', 'O', 'N', 'v', 'c']

            const suffixIndex = Math.max(0,
                Math.min(
                    suffixes.length - 1,
                    Math.floor(
                        Math.log10(Math.abs(value)) / 3 //3=log_10(1000)
                    )
                ));

            return suffixes[suffixIndex];
        } else {
            return '';
        }
    }
}
