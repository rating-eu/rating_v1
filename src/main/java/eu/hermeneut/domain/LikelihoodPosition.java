package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.Likelihood;

/**
 * A LikelihoodPosition.
 */
@Entity
@Table(
    name = "likelihood_position",
    uniqueConstraints = @UniqueConstraint(columnNames = {"likelihood"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "likelihoodposition")
public class LikelihoodPosition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood")
    private Likelihood likelihood;

    @Column(name = "position")
    private Integer position;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Likelihood getLikelihood() {
        return likelihood;
    }

    public LikelihoodPosition likelihood(Likelihood likelihood) {
        this.likelihood = likelihood;
        return this;
    }

    public void setLikelihood(Likelihood likelihood) {
        this.likelihood = likelihood;
    }

    public Integer getPosition() {
        return position;
    }

    public LikelihoodPosition position(Integer position) {
        this.position = position;
        return this;
    }

    public void setPosition(Integer position) {
        this.position = position;
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
        LikelihoodPosition likelihoodPosition = (LikelihoodPosition) o;
        if (likelihoodPosition.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), likelihoodPosition.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LikelihoodPosition{" +
            "id=" + getId() +
            ", likelihood='" + getLikelihood() + "'" +
            ", position=" + getPosition() +
            "}";
    }
}
