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

package eu.hermeneut.utils.wp4;

import eu.hermeneut.domain.MyAsset;

import java.math.BigDecimal;
import java.util.Comparator;

public class MyAssetComparator implements Comparator<MyAsset> {
    @Override
    public int compare(MyAsset o1, MyAsset o2) {
        BigDecimal value1 = valueOrDefault(o1);
        BigDecimal value2 = valueOrDefault(o2);

        return value1.subtract(value2).intValue();
    }

    private BigDecimal valueOrDefault(MyAsset myAsset) {
        BigDecimal value = BigDecimal.ZERO;

        if (myAsset.getEconomicValue() != null) {
            value = myAsset.getEconomicValue();
        }

        return value;
    }
}
