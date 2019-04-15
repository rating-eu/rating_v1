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

import eu.hermeneut.domain.EBIT;
import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;

import javax.validation.constraints.Size;
import java.util.List;

public class WP3InputBundle {
    /*
    *
    INPUT{
        ebits,
        economicCoefficients,
        myAssets(current, fixeds),
        economicResults,
        sectorType,
        categoryType
    }
    * */

    @Size(min = 6, max = 6)
    private List<EBIT> ebits;

    private EconomicCoefficients economicCoefficients;

    private List<MyAsset> myAssets;

    private EconomicResults economicResults;

    private SectorType sectorType;

    private CategoryType categoryType;

    public List<EBIT> getEbits() {
        return ebits;
    }

    public void setEbits(List<EBIT> ebits) {
        this.ebits = ebits;
    }

    public EconomicCoefficients getEconomicCoefficients() {
        return economicCoefficients;
    }

    public void setEconomicCoefficients(EconomicCoefficients economicCoefficients) {
        this.economicCoefficients = economicCoefficients;
    }

    public List<MyAsset> getMyAssets() {
        return myAssets;
    }

    public void setMyAssets(List<MyAsset> myAssets) {
        this.myAssets = myAssets;
    }

    public EconomicResults getEconomicResults() {
        return economicResults;
    }

    public void setEconomicResults(EconomicResults economicResults) {
        this.economicResults = economicResults;
    }

    public SectorType getSectorType() {
        return sectorType;
    }

    public void setSectorType(SectorType sectorType) {
        this.sectorType = sectorType;
    }

    public CategoryType getCategoryType() {
        return categoryType;
    }

    public void setCategoryType(CategoryType categoryType) {
        this.categoryType = categoryType;
    }
}
