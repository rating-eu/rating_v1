package eu.hermeneut.domain.wp3;

import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.domain.SplittingLoss;

import java.util.List;

public class WP3OutputBundle {
    private EconomicResults economicResults;
    private EconomicCoefficients economicCoefficients;
    private List<SplittingLoss> splittingLosses;

    public EconomicResults getEconomicResults() {
        return economicResults;
    }

    public void setEconomicResults(EconomicResults economicResults) {
        this.economicResults = economicResults;
    }

    public EconomicCoefficients getEconomicCoefficients() {
        return economicCoefficients;
    }

    public void setEconomicCoefficients(EconomicCoefficients economicCoefficients) {
        this.economicCoefficients = economicCoefficients;
    }

    public List<SplittingLoss> getSplittingLosses() {
        return splittingLosses;
    }

    public void setSplittingLosses(List<SplittingLoss> splittingLosses) {
        this.splittingLosses = splittingLosses;
    }
}
