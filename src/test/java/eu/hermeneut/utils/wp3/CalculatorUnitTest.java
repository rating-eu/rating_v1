package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.EBIT;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class CalculatorUnitTest {

    private BigDecimal discountingRate;
    private List<EBIT> ebits;
    private ZonedDateTime now;
    private BigDecimal zeroEconomicPerformance = new BigDecimal("68139.523");
    private BigDecimal oneEconomicPerformance = new BigDecimal("89721.050");

    private BigDecimal oneEconomicPerformance2011 = new BigDecimal("290060.000");
    private BigDecimal oneEconomicPerformance2012 = new BigDecimal("122744.000");
    private BigDecimal oneEconomicPerformance2013 = new BigDecimal("64089.000");
    private BigDecimal oneEconomicPerformance2014 = new BigDecimal("34859.350");
    private BigDecimal oneEconomicPerformance2015 = new BigDecimal("17862.290");
    private BigDecimal oneEconomicPerformance2016 = new BigDecimal("8711.660");

    @Before
    public void setup() {
        this.now = ZonedDateTime.now();

        this.ebits = new ArrayList<>();
        this.ebits.add(new EBIT(2011, new BigDecimal(72515.00), this.now, null));
        this.ebits.add(new EBIT(2012, new BigDecimal(61372.00), this.now, null));
        this.ebits.add(new EBIT(2013, new BigDecimal(64089.00), this.now, null));
        this.ebits.add(new EBIT(2014, new BigDecimal(69718.70), this.now, null));
        this.ebits.add(new EBIT(2015, new BigDecimal(71449.16), this.now, null));
        this.ebits.add(new EBIT(2016, new BigDecimal(69693.278), this.now, null));
    }

    @Test
    public void calculateEconomicPerformanceWithZeroDiscountingRate() {
        this.discountingRate = BigDecimal.ZERO;
        BigDecimal economicPerformance = Calculator.calculateEconomicPerformance(this.ebits, this.discountingRate);

        Assert.assertEquals(zeroEconomicPerformance, economicPerformance);
    }

    @Test
    public void calculateEconomicPerformanceWithOneDiscountingRate() {
        this.discountingRate = BigDecimal.ONE;
        BigDecimal economicPerformance = Calculator.calculateEconomicPerformance(this.ebits, this.discountingRate);

        Assert.assertEquals(oneEconomicPerformance, economicPerformance);
    }

    @Test
    public void calculateEconomicPerformanceWithOneDiscountingRateStepByStep() {
        ZonedDateTime now = ZonedDateTime.now();

        List<EBIT> ebits = new ArrayList<>();
        ebits.add(new EBIT(2011, new BigDecimal(72515.00), now, null));
        ebits.add(new EBIT(2012, new BigDecimal(61372.00), now, null));
        ebits.add(new EBIT(2013, new BigDecimal(64089.00), now, null));
        ebits.add(new EBIT(2014, new BigDecimal(69718.70), now, null));
        ebits.add(new EBIT(2015, new BigDecimal(71449.16), now, null));
        ebits.add(new EBIT(2016, new BigDecimal(69693.278), now, null));

        BigDecimal discountingRate = BigDecimal.ONE;
        BigDecimal economicPerformance = BigDecimal.ZERO;

        BigDecimal economicPerformance2011 = Calculator.economicPerformanceHelper(ebits, discountingRate, -2, 2);
        Assert.assertEquals(economicPerformance2011, oneEconomicPerformance2011);
        economicPerformance = economicPerformance.add(economicPerformance2011);

        BigDecimal economicPerformance2012 = Calculator.economicPerformanceHelper(ebits, discountingRate, -1, 2);
        Assert.assertEquals(oneEconomicPerformance2012, economicPerformance2012);
        economicPerformance = economicPerformance.add(economicPerformance2012);

        BigDecimal economicPerformance2013 = Calculator.economicPerformanceHelper(ebits, discountingRate, 0, 2);
        Assert.assertEquals(oneEconomicPerformance2013, economicPerformance2013);
        economicPerformance = economicPerformance.add(economicPerformance2013);

        BigDecimal economicPerformance2014 = Calculator.economicPerformanceHelper(ebits, discountingRate, 1, 2);
        Assert.assertEquals(oneEconomicPerformance2014, economicPerformance2014);
        economicPerformance = economicPerformance.add(economicPerformance2014);

        BigDecimal economicPerformance2015 = Calculator.economicPerformanceHelper(ebits, discountingRate, 2, 2);
        Assert.assertEquals(oneEconomicPerformance2015, economicPerformance2015);
        economicPerformance = economicPerformance.add(economicPerformance2015);

        BigDecimal economicPerformance2016 = Calculator.economicPerformanceHelper(ebits, discountingRate, 3, 2);
        Assert.assertEquals(oneEconomicPerformance2016, economicPerformance2016);
        economicPerformance = economicPerformance.add(economicPerformance2016);

        economicPerformance = economicPerformance.divide(new BigDecimal("6"), 3, RoundingMode.HALF_UP);
        Assert.assertEquals(oneEconomicPerformance, economicPerformance);
    }
}
