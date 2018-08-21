package eu.hermeneut.utils.wp4;

import eu.hermeneut.domain.MyAsset;

import java.util.Comparator;

public class MyAssetComparator implements Comparator<MyAsset> {
    @Override
    public int compare(MyAsset o1, MyAsset o2) {
        return o1.getEconomicValue().subtract(o2.getEconomicValue()).intValue();
    }
}
