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
