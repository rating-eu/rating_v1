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

package eu.hermeneut.domain.wp3;

import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.domain.SplittingLoss;
import eu.hermeneut.domain.SplittingValue;

import java.util.List;

public class WP3OutputBundle {
    private EconomicResults economicResults;
    private EconomicCoefficients economicCoefficients;
    private List<SplittingLoss> splittingLosses;
    private List<SplittingValue> splittingValues;

    public EconomicResults getEconomicResults() {
        return economicResults;
    }

    public void setEconomicResults(EconomicResults economicResults) {
        this.economicResults = economicResults;
    }

    public EconomicCoefficients getEconomicCoefficients() {
        return economicCoefficients;
    }

    public void setEconomicCoefficients(EconomicCoefficients economicCoefficients) {
        this.economicCoefficients = economicCoefficients;
    }

    public List<SplittingLoss> getSplittingLosses() {
        return splittingLosses;
    }

    public void setSplittingLosses(List<SplittingLoss> splittingLosses) {
        this.splittingLosses = splittingLosses;
    }

    public List<SplittingValue> getSplittingValues() {
        return splittingValues;
    }

    public void setSplittingValues(List<SplittingValue> splittingValues) {
        this.splittingValues = splittingValues;
    }
}
