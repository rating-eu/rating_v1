package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.DataThreatLikelihood;

import eu.hermeneut.domain.enumeration.DataImpact;

import eu.hermeneut.domain.enumeration.DataRiskLevel;

/**
 * A DataRiskLevelConfig.
 */
@Entity
@Table(name = "data_risk_level_config")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class DataRiskLevelConfig implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(max = 2000)
    @Column(name = "rationale", length = 2000, nullable = false)
    private String rationale;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood", nullable = false)
    private DataThreatLikelihood likelihood;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "impact", nullable = false)
    private DataImpact impact;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "risk", nullable = false)
    private DataRiskLevel risk;

    @ManyToOne
    private DataOperation operation;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRationale() {
        return rationale;
    }

    public DataRiskLevelConfig rationale(String rationale) {
        this.rationale = rationale;
        return this;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public DataThreatLikelihood getLikelihood() {
        return likelihood;
    }

    public DataRiskLevelConfig likelihood(DataThreatLikelihood likelihood) {
        this.likelihood = likelihood;
        return this;
    }

    public void setLikelihood(DataThreatLikelihood likelihood) {
        this.likelihood = likelihood;
    }

    public DataImpact getImpact() {
        return impact;
    }

    public DataRiskLevelConfig impact(DataImpact impact) {
        this.impact = impact;
        return this;
    }

    public void setImpact(DataImpact impact) {
        this.impact = impact;
    }

    public DataRiskLevel getRisk() {
        return risk;
    }

    public DataRiskLevelConfig risk(DataRiskLevel risk) {
        this.risk = risk;
        return this;
    }

    public void setRisk(DataRiskLevel risk) {
        this.risk = risk;
    }

    public DataOperation getOperation() {
        return operation;
    }

    public DataRiskLevelConfig operation(DataOperation dataOperation) {
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
        DataRiskLevelConfig dataRiskLevelConfig = (DataRiskLevelConfig) o;
        if (dataRiskLevelConfig.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dataRiskLevelConfig.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DataRiskLevelConfig{" +
            "id=" + getId() +
            ", rationale='" + getRationale() + "'" +
            ", likelihood='" + getLikelihood() + "'" +
            ", impact='" + getImpact() + "'" +
            ", risk='" + getRisk() + "'" +
            "}";
    }
}
