package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.EBIT;
import org.junit.Before;
import org.junit.Test;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class CalculatorUnitTest {

    private double discountingRate;
    private List<EBIT> ebits;
    private ZonedDateTime now;

    @Before
    public void setup() {
        this.now = ZonedDateTime.now();

        this.ebits = new ArrayList<>();
        this.ebits.add(new EBIT(2011, 72515.00, this.now, null));
        this.ebits.add(new EBIT(2012, 61372.00, this.now, null));
        this.ebits.add(new EBIT(2013, 64089.00, this.now, null));
        this.ebits.add(new EBIT(2014, 69718.70, this.now, null));
        this.ebits.add(new EBIT(2015, 71449.16, this.now, null));
        this.ebits.add(new EBIT(2016, 69693.278, this.now, null));

        this.discountingRate = 0;
    }

    @Test
    public void calculateEconomicPerformance() {
        double economicPerformance = Calculator.calculateEconomicPerformance(this.ebits, this.discountingRate);

        assertThat(economicPerformance).isEqualTo(68139.523);
    }
}
