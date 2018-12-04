package eu.hermeneut.utils.comparator;

import eu.hermeneut.domain.EBIT;

import java.util.Comparator;

public class EBITComparator implements Comparator<EBIT> {

    @Override
    public int compare(EBIT a, EBIT b) {
        return a.getYear() - b.getYear();
    }
}
