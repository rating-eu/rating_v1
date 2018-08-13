package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.EBIT;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Calculator {

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

    public static void main(String[] args) {
        ZonedDateTime now = ZonedDateTime.now();

        List<EBIT> ebits = new ArrayList<>();
        ebits.add(new EBIT(2011, 72515.00, now, null));
        ebits.add(new EBIT(2012, 61372.00, now, null));
        ebits.add(new EBIT(2013, 64089.00, now, null));
        ebits.add(new EBIT(2014, 69718.70, now, null));
        ebits.add(new EBIT(2015, 71449.16, now, null));
        ebits.add(new EBIT(2016, 69693.278, now, null));

        double discountingRate = 0;

        double economicPerformance = calculateEconomicPerformance(ebits, discountingRate);
        System.out.println("EconomicPerformance: " + economicPerformance);
    }
}
