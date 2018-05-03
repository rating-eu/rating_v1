package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.Level;

/**
 * A LevelWrapper.
 */
@Entity
@Table(name = "level_wrapper")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "levelwrapper")
public class LevelWrapper implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_level")
    private Level level;

    @ManyToOne
    private AttackStrategy attackStrategy;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Level getLevel() {
        return level;
    }

    public LevelWrapper level(Level level) {
        this.level = level;
        return this;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public AttackStrategy getAttackStrategy() {
        return attackStrategy;
    }

    public LevelWrapper attackStrategy(AttackStrategy attackStrategy) {
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
        LevelWrapper levelWrapper = (LevelWrapper) o;
        if (levelWrapper.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), levelWrapper.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LevelWrapper{" +
            "id=" + getId() +
            ", level='" + getLevel() + "'" +
            "}";
    }
}
