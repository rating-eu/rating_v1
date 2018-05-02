package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.Phase;

/**
 * A PhaseWrapper.
 */
@Entity
@Table(name = "phase_wrapper")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "phasewrapper")
public class PhaseWrapper implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "phase")
    private Phase phase;

    @ManyToOne
    private AttackStrategy attackStrategy;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Phase getPhase() {
        return phase;
    }

    public PhaseWrapper phase(Phase phase) {
        this.phase = phase;
        return this;
    }

    public void setPhase(Phase phase) {
        this.phase = phase;
    }

    public AttackStrategy getAttackStrategy() {
        return attackStrategy;
    }

    public PhaseWrapper attackStrategy(AttackStrategy attackStrategy) {
        this.attackStrategy = attackStrategy;
        return this;
    }

    public void setAttackStrategy(AttackStrategy attackStrategy) {
        this.attackStrategy = attackStrategy;
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
        PhaseWrapper phaseWrapper = (PhaseWrapper) o;
        if (phaseWrapper.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), phaseWrapper.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PhaseWrapper{" +
            "id=" + getId() +
            ", phase='" + getPhase() + "'" +
            "}";
    }
}
