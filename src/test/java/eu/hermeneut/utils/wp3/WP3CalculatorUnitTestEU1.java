package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.domain.wp3.IDE;
import eu.hermeneut.exceptions.IllegalInputException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class WP3CalculatorUnitTestEU1 {

    //Data to calculate the EconomicPerformance
    private static final BigDecimal DISCOUNTING_RATE = new BigDecimal("10");

    private static final BigDecimal TEN_PERCENT_DISCOUNTING_RATE_ECONOMIC_PERFORMANCE = new BigDecimal("1974863.05");
    private static final BigDecimal PHYSICAL_ASSETS_RETURN = new BigDecimal("7");
    private static final BigDecimal FINANCIAL_ASSETS_RETURN = new BigDecimal("5.5");

    private static final BigDecimal INTANGIBLE_DRIVING_EARNINGS = new BigDecimal("296013.35");
    private static final BigDecimal INTANGIBLE_CAPITAL_OLD = new BigDecimal("59502277.02");

    public static final BigDecimal IDE1_VALUE = new BigDecimal("340415.353");
    public static final BigDecimal IDE1_TZERO_VALUE = new BigDecimal("309468.503");

    public static final BigDecimal IDE2_VALUE = new BigDecimal("391477.656");
    public static final BigDecimal IDE2_TZERO_VALUE = new BigDecimal("323535.253");

    public static final BigDecimal IDE3_VALUE = new BigDecimal("450199.304");
    public static final BigDecimal IDE3_TZERO_VALUE = new BigDecimal("338241.400");

    public static final BigDecimal IDE4_VALUE = new BigDecimal("517729.200");
    public static final BigDecimal IDE4_TZERO_VALUE = new BigDecimal("353616.010");

    public static final BigDecimal IDE5_VALUE = new BigDecimal("595388.580");
    public static final BigDecimal IDE5_TZERO_VALUE = new BigDecimal("369689.465");

    public static final BigDecimal IDE6_VALUE = new BigDecimal("670407.541");
    public static final BigDecimal IDE6_TZERO_VALUE = new BigDecimal("378427.579");

    public static final BigDecimal IDE7_VALUE = new BigDecimal("738789.110");
    public static final BigDecimal IDE7_TZERO_VALUE = new BigDecimal("379115.629");

    public static final BigDecimal IDE8_VALUE = new BigDecimal("796414.661");
    public static final BigDecimal IDE8_TZERO_VALUE = new BigDecimal("371533.317");

    public static final BigDecimal IDE9_VALUE = new BigDecimal("839421.053");
    public static final BigDecimal IDE9_TZERO_VALUE = new BigDecimal("355996.469");

    public static final BigDecimal IDE10_VALUE = new BigDecimal("864603.685");
    public static final BigDecimal IDE10_TZERO_VALUE = new BigDecimal("5085663.849");


    public static final BigDecimal INTANGIBLE_CAPITAL = new BigDecimal("8265287.47");

    public static final BigDecimal LONG_TERM_LIABILITIES = new BigDecimal("2100369.00");
    public static final BigDecimal CURRENT_LIABILITIES = new BigDecimal("62639997.00");

    private List<EBIT> ebits;
    private List<MyAsset> myAssets;
    private ZonedDateTime now;

    private static final BigDecimal IP_SPLITTING_VALUE = new BigDecimal("11835002.90");
    private static final BigDecimal KEY_COMP_SPLITTING_VALUE = new BigDecimal("25193264.09");
    private static final BigDecimal ORG_CAPITAL_SPLITTING_VALUE = new BigDecimal("22474010.03");

    private static final BigDecimal LOSS_OF_INTANGIBLE_PERCENTAGE = new BigDecimal("18.29");
    private static final BigDecimal INTANGIBLE_LOSS_BY_ATTACKS = new BigDecimal("1511721.08");

    private static final SectorType GLOBAL_SECTOR = SectorType.GLOBAL;
    private static final CategoryType IP_CATEGORY = CategoryType.IP;
    private static final CategoryType KEY_COMP_CATEGORY = CategoryType.KEY_COMP;
    private static final CategoryType ORG_CAPITAL_CATEGORY = CategoryType.ORG_CAPITAL;

    private static final BigDecimal IP_SPLITTING_LOSS = new BigDecimal("300681.32");
    private static final BigDecimal KEY_COMP_AND_HUMAN_CAPITAL_SPLITTING_LOSS = new BigDecimal("640062.71");
    private static final BigDecimal ORG_CAPITAL_SPLITTING_LOSS = new BigDecimal("570977.05");

    // Growth Rates
    private List<GrowthRate> growthRates;

    public static List<MyAsset> getFixedAssets() {
        List<MyAsset> fixedAssets = new ArrayList<>();

        //Fixed MyAssets
        AssetCategory fixedAssetsCategory = new AssetCategory();
        fixedAssetsCategory.setName(Calculator.FIXED_ASSETS_CATEGORY_NAME);
        fixedAssetsCategory.setType(AssetType.TANGIBLE);

        Asset fixedAsset = new Asset();
        fixedAsset.setName("Fixed");
        fixedAsset.setAssetcategory(fixedAssetsCategory);

        MyAsset inventories = new MyAsset();
        inventories.setAsset(fixedAsset);
        inventories.setEconomicValue(new BigDecimal("2571752.00"));
        fixedAssets.add(inventories);

        MyAsset equipment = new MyAsset();
        equipment.setAsset(fixedAsset);
        equipment.setEconomicValue(new BigDecimal("25866889.00"));
        fixedAssets.add(equipment);

        return fixedAssets;

    }

    public static List<MyAsset> getCurrentAssets() {
        List<MyAsset> currentAssets = new ArrayList<>();

        //Current MyAssets
        AssetCategory currentAssetsCategory = new AssetCategory();
        currentAssetsCategory.setName(Calculator.CURRENT_ASSETS_CATEGORY_NAME);
        currentAssetsCategory.setType(AssetType.TANGIBLE);

        Asset currentAsset = new Asset();
        currentAsset.setName("Current");
        currentAsset.setAssetcategory(currentAssetsCategory);

        MyAsset myCurrentAsset = new MyAsset();
        myCurrentAsset.setAsset(currentAsset);
        myCurrentAsset.setEconomicValue(new BigDecimal("59643100.00"));
        currentAssets.add(myCurrentAsset);

        return currentAssets;
    }

    @Before
    public void setup() {
        //Data to calculate the EconomicPerformance
        this.now = ZonedDateTime.now();

        //EBITS
        this.ebits = new ArrayList<>();
        this.ebits.add(new EBIT(2017, new BigDecimal(1991457.00), this.now, null));
        this.ebits.add(new EBIT(2018, new BigDecimal(950243.00), this.now, null));
        this.ebits.add(new EBIT(2019, new BigDecimal(2667248.00), this.now, null));

        this.ebits.add(new EBIT(2020, new BigDecimal(2300000.00), this.now, null));
        this.ebits.add(new EBIT(2021, new BigDecimal(2300000.00), this.now, null));
        this.ebits.add(new EBIT(2022, new BigDecimal(2300000.00), this.now, null));

        //Data to calculate the IntangibleDrivingEarnings
        this.myAssets = new ArrayList<>();

        //Fixed MyAssets
        this.myAssets.addAll(getFixedAssets());

        //Current MyAssets
        this.myAssets.addAll(getCurrentAssets());
        //Data to calculate the Intangible Capital

        //Growth Rates
        this.growthRates = new ArrayList<>();
        this.growthRates.add(new GrowthRate(1, new BigDecimal("0.150"), null));
        this.growthRates.add(new GrowthRate(2, new BigDecimal("0.150"), null));
        this.growthRates.add(new GrowthRate(3, new BigDecimal("0.150"), null));
        this.growthRates.add(new GrowthRate(4, new BigDecimal("0.150"), null));
        this.growthRates.add(new GrowthRate(5, new BigDecimal("0.150"), null));

        this.growthRates.add(new GrowthRate(6, new BigDecimal("0.126"), null));
        this.growthRates.add(new GrowthRate(7, new BigDecimal("0.102"), null));
        this.growthRates.add(new GrowthRate(8, new BigDecimal("0.078"), null));
        this.growthRates.add(new GrowthRate(9, new BigDecimal("0.054"), null));
        this.growthRates.add(new GrowthRate(10, new BigDecimal("0.030"), null));
    }

    @Test
    public void calculateEconomicPerformance() {
        BigDecimal economicPerformance = Calculator.calculateEconomicPerformance(this.ebits, this.DISCOUNTING_RATE);

        Assert.assertEquals(TEN_PERCENT_DISCOUNTING_RATE_ECONOMIC_PERFORMANCE, economicPerformance);
    }

    @Test
    public void calculateIntangibleDrivingEarnings() {
        BigDecimal intangibleDrivingEarnings =
            Calculator.calculateIntangibleDrivingEarnings(TEN_PERCENT_DISCOUNTING_RATE_ECONOMIC_PERFORMANCE,
                PHYSICAL_ASSETS_RETURN, LONG_TERM_LIABILITIES,
                FINANCIAL_ASSETS_RETURN, CURRENT_LIABILITIES,
                this.myAssets);

        Assert.assertEquals(INTANGIBLE_DRIVING_EARNINGS, intangibleDrivingEarnings);
    }

    @Test
    public void calculateIntangibleCapital() {
        try {
            List<IDE> ides = Calculator.calculateIDEs(INTANGIBLE_DRIVING_EARNINGS, this.growthRates);
            List<IDE> idesTZero = Calculator.calculateIDEsTZero(DISCOUNTING_RATE, this.growthRates, ides);

            BigDecimal intangibleCapital = Calculator.calculateIntangibleCapital(idesTZero);

            Assert.assertEquals(INTANGIBLE_CAPITAL, intangibleCapital);
        } catch (IllegalInputException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void calculateIntangibleLossByAttacks() {
        BigDecimal intangibleLossByAttacks = Calculator.calculateIntangibleLossByAttacks(INTANGIBLE_CAPITAL, LOSS_OF_INTANGIBLE_PERCENTAGE);

        Assert.assertEquals(INTANGIBLE_LOSS_BY_ATTACKS, intangibleLossByAttacks);
    }

    @Test
    public void calculateGlobalIPSplittingLoss() {
        BigDecimal ipSplittingLoss = Calculator.calculateSplittingLoss(INTANGIBLE_LOSS_BY_ATTACKS, IP_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(IP_SPLITTING_LOSS, ipSplittingLoss);
    }

    @Test
    public void calculateGlobalKeyCompSplittingLoss() {
        BigDecimal keyCompSplittingLoss = Calculator.calculateSplittingLoss(INTANGIBLE_LOSS_BY_ATTACKS, KEY_COMP_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(KEY_COMP_AND_HUMAN_CAPITAL_SPLITTING_LOSS, keyCompSplittingLoss);
    }

    @Test
    public void calculateGlobalOrganisationalCapitalSplittingLoss() {
        BigDecimal orgSplittingLoss = Calculator.calculateSplittingLoss(INTANGIBLE_LOSS_BY_ATTACKS, ORG_CAPITAL_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(ORG_CAPITAL_SPLITTING_LOSS, orgSplittingLoss);
    }

    @Test
    public void calculateGlobalIPSplittingValue() {
        BigDecimal ipSplittingValue = Calculator.calculateSplittingValue(INTANGIBLE_CAPITAL_OLD, IP_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(IP_SPLITTING_VALUE, ipSplittingValue);
    }

    @Test
    public void calculateGlobalKeyCompSplittingValue() {
        BigDecimal keyCompSplittingValue = Calculator.calculateSplittingValue(INTANGIBLE_CAPITAL_OLD, KEY_COMP_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(KEY_COMP_SPLITTING_VALUE, keyCompSplittingValue);
    }

    @Test
    public void calculateGlobalOrganisationalCapitalSplittingValue() {
        BigDecimal orgSplittingValue = Calculator.calculateSplittingValue(INTANGIBLE_CAPITAL_OLD, ORG_CAPITAL_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(ORG_CAPITAL_SPLITTING_VALUE, orgSplittingValue);
    }

    @Test
    public void calculateIDEsAndIDEsTZero() {
        try {
            IDE ide1 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 1);
            Assert.assertEquals(IDE1_VALUE, ide1.getValue());

            IDE ideTZero1 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 1, ide1);
            Assert.assertEquals(IDE1_TZERO_VALUE, ideTZero1.getValue());

            //==============================================================================================

            IDE ide2 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 2);
            Assert.assertEquals(IDE2_VALUE, ide2.getValue());

            IDE ideTZero2 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 2, ide2);
            Assert.assertEquals(IDE2_TZERO_VALUE, ideTZero2.getValue());

            //==============================================================================================

            IDE ide3 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 3);
            Assert.assertEquals(IDE3_VALUE, ide3.getValue());

            IDE ideTZero3 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 3, ide3);
            Assert.assertEquals(IDE3_TZERO_VALUE, ideTZero3.getValue());

            //==============================================================================================

            IDE ide4 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 4);
            Assert.assertEquals(IDE4_VALUE, ide4.getValue());

            IDE ideTZero4 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 4, ide4);
            Assert.assertEquals(IDE4_TZERO_VALUE, ideTZero4.getValue());

            //==============================================================================================

            IDE ide5 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 5);
            Assert.assertEquals(IDE5_VALUE, ide5.getValue());

            IDE ideTZero5 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 5, ide5);
            Assert.assertEquals(IDE5_TZERO_VALUE, ideTZero5.getValue());

            //==============================================================================================

            IDE ide6 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 6);
            Assert.assertEquals(IDE6_VALUE, ide6.getValue());

            IDE ideTZero6 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 6, ide6);
            Assert.assertEquals(IDE6_TZERO_VALUE, ideTZero6.getValue());

            //==============================================================================================

            IDE ide7 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 7);
            Assert.assertEquals(IDE7_VALUE, ide7.getValue());

            IDE ideTZero7 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 7, ide7);
            Assert.assertEquals(IDE7_TZERO_VALUE, ideTZero7.getValue());

            //==============================================================================================

            IDE ide8 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 8);
            Assert.assertEquals(IDE8_VALUE, ide8.getValue());

            IDE ideTZero8 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 8, ide8);
            Assert.assertEquals(IDE8_TZERO_VALUE, ideTZero8.getValue());

            //==============================================================================================

            IDE ide9 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 9);
            Assert.assertEquals(IDE9_VALUE, ide9.getValue());

            IDE ideTZero9 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 9, ide9);
            Assert.assertEquals(IDE9_TZERO_VALUE, ideTZero9.getValue());

            //==============================================================================================

            IDE ide10 = Calculator.calculateIDE(INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 10);
            Assert.assertEquals(IDE10_VALUE, ide10.getValue());

            IDE ideTZero10 = Calculator.calculateIDETZero(DISCOUNTING_RATE, this.growthRates, 10, ide9);
            Assert.assertEquals(IDE10_TZERO_VALUE, ideTZero10.getValue());

            //==============================================================================================

        } catch (IllegalInputException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void calculateIDEs() {
        try {
            List<IDE> ides = Calculator.calculateIDEs(INTANGIBLE_DRIVING_EARNINGS, this.growthRates);

            for (IDE ide : ides) {
                switch (ide.getYear()) {
                    case 1: {
                        Assert.assertEquals(IDE1_VALUE, ide.getValue());
                        break;
                    }
                    case 2: {
                        Assert.assertEquals(IDE2_VALUE, ide.getValue());
                        break;
                    }
                    case 3: {
                        Assert.assertEquals(IDE3_VALUE, ide.getValue());
                        break;
                    }
                    case 4: {
                        Assert.assertEquals(IDE4_VALUE, ide.getValue());
                        break;
                    }
                    case 5: {
                        Assert.assertEquals(IDE5_VALUE, ide.getValue());
                        break;
                    }
                    case 6: {
                        Assert.assertEquals(IDE6_VALUE, ide.getValue());
                        break;
                    }
                    case 7: {
                        Assert.assertEquals(IDE7_VALUE, ide.getValue());
                        break;
                    }
                    case 8: {
                        Assert.assertEquals(IDE8_VALUE, ide.getValue());
                        break;
                    }
                    case 9: {
                        Assert.assertEquals(IDE9_VALUE, ide.getValue());
                        break;
                    }
                    case 10: {
                        Assert.assertEquals(IDE10_VALUE, ide.getValue());
                        break;
                    }
                }
            }
        } catch (IllegalInputException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void calculateIDEsTZero() {
        try {
            List<IDE> ides = Calculator.calculateIDEs(INTANGIBLE_DRIVING_EARNINGS, this.growthRates);
            List<IDE> idesTZero = Calculator.calculateIDEsTZero(DISCOUNTING_RATE, this.growthRates, ides);

            for (IDE ide : idesTZero) {
                switch (ide.getYear()) {
                    case 1: {
                        Assert.assertEquals(IDE1_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 2: {
                        Assert.assertEquals(IDE2_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 3: {
                        Assert.assertEquals(IDE3_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 4: {
                        Assert.assertEquals(IDE4_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 5: {
                        Assert.assertEquals(IDE5_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 6: {
                        Assert.assertEquals(IDE6_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 7: {
                        Assert.assertEquals(IDE7_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 8: {
                        Assert.assertEquals(IDE8_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 9: {
                        Assert.assertEquals(IDE9_TZERO_VALUE, ide.getValue());
                        break;
                    }
                    case 10: {
                        Assert.assertEquals(IDE10_TZERO_VALUE, ide.getValue());
                        break;
                    }
                }
            }
        } catch (IllegalInputException e) {
            e.printStackTrace();
        }
    }
}
