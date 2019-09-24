package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.ThreatArea;

import eu.hermeneut.domain.enumeration.DataThreatLikelihood;

/**
 * A DataThreat.
 */
@Entity
@Table(name = "data_threat")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class DataThreat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "threat_area", nullable = false)
    private ThreatArea threatArea;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood", nullable = false)
    private DataThreatLikelihood likelihood;

    @ManyToOne
    private DataOperation operation;

    @ManyToOne
    private OverallDataThreat overallDataThreat;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ThreatArea getThreatArea() {
        return threatArea;
    }

    public DataThreat threatArea(ThreatArea threatArea) {
        this.threatArea = threatArea;
        return this;
    }

    public void setThreatArea(ThreatArea threatArea) {
        this.threatArea = threatArea;
    }

    public DataThreatLikelihood getLikelihood() {
        return likelihood;
    }

    public DataThreat likelihood(DataThreatLikelihood likelihood) {
        this.likelihood = likelihood;
        return this;
    }

    public void setLikelihood(DataThreatLikelihood likelihood) {
        this.likelihood = likelihood;
    }

    public DataOperation getOperation() {
        return operation;
    }

    public DataThreat operation(DataOperation dataOperation) {
        this.operation = dataOperation;
        return this;
    }

    public void setOperation(DataOperation dataOperation) {
        this.operation = dataOperation;
    }

    public OverallDataThreat getOverallDataThreat() {
        return overallDataThreat;
    }

    public DataThreat overallDataThreat(OverallDataThreat overallDataThreat) {
        this.overallDataThreat = overallDataThreat;
        return this;
    }

    public void setOverallDataThreat(OverallDataThreat overallDataThreat) {
        this.overallDataThreat = overallDataThreat;
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
        DataThreat dataThreat = (DataThreat) o;
        if (dataThreat.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dataThreat.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DataThreat{" +
            "id=" + getId() +
            ", threatArea='" + getThreatArea() + "'" +
            ", likelihood='" + getLikelihood() + "'" +
            "}";
    }
}
