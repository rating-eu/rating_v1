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
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class CalculatorUnitTest {

    //Data to calculate the EconomicPerformance
    private BigDecimal discountingRate;
    private List<EBIT> ebits;
    private ZonedDateTime now;
    private static final BigDecimal ZERO_ECONOMIC_PERFORMANCE = new BigDecimal("68139.523");
    private static final BigDecimal ONE_ECONOMIC_PERFORMANCE = new BigDecimal("89721.050");

    private static final BigDecimal ONE_ECONOMIC_PERFORMANCE_2011 = new BigDecimal("290060.000");
    private static final BigDecimal ONE_ECONOMIC_PERFORMANCE_2012 = new BigDecimal("122744.000");
    private static final BigDecimal ONE_ECONOMIC_PERFORMANCE_2013 = new BigDecimal("64089.000");
    private static final BigDecimal ONE_ECONOMIC_PERFORMANCE_2014 = new BigDecimal("34859.350");
    private static final BigDecimal ONE_ECONOMIC_PERFORMANCE_2015 = new BigDecimal("17862.290");
    private static final BigDecimal ONE_ECONOMIC_PERFORMANCE_2016 = new BigDecimal("8711.660");

    //Data to calculate the IntangibleDrivingEarnings
    private BigDecimal economicPerformance;
    private BigDecimal physicalAssetsReturn;
    private BigDecimal financialAssetsReturn;
    private List<MyAsset> myAssets;
    private static final BigDecimal ZERO_INTANGIBLE_DRIVING_EARNINGS = new BigDecimal("68042.804");

    //Data to calculate the Intangible Capital
    private BigDecimal intangibleDrivingEarnings;
    private BigDecimal discountingRateForIntangibleCapital;
    private static final BigDecimal INTANGIBLE_CAPITAL = new BigDecimal("45361.869");

    //Data to calculate the Loss of Intangible by Attacks
    private static final BigDecimal LOSS_OF_INTANGIBLE_PERCENTAGE = new BigDecimal("18.29");
    private static final BigDecimal INTANGIBLE_LOSS_BY_ATTACKS = new BigDecimal("8296.686");

    //Data to calculate the SplittingLoss percentage
    private SectorType globalSector;
    private CategoryType ipCategory;
    private static final BigDecimal GLOBAL_IP_SPLITTING_LOSS_PERCENTAGE = new BigDecimal("19.89");

    //Data to calculate the SplittingLoss
    private static final BigDecimal SPLITTING_LOSS_OF_INTANGIBLE = new BigDecimal("1650.211");

    @Before
    public void setup() {
        //Data to calculate the EconomicPerformance
        this.now = ZonedDateTime.now();

        this.ebits = new ArrayList<>();
        this.ebits.add(new EBIT(2011, new BigDecimal(72515.00), this.now, null));
        this.ebits.add(new EBIT(2012, new BigDecimal(61372.00), this.now, null));
        this.ebits.add(new EBIT(2013, new BigDecimal(64089.00), this.now, null));
        this.ebits.add(new EBIT(2014, new BigDecimal(69718.70), this.now, null));
        this.ebits.add(new EBIT(2015, new BigDecimal(71449.16), this.now, null));
        this.ebits.add(new EBIT(2016, new BigDecimal(69693.278), this.now, null));

        //Data to calculate the IntangibleDrivingEarnings
        this.economicPerformance = ZERO_ECONOMIC_PERFORMANCE;
        this.physicalAssetsReturn = new BigDecimal("7.1");
        this.financialAssetsReturn = new BigDecimal("5");
        this.myAssets = new ArrayList<>();

        //Fixed MyAssets
        AssetCategory fixedAssetsCategory = new AssetCategory();
        fixedAssetsCategory.setName(Calculator.FIXED_ASSETS_CATEGORY_NAME);
        fixedAssetsCategory.setType(AssetType.TANGIBLE);

        Asset fixedAsset = new Asset();
        fixedAsset.setName("Fixed");
        fixedAsset.setAssetcategory(fixedAssetsCategory);

        MyAsset myFixedAsset1 = new MyAsset();
        myFixedAsset1.setAsset(fixedAsset);
        myFixedAsset1.setEconomicValue(new BigDecimal("456.789"));
        myAssets.add(myFixedAsset1);

        MyAsset myFixedAsset2 = new MyAsset();
        myFixedAsset2.setAsset(fixedAsset);
        myFixedAsset2.setEconomicValue(new BigDecimal("123.456"));
        myAssets.add(myFixedAsset2);

        //Current MyAssets
        AssetCategory currentAssetsCategory = new AssetCategory();
        currentAssetsCategory.setName(Calculator.CURRENT_ASSETS_CATEGORY_NAME);
        currentAssetsCategory.setType(AssetType.TANGIBLE);

        Asset currentAsset = new Asset();
        currentAsset.setName("Current");
        currentAsset.setAssetcategory(currentAssetsCategory);

        MyAsset myCurrentAsset1 = new MyAsset();
        myCurrentAsset1.setAsset(currentAsset);
        myCurrentAsset1.setEconomicValue(new BigDecimal("654.321"));
        myAssets.add(myCurrentAsset1);

        MyAsset myCurrentAsset2 = new MyAsset();
        myCurrentAsset2.setAsset(currentAsset);
        myCurrentAsset2.setEconomicValue(new BigDecimal("456.123"));
        myAssets.add(myCurrentAsset2);

        //Data to calculate the Intangible Capital
        this.intangibleDrivingEarnings = ZERO_INTANGIBLE_DRIVING_EARNINGS;
        this.discountingRateForIntangibleCapital = new BigDecimal("0.5");

        //Data to calculate the SplittingLoss percentage
        this.globalSector = SectorType.GLOBAL;
        this.ipCategory = CategoryType.IP;
    }

    @Test
    public void calculateEconomicPerformanceWithZeroDiscountingRate() {
        this.discountingRate = BigDecimal.ZERO;
        BigDecimal economicPerformance = Calculator.calculateEconomicPerformance(this.ebits, this.discountingRate);

        Assert.assertEquals(ZERO_ECONOMIC_PERFORMANCE, economicPerformance);
    }

    @Test
    public void calculateEconomicPerformanceWithOneDiscountingRate() {
        this.discountingRate = BigDecimal.ONE;
        BigDecimal economicPerformance = Calculator.calculateEconomicPerformance(this.ebits, this.discountingRate);

        Assert.assertEquals(ONE_ECONOMIC_PERFORMANCE, economicPerformance);
    }

    @Test
    public void calculateEconomicPerformanceWithOneDiscountingRateStepByStep() {
        BigDecimal discountingRate = BigDecimal.ONE;
        BigDecimal economicPerformance = BigDecimal.ZERO;

        BigDecimal economicPerformance2011 = Calculator.economicPerformanceHelper(this.ebits, discountingRate, -2, 2);
        Assert.assertEquals(economicPerformance2011, ONE_ECONOMIC_PERFORMANCE_2011);
        economicPerformance = economicPerformance.add(economicPerformance2011);

        BigDecimal economicPerformance2012 = Calculator.economicPerformanceHelper(ebits, discountingRate, -1, 2);
        Assert.assertEquals(ONE_ECONOMIC_PERFORMANCE_2012, economicPerformance2012);
        economicPerformance = economicPerformance.add(economicPerformance2012);

        BigDecimal economicPerformance2013 = Calculator.economicPerformanceHelper(ebits, discountingRate, 0, 2);
        Assert.assertEquals(ONE_ECONOMIC_PERFORMANCE_2013, economicPerformance2013);
        economicPerformance = economicPerformance.add(economicPerformance2013);

        BigDecimal economicPerformance2014 = Calculator.economicPerformanceHelper(ebits, discountingRate, 1, 2);
        Assert.assertEquals(ONE_ECONOMIC_PERFORMANCE_2014, economicPerformance2014);
        economicPerformance = economicPerformance.add(economicPerformance2014);

        BigDecimal economicPerformance2015 = Calculator.economicPerformanceHelper(ebits, discountingRate, 2, 2);
        Assert.assertEquals(ONE_ECONOMIC_PERFORMANCE_2015, economicPerformance2015);
        economicPerformance = economicPerformance.add(economicPerformance2015);

        BigDecimal economicPerformance2016 = Calculator.economicPerformanceHelper(ebits, discountingRate, 3, 2);
        Assert.assertEquals(ONE_ECONOMIC_PERFORMANCE_2016, economicPerformance2016);
        economicPerformance = economicPerformance.add(economicPerformance2016);

        economicPerformance = economicPerformance.divide(new BigDecimal("6"), 3, RoundingMode.HALF_UP);
        Assert.assertEquals(ONE_ECONOMIC_PERFORMANCE, economicPerformance);
    }

    @Test
    public void calculateIntangibleDrivingEarnings() {
        BigDecimal intangibleDrivingEarnings = Calculator.calculateIntangibleDrivingEarnings(this.economicPerformance, this.physicalAssetsReturn, this.financialAssetsReturn, this.myAssets);

        Assert.assertEquals(ZERO_INTANGIBLE_DRIVING_EARNINGS, intangibleDrivingEarnings);
    }

    @Test
    public void calculateIntangibleCapital() {
        BigDecimal intangibleCapital = Calculator.calculateIntangibleCapital(this.intangibleDrivingEarnings, this.discountingRateForIntangibleCapital);

        Assert.assertEquals(INTANGIBLE_CAPITAL, intangibleCapital);
    }

    @Test
    public void calculateIntangibleLossByAttacks() {
        BigDecimal intangibleLossByAttacks = Calculator.calculateIntangibleLossByAttacks(INTANGIBLE_CAPITAL, LOSS_OF_INTANGIBLE_PERCENTAGE);

        Assert.assertEquals(INTANGIBLE_LOSS_BY_ATTACKS, intangibleLossByAttacks);
    }

    @Test
    public void calculateSplittingLossPercentage() {
        BigDecimal splittingLossPercentage = Calculator.calculateSplittingLossPercentage(this.ipCategory, this.globalSector);

        Assert.assertEquals(GLOBAL_IP_SPLITTING_LOSS_PERCENTAGE, splittingLossPercentage);
    }

    @Test
    public void calculateSplittingLoss() {
        BigDecimal splittingLoss = Calculator.calculateSplittingLoss(INTANGIBLE_LOSS_BY_ATTACKS, this.ipCategory, this.globalSector);

        Assert.assertEquals(SPLITTING_LOSS_OF_INTANGIBLE, splittingLoss);
    }
}
