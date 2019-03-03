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

public class WP3CalculatorUnitTest {

    //Data to calculate the EconomicPerformance
    private static final BigDecimal DISCOUNTING_RATE = new BigDecimal("10");

    private static final BigDecimal TEN_PERCENT_DISCOUNTING_RATE_ECONOMIC_PERFORMANCE = new BigDecimal("65726354.72");
    private static final BigDecimal PHYSICAL_ASSETS_RETURN = new BigDecimal("7.1");
    private static final BigDecimal FINANCIAL_ASSETS_RETURN = new BigDecimal("5");
    private static final BigDecimal INTANGIBLE_DRIVING_EARNINGS = new BigDecimal("65452504.72");
    private static final BigDecimal INTANGIBLE_CAPITAL_OLD = new BigDecimal("59502277.02");
    public static final BigDecimal IDES_INTANGIBLE_DRIVING_EARNINGS = new BigDecimal("121264.61");
    public static final BigDecimal IDE1_VALUE = new BigDecimal("139454.302");
    public static final BigDecimal IDE1_TZERO_VALUE = new BigDecimal("126776.638");
    public static final BigDecimal IDE2_VALUE = new BigDecimal("160372.447");
    public static final BigDecimal IDE2_TZERO_VALUE = new BigDecimal("132539.212");
    public static final BigDecimal IDE3_VALUE = new BigDecimal("184428.314");
    public static final BigDecimal IDE3_TZERO_VALUE = new BigDecimal("138563.722");
    public static final BigDecimal IDE4_VALUE = new BigDecimal("212092.561");
    public static final BigDecimal IDE4_TZERO_VALUE = new BigDecimal("144862.073");
    public static final BigDecimal IDE5_VALUE = new BigDecimal("243906.445");
    public static final BigDecimal IDE5_TZERO_VALUE = new BigDecimal("151446.713");
    public static final BigDecimal IDE6_VALUE = new BigDecimal("274638.657");
    public static final BigDecimal IDE6_TZERO_VALUE = new BigDecimal("155026.362");
    public static final BigDecimal IDE7_VALUE = new BigDecimal("302651.800");
    public static final BigDecimal IDE7_TZERO_VALUE = new BigDecimal("155308.228");
    public static final BigDecimal IDE8_VALUE = new BigDecimal("326258.640");
    public static final BigDecimal IDE8_TZERO_VALUE = new BigDecimal("152202.063");
    public static final BigDecimal IDE9_VALUE = new BigDecimal("343876.607");
    public static final BigDecimal IDE9_TZERO_VALUE = new BigDecimal("145837.250");
    public static final BigDecimal IDE10_VALUE = new BigDecimal("354192.905");
    public static final BigDecimal IDE10_TZERO_VALUE = new BigDecimal("2083389.286");
    public static final BigDecimal IDES_DISCOUNTING_RATE_10_PERCENT = new BigDecimal("10");
    public static final BigDecimal INTANGIBLE_CAPITAL = new BigDecimal("3385951.55");

    private List<EBIT> ebits;
    private List<MyAsset> myAssets;
    private ZonedDateTime now;

    private static final BigDecimal IP_SPLITTING_VALUE = new BigDecimal("11835002.90");
    private static final BigDecimal KEY_COMP_SPLITTING_VALUE = new BigDecimal("25193264.09");
    private static final BigDecimal ORG_CAPITAL_SPLITTING_VALUE = new BigDecimal("22474010.03");

    private static final BigDecimal LOSS_OF_INTANGIBLE_PERCENTAGE = new BigDecimal("18.29");
    private static final BigDecimal INTANGIBLE_LOSS_BY_ATTACKS = new BigDecimal("10882966.47");

    private static final SectorType GLOBAL_SECTOR = SectorType.GLOBAL;
    private static final CategoryType IP_CATEGORY = CategoryType.IP;
    private static final CategoryType KEY_COMP_CATEGORY = CategoryType.KEY_COMP;
    private static final CategoryType ORG_CAPITAL_CATEGORY = CategoryType.ORG_CAPITAL;

    private static final BigDecimal IP_SPLITTING_LOSS = new BigDecimal("2164622.03");
    private static final BigDecimal KEY_COMP_AND_HUMAN_CAPITAL_SPLITTING_LOSS = new BigDecimal("4607848.00");
    private static final BigDecimal ORG_CAPITAL_SPLITTING_LOSS = new BigDecimal("4110496.44");

    // Growth Rates
    private List<GrowthRate> growthRates;

