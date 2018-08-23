package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A EconomicResults.
 */
@Entity
@Table(name = "economic_results")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "economicresults")
public class EconomicResults implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "economic_performance", precision=10, scale=2)
    private BigDecimal economicPerformance;

    @Column(name = "intangible_driving_earnings", precision=10, scale=2)
    private BigDecimal intangibleDrivingEarnings;

    @Column(name = "intangible_capital", precision=10, scale=2)
    private BigDecimal intangibleCapital;

    @Column(name = "intangible_loss_by_attacks", precision=10, scale=2)
    private BigDecimal intangibleLossByAttacks;

    @OneToOne
    @JoinColumn(unique = true)
    private SelfAssessment selfAssessment;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getEconomicPerformance() {
        return economicPerformance;
    }

    public EconomicResults economicPerformance(BigDecimal economicPerformance) {
        this.economicPerformance = economicPerformance;
        return this;
    }

    public void setEconomicPerformance(BigDecimal economicPerformance) {
        this.economicPerformance = economicPerformance;
    }

    public BigDecimal getIntangibleDrivingEarnings() {
        return intangibleDrivingEarnings;
    }

    public EconomicResults intangibleDrivingEarnings(BigDecimal intangibleDrivingEarnings) {
        this.intangibleDrivingEarnings = intangibleDrivingEarnings;
        return this;
    }

    public void setIntangibleDrivingEarnings(BigDecimal intangibleDrivingEarnings) {
        this.intangibleDrivingEarnings = intangibleDrivingEarnings;
    }

    public BigDecimal getIntangibleCapital() {
        return intangibleCapital;
    }

    public EconomicResults intangibleCapital(BigDecimal intangibleCapital) {
        this.intangibleCapital = intangibleCapital;
        return this;
    }

    public void setIntangibleCapital(BigDecimal intangibleCapital) {
        this.intangibleCapital = intangibleCapital;
    }

    public BigDecimal getIntangibleLossByAttacks() {
        return intangibleLossByAttacks;
    }

    public EconomicResults intangibleLossByAttacks(BigDecimal intangibleLossByAttacks) {
        this.intangibleLossByAttacks = intangibleLossByAttacks;
        return this;
    }

    public void setIntangibleLossByAttacks(BigDecimal intangibleLossByAttacks) {
        this.intangibleLossByAttacks = intangibleLossByAttacks;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public EconomicResults selfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
        return this;
    }

    public void setSelfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EconomicResults economicResults = (EconomicResults) o;
        if (economicResults.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), economicResults.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EconomicResults{" +
            "id=" + getId() +
            ", economicPerformance=" + getEconomicPerformance() +
            ", intangibleDrivingEarnings=" + getIntangibleDrivingEarnings() +
            ", intangibleCapital=" + getIntangibleCapital() +
            ", intangibleLossByAttacks=" + getIntangibleLossByAttacks() +
            "}";
    }
}
