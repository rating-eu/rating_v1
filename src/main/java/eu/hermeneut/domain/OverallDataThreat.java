package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.DataThreatLikelihood;

/**
 * A OverallDataThreat.
 */
@Entity
@Table(name = "overall_data_threat")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class OverallDataThreat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood", nullable = false)
    private DataThreatLikelihood likelihood;

    @OneToOne
    @JoinColumn(unique = true)
    private DataOperation operation;

    @OneToMany(mappedBy = "overallDataThreat",
        cascade = {CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE},
        orphanRemoval = true
    )
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<DataThreat> threats = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DataThreatLikelihood getLikelihood() {
        return likelihood;
    }

    public OverallDataThreat likelihood(DataThreatLikelihood likelihood) {
        this.likelihood = likelihood;
        return this;
    }

    public void setLikelihood(DataThreatLikelihood likelihood) {
        this.likelihood = likelihood;
    }

    public DataOperation getOperation() {
        return operation;
    }

    public OverallDataThreat operation(DataOperation dataOperation) {
        this.operation = dataOperation;
        return this;
    }

    public void setOperation(DataOperation dataOperation) {
        this.operation = dataOperation;
    }

    public Set<DataThreat> getThreats() {
        return threats;
    }

    public OverallDataThreat threats(Set<DataThreat> dataThreats) {
        this.threats = dataThreats;
        return this;
    }

    public OverallDataThreat addThreats(DataThreat dataThreat) {
        this.threats.add(dataThreat);
        dataThreat.setOverallDataThreat(this);
        return this;
    }

    public OverallDataThreat removeThreats(DataThreat dataThreat) {
        this.threats.remove(dataThreat);
        dataThreat.setOverallDataThreat(null);
        return this;
    }

    public void setThreats(Set<DataThreat> dataThreats) {
        this.threats = dataThreats;
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
        OverallDataThreat overallDataThreat = (OverallDataThreat) o;
        if (overallDataThreat.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), overallDataThreat.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OverallDataThreat{" +
            "id=" + getId() +
            ", likelihood='" + getLikelihood() + "'" +
            "}";
    }
}