    @Before
    public void setup() {
        //Data to calculate the EconomicPerformance
        this.now = ZonedDateTime.now();

        //EBITS
        this.ebits = new ArrayList<>();
        this.ebits.add(new EBIT(2017, new BigDecimal(72515000.00), this.now, null));
        this.ebits.add(new EBIT(2018, new BigDecimal(61372000.00), this.now, null));
        this.ebits.add(new EBIT(2019, new BigDecimal(64089000.00), this.now, null));
        this.ebits.add(new EBIT(2020, new BigDecimal(69718700.00), this.now, null));
        this.ebits.add(new EBIT(2021, new BigDecimal(71449160.00), this.now, null));
        this.ebits.add(new EBIT(2022, new BigDecimal(69693278.00), this.now, null));

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
        BigDecimal intangibleDrivingEarnings = Calculator.calculateIntangibleDrivingEarnings(TEN_PERCENT_DISCOUNTING_RATE_ECONOMIC_PERFORMANCE, PHYSICAL_ASSETS_RETURN, FINANCIAL_ASSETS_RETURN, this.myAssets);

        Assert.assertEquals(INTANGIBLE_DRIVING_EARNINGS, intangibleDrivingEarnings);
    }

    @Test
    public void calculateIntangibleCapitalOLD() {
        BigDecimal intangibleCapital = Calculator.calculateIntangibleCapital(INTANGIBLE_DRIVING_EARNINGS, DISCOUNTING_RATE);

        Assert.assertEquals(INTANGIBLE_CAPITAL_OLD, intangibleCapital);
    }

    @Test
    public void calculateIntangibleCapital() {
        try {
            List<IDE> ides = Calculator.calculateIDEs(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates);
            List<IDE> idesTZero = Calculator.calculateIDEsTZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, ides);

            BigDecimal intangibleCapital = Calculator.calculateIntangibleCapital(idesTZero);

            Assert.assertEquals(INTANGIBLE_CAPITAL, intangibleCapital);
        } catch (IllegalInputException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void calculateIntangibleLossByAttacks() {
        BigDecimal intangibleLossByAttacks = Calculator.calculateIntangibleLossByAttacks(INTANGIBLE_CAPITAL_OLD, LOSS_OF_INTANGIBLE_PERCENTAGE);

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
            IDE ide1 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 1);
            Assert.assertEquals(IDE1_VALUE, ide1.getValue());

            IDE ideTZero1 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 1, ide1);
            Assert.assertEquals(IDE1_TZERO_VALUE, ideTZero1.getValue());

            //==============================================================================================

