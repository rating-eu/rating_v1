package eu.hermeneut.utils.wp4;

import eu.hermeneut.domain.MyAsset;

import java.math.BigDecimal;
import java.util.Comparator;

public class MyAssetComparator implements Comparator<MyAsset> {
    @Override
    public int compare(MyAsset o1, MyAsset o2) {
        BigDecimal value1 = valueOrDefault(o1);
        BigDecimal value2 = valueOrDefault(o2);

        return value1.subtract(value2).intValue();
    }

    private BigDecimal valueOrDefault(MyAsset myAsset) {
        BigDecimal value = BigDecimal.ZERO;

        if (myAsset.getEconomicValue() != null) {
            value = myAsset.getEconomicValue();
        } else if (myAsset.getMagnitude() != null) {
            try {
                value = new BigDecimal(Double.parseDouble(myAsset.getMagnitude()));
            } catch (NumberFormatException e) {
                value = BigDecimal.ZERO;
            }
        }

        return value;
    }
}
