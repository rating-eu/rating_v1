package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.Asset;
import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.EBIT;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

public class Calculator {

    public static final String CURRENT_ASSETS_CATEGORY_NAME = "Current Assets";
    public static final String FIXED_ASSETS_CATEGORY_NAME = "Fixed Assets";
    private static Map<SectorType, Map<CategoryType, BigDecimal>> lossPercentageMap;

    static {
        Calculator.lossPercentageMap = new HashMap<>();

        Map<CategoryType, BigDecimal> globalSectorMap = new HashMap<>();
        globalSectorMap.put(CategoryType.IP, new BigDecimal("19.89"));
        globalSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("42.34"));
        globalSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("37.77"));
        lossPercentageMap.put(SectorType.GLOBAL, globalSectorMap);

        Map<CategoryType, BigDecimal> financeAndInsuranceSectorMap = new HashMap<>();
        financeAndInsuranceSectorMap.put(CategoryType.IP, new BigDecimal("13.6"));
        financeAndInsuranceSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("45.3"));
        financeAndInsuranceSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("41.1"));
        lossPercentageMap.put(SectorType.FINANCE_AND_INSURANCE, financeAndInsuranceSectorMap);

        Map<CategoryType, BigDecimal> healthCareAndSocialAssistanceSectorMap = new HashMap<>();
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.IP, new BigDecimal("14.7"));
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("63.3"));
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("22.0"));
        lossPercentageMap.put(SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE, healthCareAndSocialAssistanceSectorMap);

        Map<CategoryType, BigDecimal> informationSectorMap = new HashMap<>();
        informationSectorMap.put(CategoryType.IP, new BigDecimal("27.5"));
        informationSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("27.8"));
        informationSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("44.7"));
        lossPercentageMap.put(SectorType.INFORMATION, informationSectorMap);

        Map<CategoryType, BigDecimal> professionalScientificAndTechnicalServiceSectorMap = new HashMap<>();
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.IP, new BigDecimal("6.1"));
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("53.7"));
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("40.2"));
        lossPercentageMap.put(SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE, professionalScientificAndTechnicalServiceSectorMap);
    }


    public static BigDecimal calculateEconomicPerformance(List<EBIT> ebits, BigDecimal discountingRate) throws IllegalArgumentException {
        if (ebits == null || ebits.size() != 6) {
            throw new IllegalArgumentException("Ebits' size must be 6");
        }

        if (discountingRate.compareTo(BigDecimal.ZERO) < 0 || discountingRate.compareTo(BigDecimal.ONE) > 1) {
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

        BigDecimal economicPerformance = BigDecimal.ZERO.setScale(3, RoundingMode.HALF_UP);

        //First 3 years
        for (int year = -2, time = +2; year <= 0; year++) {
            economicPerformance = economicPerformance.add(economicPerformanceHelper(ebits, discountingRate, year, time));
        }

        //Last 3 years
        for (int year = +1, time = +2; year <= +3; year++) {
            economicPerformance = economicPerformance.add(economicPerformanceHelper(ebits, discountingRate, year, time));
        }

        economicPerformance = economicPerformance.divide(new BigDecimal("6"), 3, RoundingMode.HALF_UP);

        return economicPerformance;
    }

    public static BigDecimal economicPerformanceHelper(List<EBIT> ebits, BigDecimal discountingRate, int year, int time) {
        int ebitIndex = time + year;//0, 1, 2
        EBIT ebit = ebits.get(ebitIndex);
        BigDecimal result = BigDecimal.ZERO;

        BigDecimal base = BigDecimal.ONE.add(discountingRate);//1 + discountingRate
        int exponent = -year;

        if (exponent < 0) {
            exponent *= -1;//Make it positive

            BigDecimal power = base.pow(exponent).setScale(3, RoundingMode.HALF_UP);
            power = BigDecimal.ONE.divide(power, 3, RoundingMode.HALF_UP);//Make the inverse

            BigDecimal product = ebit.getValue().multiply(power);

            result = result.add(product);
        } else {
            BigDecimal product = ebit.getValue().multiply(base.pow(exponent));
            result = result.add(product);
        }
        return result.setScale(3, RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateIntangibleDrivingEarnings(BigDecimal economicPerformance, BigDecimal physicalAssetsReturn, BigDecimal financialAssetsReturn, List<MyAsset> myAssets) {
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
                if (assetCategory.getName().equalsIgnoreCase(CURRENT_ASSETS_CATEGORY_NAME)) {
                    financialAssets.add(myAsset);
                } else if (assetCategory.getName().equalsIgnoreCase(FIXED_ASSETS_CATEGORY_NAME)) {
                    physicalAssets.add(myAsset);
                }
            }
        }

        //=======Intangible Driving Earnings=======
        BigDecimal intangibleDrivingEarnings = economicPerformance;

        BigDecimal physicalAssetsValuation = BigDecimal.ZERO;
        BigDecimal financialAssetsValuation = BigDecimal.ZERO;

        //Physical Assets
        for (MyAsset physicalAsset : physicalAssets) {
            physicalAssetsValuation = physicalAssetsValuation.add(physicalAsset.getEconomicValue());
        }

        //Financial Assets
        for (MyAsset financialAsset : financialAssets) {
            financialAssetsValuation = financialAssetsValuation.add(financialAsset.getEconomicValue());
        }

        intangibleDrivingEarnings = intangibleDrivingEarnings.subtract(physicalAssetsReturn.multiply(physicalAssetsValuation).divide(new BigDecimal("100"), 3, RoundingMode.HALF_UP));
        intangibleDrivingEarnings = intangibleDrivingEarnings.subtract(financialAssetsReturn.multiply(financialAssetsValuation).divide(new BigDecimal("100"), 3, RoundingMode.HALF_UP));

        return intangibleDrivingEarnings;
    }

    public static BigDecimal calculateIntangibleCapital(BigDecimal intangibleDrivingEarnings, BigDecimal discountingRate) {
        BigDecimal intangibleCapital = BigDecimal.ZERO;

        intangibleCapital = intangibleCapital.add(intangibleDrivingEarnings.divide(BigDecimal.ONE.add(discountingRate), 3, RoundingMode.HALF_UP));

        return intangibleCapital;
    }

    public static BigDecimal calculateIntangibleLossByAttacks(BigDecimal intangibleCapital, BigDecimal lossOfIntangiblePercentage) {
        return intangibleCapital.multiply(lossOfIntangiblePercentage).divide(new BigDecimal("100"), 3, RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateSplittingLoss(BigDecimal intangibleLossByAttacks, CategoryType categoryType, SectorType sectorType) {
        BigDecimal percentage = calculateSplittingLossPercentage(categoryType, sectorType);

        return intangibleLossByAttacks.multiply(percentage).divide(new BigDecimal(100), 3, RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateSplittingLossPercentage(CategoryType categoryType, SectorType sectorType/*Optional field*/) {
        if (categoryType == null) {
            throw new IllegalArgumentException("CategoryType can NOT be NULL!");
        }

        if (sectorType == null) {
            throw new IllegalArgumentException("SectorType can NOT be NULL!");
        }

        BigDecimal percentage = BigDecimal.ZERO;

        switch (sectorType) {
            case GLOBAL:
            case FINANCE_AND_INSURANCE:
            case HEALTH_CARE_AND_SOCIAL_ASSISTANCE:
            case INFORMATION:
            case PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE: {
                percentage = lossPercentageMap.get(sectorType).get(categoryType);
                break;
            }
        }

        return percentage;
    }
}
