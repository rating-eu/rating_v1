package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.Asset;
import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.EBIT;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;

import java.util.*;

public class Calculator {

    private static Map<CategoryType, Double/*percentage*/> globalPercentageByCategoryTypeMap;
    private static Map<SectorType, Map<CategoryType, Double>> sectorialPercentageMap;

    static {
        Calculator.globalPercentageByCategoryTypeMap = new HashMap<>();
        Calculator.globalPercentageByCategoryTypeMap.put(CategoryType.IP, 19.89);
        Calculator.globalPercentageByCategoryTypeMap.put(CategoryType.KEY_COMP, 42.34);
        Calculator.globalPercentageByCategoryTypeMap.put(CategoryType.ORG_CAPITAL, 37.77);

        Calculator.sectorialPercentageMap = new HashMap<>();

        Map<CategoryType, Double> financeAndInsuranceSectorMap = new HashMap<>();
        financeAndInsuranceSectorMap.put(CategoryType.IP, 13.6);
        financeAndInsuranceSectorMap.put(CategoryType.KEY_COMP, 45.3);
        financeAndInsuranceSectorMap.put(CategoryType.ORG_CAPITAL, 41.1);
        sectorialPercentageMap.put(SectorType.FINANCE_AND_INSURANCE, financeAndInsuranceSectorMap);

        Map<CategoryType, Double> healthCareAndSocialAssistanceSectorMap = new HashMap<>();
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.IP, 14.7);
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.KEY_COMP, 63.3);
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.ORG_CAPITAL, 22.0);
        sectorialPercentageMap.put(SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE, healthCareAndSocialAssistanceSectorMap);

        Map<CategoryType, Double> informationSectorMap = new HashMap<>();
        informationSectorMap.put(CategoryType.IP, 27.5);
        informationSectorMap.put(CategoryType.KEY_COMP, 27.8);
        informationSectorMap.put(CategoryType.ORG_CAPITAL, 44.7);
        sectorialPercentageMap.put(SectorType.INFORMATION, informationSectorMap);

        Map<CategoryType, Double> professionalScientificAndTechnicalServiceSectorMap = new HashMap<>();
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.IP, 6.1);
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.KEY_COMP, 53.7);
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.ORG_CAPITAL, 40.2);
        sectorialPercentageMap.put(SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE, professionalScientificAndTechnicalServiceSectorMap);
    }


    public static double calculateEconomicPerformance(List<EBIT> ebits, double discountingRate) throws IllegalArgumentException {
        if (ebits == null || ebits.size() != 6) {
            throw new IllegalArgumentException("Ebits' size must be 6");
        }

        if (discountingRate < 0 || discountingRate > 1) {
            throw new IllegalArgumentException("DiscountingRate must be between 0 and 1 (edges included), but it is: " + discountingRate);
        }

        //Sort from year 1 (-2) to year 6(+3)
        ebits.sort(new Comparator<EBIT>() {
            @Override
            public int compare(EBIT ebit1, EBIT ebit2) {
                return ebit1.getYear() - ebit2.getYear();
            }
        });

        //=======Calculate the Economic Performance=======

        double economicPerformance = 0;

        //First 3 years
        for (int year = -2, time = +2; year <= 0; year++) {
            int ebitIndex = time + year;//0, 1, 2
            EBIT ebit = ebits.get(ebitIndex);

            economicPerformance += ebit.getValue() * Math.pow(1 + discountingRate, -year);
        }

        //Last 3 years
        for (int year = +1, time = +2; year <= +3; year++) {
            int ebitIndex = time + year;//3, 4, 5
            EBIT ebit = ebits.get(ebitIndex);

            economicPerformance += ebit.getValue() * Math.pow(1 + discountingRate, -year);
        }

        economicPerformance /= 6;

        return economicPerformance;
    }

    public static double calculateIntangibleDrivingEarnings(double economicPerformance, double physicalAssetsReturn, double financialAssetsReturn, List<MyAsset> myAssets) {
        if (myAssets == null) {
            throw new IllegalArgumentException("MyAssets can NOT be NULL!");
        }

        if (myAssets.size() == 0) {
            throw new IllegalArgumentException("MyAssets can NOT have SIZE equal to ZERO!");
        }

        List<MyAsset> physicalAssets = new ArrayList<>();
        List<MyAsset> financialAssets = new ArrayList<>();

        for (MyAsset myAsset : myAssets) {
            Asset asset = myAsset.getAsset();
            AssetCategory assetCategory = asset.getAssetcategory();

            if (assetCategory != null) {
                if (assetCategory.getName().equalsIgnoreCase("Current Assets")) {
                    financialAssets.add(myAsset);
                } else if (assetCategory.getName().equalsIgnoreCase("Fixed Assets")) {
                    physicalAssets.add(myAsset);
                }
            }
        }

        //=======Intangible Driving Earnings=======
        double intangibleDrivingEarnings = economicPerformance;

        double physicalAssetsValuation = 0;
        double financialAssetsValuation = 0;

        //Physical Assets
        for (MyAsset physicalAsset : physicalAssets) {
            physicalAssetsValuation += physicalAsset.getEconomicValue();
        }

        //Financial Assets
        for (MyAsset financialAsset : financialAssets) {
            financialAssetsValuation += financialAsset.getEconomicValue();
        }

        intangibleDrivingEarnings -= physicalAssetsReturn * physicalAssetsValuation;
        intangibleDrivingEarnings -= financialAssetsReturn * financialAssetsValuation;

        return intangibleDrivingEarnings;
    }

    public static double calculateIntangibleCapital(double intangibleDrivingEarnings, double discountingRate) {
        double intangibleCapital = 0;

        intangibleCapital += intangibleDrivingEarnings / (1 + discountingRate);

        return intangibleCapital;
    }

    public static double calculateIntangibleLossByAttacks(double intangibleCapital, double lossOfIntangiblePercentage) {
        return intangibleCapital * lossOfIntangiblePercentage / 100;
    }

    public static double calculateSplittingLoss(double intangibleLossByAttacks, CategoryType categoryType, SectorType sectorType/*Optional field*/) {
        if (categoryType == null) {
            throw new IllegalArgumentException("CategoryType can NOT be NULL!");
        }

        double percentage = 0;

        if (sectorType == null) {//Global Percentage
            percentage = globalPercentageByCategoryTypeMap.get(categoryType);
        } else {//Sectorial Percentage
            percentage = sectorialPercentageMap.get(sectorType).get(categoryType);
        }

        return intangibleLossByAttacks * percentage / 100;
    }
}
