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

package eu.hermeneut.domain.dashboard;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;

import java.util.Set;

public class ImpactEvaluationStatus {
    private Set<EBIT> ebits;
    private EconomicCoefficients economicCoefficients;
    private EconomicResults economicResults;
    private Set<MyAsset> myTangibleAssets;
    private SectorType sectorType;
    private CategoryType categoryType;
    /**
     * Splitting Losses both for GLOBAL & for SectorType
     */
    private Set<SplittingLoss> splittingLosses;
    private Set<SplittingValue> splittingValues;

    public ImpactEvaluationStatus() {
    }

    public ImpactEvaluationStatus(Set<EBIT> ebits, EconomicCoefficients economicCoefficients, EconomicResults economicResults, Set<MyAsset> myTangibleAssets, SectorType sectorType, CategoryType categoryType, Set<SplittingLoss> splittingLosses, Set<SplittingValue> splittingValues) {
        this.ebits = ebits;
        this.economicCoefficients = economicCoefficients;
        this.economicResults = economicResults;
        this.myTangibleAssets = myTangibleAssets;
        this.sectorType = sectorType;
        this.categoryType = categoryType;
        this.splittingLosses = splittingLosses;
        this.splittingValues = splittingValues;
    }

    public Set<EBIT> getEbits() {
        return ebits;
    }

    public void setEbits(Set<EBIT> ebits) {
        this.ebits = ebits;
    }

    public EconomicCoefficients getEconomicCoefficients() {
        return economicCoefficients;
    }

    public void setEconomicCoefficients(EconomicCoefficients economicCoefficients) {
        this.economicCoefficients = economicCoefficients;
    }

    public EconomicResults getEconomicResults() {
        return economicResults;
    }

    public void setEconomicResults(EconomicResults economicResults) {
        this.economicResults = economicResults;
    }

    public Set<MyAsset> getMyTangibleAssets() {
        return myTangibleAssets;
    }

    public void setMyTangibleAssets(Set<MyAsset> myTangibleAssets) {
        this.myTangibleAssets = myTangibleAssets;
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

    public Set<SplittingLoss> getSplittingLosses() {
        return splittingLosses;
    }

    public void setSplittingLosses(Set<SplittingLoss> splittingLosses) {
        this.splittingLosses = splittingLosses;
    }

    public Set<SplittingValue> getSplittingValues() {
        return splittingValues;
    }

    public void setSplittingValues(Set<SplittingValue> splittingValues) {
        this.splittingValues = splittingValues;
    }
}
