package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A ImpactLevel.
 */
@Entity
@Table(
    name = "impact_level",
    uniqueConstraints = @UniqueConstraint(columnNames = {"self_assessment_id", "impact"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "impactlevel")
public class ImpactLevel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "self_assessment_id", nullable = false)
    private Long selfAssessmentID;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "impact", nullable = false)
    private Integer impact;

    @NotNull
    @Min(value = 0L)
    @Column(name = "min_loss", nullable = false)
    private Long minLoss;

    @NotNull
    @Min(value = 0L)
    @Column(name = "max_loss", nullable = false)
    private Long maxLoss;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSelfAssessmentID() {
        return selfAssessmentID;
    }

    public ImpactLevel selfAssessmentID(Long selfAssessmentID) {
        this.selfAssessmentID = selfAssessmentID;
        return this;
    }

    public void setSelfAssessmentID(Long selfAssessmentID) {
        this.selfAssessmentID = selfAssessmentID;
    }

    public Integer getImpact() {
        return impact;
    }

    public ImpactLevel impact(Integer impact) {
        this.impact = impact;
        return this;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
    }

    public Long getMinLoss() {
        return minLoss;
    }

    public ImpactLevel minLoss(Long minLoss) {
        this.minLoss = minLoss;
        return this;
    }

    public void setMinLoss(Long minLoss) {
        this.minLoss = minLoss;
    }

    public Long getMaxLoss() {
        return maxLoss;
    }

    public ImpactLevel maxLoss(Long maxLoss) {
        this.maxLoss = maxLoss;
        return this;
    }

    public void setMaxLoss(Long maxLoss) {
        this.maxLoss = maxLoss;
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
        ImpactLevel impactLevel = (ImpactLevel) o;
        if (impactLevel.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), impactLevel.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ImpactLevel{" +
            "id=" + getId() +
            ", selfAssessmentID=" + getSelfAssessmentID() +
            ", impact=" + getImpact() +
            ", minLoss=" + getMinLoss() +
            ", maxLoss=" + getMaxLoss() +
            "}";
    }
}
