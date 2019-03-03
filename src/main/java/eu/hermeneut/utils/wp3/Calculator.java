package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.domain.wp3.IDE;
import eu.hermeneut.exceptions.IllegalInputException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Calculator {

    public static final String CURRENT_ASSETS_CATEGORY_NAME = "Current Assets";
    public static final String FIXED_ASSETS_CATEGORY_NAME = "Fixed Assets";
    private static Map<SectorType, Map<CategoryType, BigDecimal>> splittingPercentageMap;

    private static final Logger LOGGER = LoggerFactory.getLogger(Calculator.class);

    static {
        Calculator.splittingPercentageMap = new HashMap<>();

        Map<CategoryType, BigDecimal> globalSectorMap = new HashMap<>();
        globalSectorMap.put(CategoryType.IP, new BigDecimal("19.89"));
        globalSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("42.34"));
        globalSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("37.77"));
        splittingPercentageMap.put(SectorType.GLOBAL, globalSectorMap);

        Map<CategoryType, BigDecimal> financeAndInsuranceSectorMap = new HashMap<>();
        financeAndInsuranceSectorMap.put(CategoryType.IP, new BigDecimal("13.6"));
        financeAndInsuranceSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("45.3"));
        financeAndInsuranceSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("41.1"));
        splittingPercentageMap.put(SectorType.FINANCE_AND_INSURANCE, financeAndInsuranceSectorMap);

        Map<CategoryType, BigDecimal> healthCareAndSocialAssistanceSectorMap = new HashMap<>();
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.IP, new BigDecimal("14.7"));
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("63.3"));
        healthCareAndSocialAssistanceSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("22.0"));
        splittingPercentageMap.put(SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE, healthCareAndSocialAssistanceSectorMap);

        Map<CategoryType, BigDecimal> informationSectorMap = new HashMap<>();
        informationSectorMap.put(CategoryType.IP, new BigDecimal("27.5"));
        informationSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("27.8"));
        informationSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("44.7"));
        splittingPercentageMap.put(SectorType.INFORMATION, informationSectorMap);

        Map<CategoryType, BigDecimal> professionalScientificAndTechnicalServiceSectorMap = new HashMap<>();
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.IP, new BigDecimal("6.1"));
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.KEY_COMP, new BigDecimal("53.7"));
        professionalScientificAndTechnicalServiceSectorMap.put(CategoryType.ORG_CAPITAL, new BigDecimal("40.2"));
        splittingPercentageMap.put(SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE, professionalScientificAndTechnicalServiceSectorMap);
    }


    public static BigDecimal calculateEconomicPerformance(List<EBIT> ebits, BigDecimal discountingRate) throws IllegalArgumentException {
        if (ebits == null || ebits.size() != 6) {
            throw new IllegalArgumentException("Ebits' size must be 6");
        }

        if (discountingRate.compareTo(BigDecimal.ZERO) < 0 || discountingRate.compareTo(new BigDecimal(100)) > 1) {
            throw new IllegalArgumentException("DiscountingRate must be between 0 and 100 (edges included), but it is: " + discountingRate);
        }

        //Sort from year 1 (-2) to year 6(+3)
        ebits.sort(new Comparator<EBIT>() {
            @Override
            public int compare(EBIT ebit1, EBIT ebit2) {
                return ebit1.getYear() - ebit2.getYear();
            }
        });

        //=======Calculate the Economic Performance=======

        BigDecimal economicPerformance = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        //First 3 years
        for (int year = -2, time = +2; year <= 0; year++) {
            economicPerformance = economicPerformance.add(economicPerformanceHelper(ebits, discountingRate, year, time));
        }

        //Last 3 years
        for (int year = +1, time = +2; year <= +3; year++) {
            economicPerformance = economicPerformance.add(economicPerformanceHelper(ebits, discountingRate, year, time));
        }

        economicPerformance = economicPerformance.divide(new BigDecimal("6"), 2, RoundingMode.HALF_UP);

        return economicPerformance;
    }

    public static BigDecimal economicPerformanceHelper(List<EBIT> ebits, BigDecimal discountingRate, int year, int time) {
        int ebitIndex = time + year;//0, 1, 2
        EBIT ebit = ebits.get(ebitIndex);
        BigDecimal result = BigDecimal.ZERO;

        LOGGER.debug("");
        LOGGER.debug("Year: " + ebit.getYear());
        LOGGER.debug("EBIT: " + ebit.getValue());

        BigDecimal base = BigDecimal.ONE.add(discountingRate.divide(new BigDecimal(100)));//1 + discountingRate
        LOGGER.debug("Base: " + base);

        int exponent = -year;
        LOGGER.debug("Exponent: " + exponent);

        if (exponent < 0) {
            exponent *= -1;//Make it positive

            BigDecimal power = base.pow(exponent).setScale(2, RoundingMode.HALF_UP);
            power = BigDecimal.ONE.divide(power, 2, RoundingMode.HALF_UP);//Make the inverse
            LOGGER.debug("Power: " + power);

            BigDecimal product = ebit.getValue().multiply(power);
            LOGGER.debug("Product: " + product);

            result = result.add(product);
        } else {
            BigDecimal power = base.pow(exponent);
            LOGGER.debug("Power: " + power);

            BigDecimal product = ebit.getValue().multiply(power);
            LOGGER.debug("Product: " + product);
            result = result.add(product);
        }

        result = result.setScale(2, RoundingMode.HALF_UP);
        LOGGER.debug("Result: " + result);


        LOGGER.debug("Ebit per 1 + discounting rate: " + result);

        return result;
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

        intangibleDrivingEarnings = intangibleDrivingEarnings.subtract(physicalAssetsReturn.multiply(physicalAssetsValuation).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP));
        intangibleDrivingEarnings = intangibleDrivingEarnings.subtract(financialAssetsReturn.multiply(financialAssetsValuation).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP));

        return intangibleDrivingEarnings;
    }

    public static List<IDE> calculateIDEsTZero() {

        return null;
    }

    public static IDE calculateIDETZero(BigDecimal discountingRate, List<GrowthRate> growthRates, Integer year, IDE ide) throws IllegalInputException {
        IDE ideTZero = new IDE();
        ideTZero.setYear(year);

        if (year < 10) {
            if (year != ide.getYear()) {
                throw new IllegalInputException("For IDEsTZero with year < 10 you MUST provide the IDE of the same year!!!");
            }

            ideTZero.setValue(ide.getValue()
                .divide(BigDecimal.ONE.add(discountingRate.divide(new BigDecimal("100"), 3, RoundingMode.HALF_UP))
                    .pow(ide.getYear()), 3, RoundingMode.HALF_UP
                ));
        } else {
            if (ide.getYear() != 9) {
                throw new IllegalInputException("For IDEsTZero with year >= 10 you MUST provide the IDE of the 9th year!!!");
            }

            Map<Integer, GrowthRate> growthRateMap = checkGrowthRates(growthRates);

            ideTZero.setValue(ide.getValue()
                .divide(discountingRate.divide(new BigDecimal("100"), 3, RoundingMode.HALF_UP)
                    .subtract(growthRateMap.get(10).getRate()), 3, RoundingMode.HALF_UP)
                .divide(BigDecimal.ONE.add(discountingRate.divide(new BigDecimal("100"), 3, RoundingMode.HALF_UP))
                    .pow(ide.getYear()), 3, RoundingMode.HALF_UP
                )
            );
        }

        return ideTZero;
    }

    private static Map<Integer, GrowthRate> checkGrowthRates(List<GrowthRate> growthRates) throws IllegalInputException {
        Map<Integer, GrowthRate> growthRatesMap = growthRates.stream()
            .parallel()
            .collect(Collectors.toMap(GrowthRate::getYear, Function.identity()));

        if (growthRatesMap.size() != 10) {
            throw new IllegalInputException("There must be exactly 10 GrowthRates for 10 years.");
        }

        for (int y = 1; y <= 10; y++) {
            if (growthRatesMap.get(y) == null) {
                throw new IllegalInputException("Missing GrowthRate for year " + y);
            }
        }

        return growthRatesMap;
    }

    public static IDE calculateIDE(BigDecimal intangibleDrivingEarnings, List<GrowthRate> growthRates, Integer year) throws IllegalInputException {
        Map<Integer, GrowthRate> growthRatesMap = checkGrowthRates(growthRates);

        if (year < 1 || year > 10) {
            throw new IllegalInputException("Year must be between 1 and 10.");
        }

        Map<Integer, IDE> idesMap = new HashMap<>();

        for (int y = 1; y <= year; y++) {
            calculateIDE(intangibleDrivingEarnings, growthRatesMap, idesMap, y);
        }

        return idesMap.get(year);
    }

    public static List<IDE> calculateIDEs(BigDecimal intangibleDrivingEarnings, List<GrowthRate> growthRates) throws IllegalInputException {
        Map<Integer, GrowthRate> growthRatesMap = checkGrowthRates(growthRates);

        Map<Integer, IDE> idesMap = new HashMap<>();

        for (int y = 1; y <= 10; y++) {
            calculateIDE(intangibleDrivingEarnings, growthRatesMap, idesMap, y);
        }

        return idesMap.values().stream().parallel().collect(Collectors.toList());
    }

    private static void calculateIDE(BigDecimal intangibleDrivingEarnings, Map<Integer, GrowthRate> growthRatesMap, Map<Integer, IDE> idesMap, int y) throws IllegalInputException {
        GrowthRate growthRate = growthRatesMap.get(y);

        if (growthRate == null) {
            throw new IllegalInputException("Missing GrowthRate for year: " + y);
        }

        final IDE ide = new IDE();
        ide.setYear(y);

        if (y == 1) {
            BigDecimal value = intangibleDrivingEarnings.multiply(BigDecimal.ONE.add(growthRate.getRate())).setScale(3, RoundingMode.HALF_UP);
            ide.setValue(value);
        } else {
            IDE previousIDE = idesMap.get(y - 1);

            BigDecimal value = previousIDE.getValue().multiply(BigDecimal.ONE.add(growthRate.getRate())).setScale(3, RoundingMode.HALF_UP);
            ide.setValue(value);
        }

        idesMap.put(y, ide);
    }

    public static BigDecimal calculateIntangibleCapital(BigDecimal intangibleDrivingEarnings, BigDecimal discountingRate) {
        BigDecimal intangibleCapital = BigDecimal.ZERO;

        intangibleCapital = intangibleCapital.add(intangibleDrivingEarnings.divide(BigDecimal.ONE.add(discountingRate.divide(new BigDecimal(100))), 2, RoundingMode.HALF_UP));

        return intangibleCapital;
    }

    public static BigDecimal calculateIntangibleLossByAttacks(BigDecimal intangibleCapital, BigDecimal lossOfIntangiblePercentage) {
        return intangibleCapital.multiply(lossOfIntangiblePercentage).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateSplittingLoss(BigDecimal intangibleLossByAttacks, CategoryType categoryType, SectorType sectorType) {
        BigDecimal percentage = calculateSplittingPercentage(categoryType, sectorType);
        LOGGER.debug("Percentage: " + percentage);
        LOGGER.debug("IntangibleLossByAttacks: " + intangibleLossByAttacks);

        return intangibleLossByAttacks.multiply(percentage).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateSplittingValue(BigDecimal intangibleCapital, CategoryType categoryType, SectorType sectorType) {
        BigDecimal percentage = calculateSplittingPercentage(categoryType, sectorType);
        LOGGER.debug("Percentage: " + percentage);
        LOGGER.debug("IntangibleLossByAttacks: " + intangibleCapital);

        return intangibleCapital.multiply(percentage).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateSplittingPercentage(CategoryType categoryType, SectorType sectorType/*Optional field*/) {
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
                percentage = splittingPercentageMap.get(sectorType).get(categoryType);
                break;
            }
        }

        return percentage;
    }
}