            IDE ide2 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 2);
            Assert.assertEquals(IDE2_VALUE, ide2.getValue());

            IDE ideTZero2 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 2, ide2);
            Assert.assertEquals(IDE2_TZERO_VALUE, ideTZero2.getValue());

            //==============================================================================================

            IDE ide3 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 3);
            Assert.assertEquals(IDE3_VALUE, ide3.getValue());

            IDE ideTZero3 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 3, ide3);
            Assert.assertEquals(IDE3_TZERO_VALUE, ideTZero3.getValue());

            //==============================================================================================

            IDE ide4 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 4);
            Assert.assertEquals(IDE4_VALUE, ide4.getValue());

            IDE ideTZero4 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 4, ide4);
            Assert.assertEquals(IDE4_TZERO_VALUE, ideTZero4.getValue());

            //==============================================================================================

            IDE ide5 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 5);
            Assert.assertEquals(IDE5_VALUE, ide5.getValue());

            IDE ideTZero5 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 5, ide5);
            Assert.assertEquals(IDE5_TZERO_VALUE, ideTZero5.getValue());

            //==============================================================================================

            IDE ide6 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 6);
            Assert.assertEquals(IDE6_VALUE, ide6.getValue());

            IDE ideTZero6 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 6, ide6);
            Assert.assertEquals(IDE6_TZERO_VALUE, ideTZero6.getValue());

            //==============================================================================================

            IDE ide7 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 7);
            Assert.assertEquals(IDE7_VALUE, ide7.getValue());

            IDE ideTZero7 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 7, ide7);
            Assert.assertEquals(IDE7_TZERO_VALUE, ideTZero7.getValue());

            //==============================================================================================

            IDE ide8 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 8);
            Assert.assertEquals(IDE8_VALUE, ide8.getValue());

            IDE ideTZero8 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 8, ide8);
            Assert.assertEquals(IDE8_TZERO_VALUE, ideTZero8.getValue());

            //==============================================================================================

            IDE ide9 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 9);
            Assert.assertEquals(IDE9_VALUE, ide9.getValue());

            IDE ideTZero9 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 9, ide9);
            Assert.assertEquals(IDE9_TZERO_VALUE, ideTZero9.getValue());

            //==============================================================================================

            IDE ide10 = Calculator.calculateIDE(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates, 10);
            Assert.assertEquals(IDE10_VALUE, ide10.getValue());

            IDE ideTZero10 = Calculator.calculateIDETZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, 10, ide9);
            Assert.assertEquals(IDE10_TZERO_VALUE, ideTZero10.getValue());

            //==============================================================================================

        } catch (IllegalInputException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void calculateIDEs() {
        try {
            List<IDE> ides = Calculator.calculateIDEs(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates);

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
            List<IDE> ides = Calculator.calculateIDEs(IDES_INTANGIBLE_DRIVING_EARNINGS, this.growthRates);
            List<IDE> idesTZero = Calculator.calculateIDEsTZero(IDES_DISCOUNTING_RATE_10_PERCENT, this.growthRates, ides);

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

    public static List<MyAsset> getFixedAssets() {
        List<MyAsset> fixedAssets = new ArrayList<>();

        //Fixed MyAssets
        AssetCategory fixedAssetsCategory = new AssetCategory();
        fixedAssetsCategory.setName(Calculator.FIXED_ASSETS_CATEGORY_NAME);
        fixedAssetsCategory.setType(AssetType.TANGIBLE);

        Asset fixedAsset = new Asset();
        fixedAsset.setName("Fixed");
        fixedAsset.setAssetcategory(fixedAssetsCategory);

        MyAsset equipment = new MyAsset();
        equipment.setAsset(fixedAsset);
        equipment.setEconomicValue(new BigDecimal("100000"));
        fixedAssets.add(equipment);

        MyAsset land = new MyAsset();
        land.setAsset(fixedAsset);
        land.setEconomicValue(new BigDecimal("100000"));
        fixedAssets.add(land);

        MyAsset buildings = new MyAsset();
        buildings.setAsset(fixedAsset);
        buildings.setEconomicValue(new BigDecimal("1000000"));
        fixedAssets.add(buildings);

        MyAsset plantsAndMachinery = new MyAsset();
        plantsAndMachinery.setAsset(fixedAsset);
        plantsAndMachinery.setEconomicValue(new BigDecimal("400000"));
        fixedAssets.add(plantsAndMachinery);

        MyAsset furnitureAndOfficeSupplies = new MyAsset();
        furnitureAndOfficeSupplies.setAsset(fixedAsset);
        furnitureAndOfficeSupplies.setEconomicValue(new BigDecimal("250000"));
        fixedAssets.add(furnitureAndOfficeSupplies);

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

        MyAsset rawAndStockMaterial = new MyAsset();
        rawAndStockMaterial.setAsset(currentAsset);
        rawAndStockMaterial.setEconomicValue(new BigDecimal("100000"));
        currentAssets.add(rawAndStockMaterial);

        MyAsset insurancePremiums = new MyAsset();
        insurancePremiums.setAsset(currentAsset);
        insurancePremiums.setEconomicValue(new BigDecimal("1000000"));
        currentAssets.add(insurancePremiums);

        MyAsset equities = new MyAsset();
        equities.setAsset(currentAsset);
        equities.setEconomicValue(new BigDecimal("100000"));
        currentAssets.add(equities);

        MyAsset certificateOfDeposit = new MyAsset();
        certificateOfDeposit.setAsset(currentAsset);
        certificateOfDeposit.setEconomicValue(new BigDecimal("1000000"));
        currentAssets.add(certificateOfDeposit);

        MyAsset corporateBondsAndStocks = new MyAsset();
        corporateBondsAndStocks.setAsset(currentAsset);
        corporateBondsAndStocks.setEconomicValue(new BigDecimal("300000"));
        currentAssets.add(corporateBondsAndStocks);

        MyAsset temporaryInvestments = new MyAsset();
        temporaryInvestments.setAsset(currentAsset);
        temporaryInvestments.setEconomicValue(new BigDecimal("100000"));
        currentAssets.add(temporaryInvestments);

        MyAsset cash = new MyAsset();
        cash.setAsset(currentAsset);
        cash.setEconomicValue(new BigDecimal("250000"));
        currentAssets.add(cash);

        return currentAssets;
    }
}
