package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.Asset;
import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.EBIT;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
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
    private static final BigDecimal INTANGIBLE_CAPITAL = new BigDecimal("59502277.02");

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
        this.myAssets.addAll(getCurrrentAssets());
        //Data to calculate the Intangible Capital
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
    public void calculateIntangibleCapital() {
        BigDecimal intangibleCapital = Calculator.calculateIntangibleCapital(INTANGIBLE_DRIVING_EARNINGS, DISCOUNTING_RATE);

        Assert.assertEquals(INTANGIBLE_CAPITAL, intangibleCapital);
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
        BigDecimal ipSplittingValue = Calculator.calculateSplittingValue(INTANGIBLE_CAPITAL, IP_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(IP_SPLITTING_VALUE, ipSplittingValue);
    }

    @Test
    public void calculateGlobalKeyCompSplittingValue() {
        BigDecimal keyCompSplittingValue = Calculator.calculateSplittingValue(INTANGIBLE_CAPITAL, KEY_COMP_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(KEY_COMP_SPLITTING_VALUE, keyCompSplittingValue);
    }

    @Test
    public void calculateGlobalOrganisationalCapitalSplittingValue() {
        BigDecimal orgSplittingValue = Calculator.calculateSplittingValue(INTANGIBLE_CAPITAL, ORG_CAPITAL_CATEGORY, GLOBAL_SECTOR);

        Assert.assertEquals(ORG_CAPITAL_SPLITTING_VALUE, orgSplittingValue);
    }

    /*@Test
    public void calculateSplittingLossPercentage() {
        BigDecimal splittingLossPercentage = Calculator.calculateSplittingPercentage(this.ipCategory, this.globalSector);

        Assert.assertEquals(GLOBAL_IP_SPLITTING_LOSS_PERCENTAGE, splittingLossPercentage);
    }

    @Test
    public void calculateSplittingLoss() {
        BigDecimal splittingLoss = Calculator.calculateSplittingLoss(INTANGIBLE_LOSS_BY_ATTACKS, this.ipCategory, this.globalSector);

        Assert.assertEquals(SPLITTING_LOSS_OF_INTANGIBLE, splittingLoss);
    }*/

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

        MyAsset fornitureAndOfficeSupplies = new MyAsset();
        fornitureAndOfficeSupplies.setAsset(fixedAsset);
        fornitureAndOfficeSupplies.setEconomicValue(new BigDecimal("250000"));
        fixedAssets.add(fornitureAndOfficeSupplies);

        return fixedAssets;

    }

    public static List<MyAsset> getCurrrentAssets() {
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
