package eu.hermeneut.utils.wp3;

import eu.hermeneut.domain.Asset;
import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.EBIT;
import eu.hermeneut.domain.MyAsset;

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

        //Physical Assets
        for (MyAsset physicalAsset : physicalAssets) {
            intangibleDrivingEarnings -= physicalAssetsReturn * physicalAsset.getEconomicValue();
        }

        //Financial Assets
        for (MyAsset financialAsset : financialAssets) {
            intangibleDrivingEarnings -= financialAssetsReturn * financialAsset.getEconomicValue();
        }

        return intangibleDrivingEarnings;
    }

    public static double calculateIntangibleCapital(double intangibleDrivingEarnings, double discountingRate) {
        double intangibleCapital = 0;

        intangibleCapital += intangibleDrivingEarnings / (1 + discountingRate);

        return intangibleCapital;
    }
}
