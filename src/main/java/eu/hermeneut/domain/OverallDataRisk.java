package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.DataRiskLevel;

/**
 * A OverallDataRisk.
 */
@Entity
@Table(name = "overall_data_risk")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class OverallDataRisk implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private DataRiskLevel riskLevel;

    @OneToOne
    @JoinColumn(unique = true)
    private DataOperation operation;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DataRiskLevel getRiskLevel() {
        return riskLevel;
    }

    public OverallDataRisk riskLevel(DataRiskLevel riskLevel) {
        this.riskLevel = riskLevel;
        return this;
    }

    public void setRiskLevel(DataRiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public DataOperation getOperation() {
        return operation;
    }

    public OverallDataRisk operation(DataOperation dataOperation) {
        this.operation = dataOperation;
        return this;
    }

    public void setOperation(DataOperation dataOperation) {
        this.operation = dataOperation;
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
        OverallDataRisk overallDataRisk = (OverallDataRisk) o;
        if (overallDataRisk.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), overallDataRisk.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OverallDataRisk{" +
            "id=" + getId() +
            ", riskLevel='" + getRiskLevel() + "'" +
            "}";
    }
}
