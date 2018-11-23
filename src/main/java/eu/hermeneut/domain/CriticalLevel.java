package eu.hermeneut.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * =======WP4=======
 */
@ApiModel(description = "=======WP4=======")
@Entity
@Table(name = "critical_level")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "criticallevel")
public class CriticalLevel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Min(value = 3)
    @Column(name = "side")
    private Integer side;

    @Min(value = 1)
    @Column(name = "low_limit")
    private Integer lowLimit;

    @Min(value = 1)
    @Column(name = "medium_limit")
    private Integer mediumLimit;

    @Min(value = 1)
    @Column(name = "high_limit")
    private Integer highLimit;

    /**
     * WP4
     */
    @ApiModelProperty(value = "WP4")
    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(unique = true)
    private SelfAssessment selfAssessment;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSide() {
        return side;
    }

    public CriticalLevel side(Integer side) {
        this.side = side;
        return this;
    }

    public void setSide(Integer side) {
        this.side = side;
    }

    public Integer getLowLimit() {
        return lowLimit;
    }

    public CriticalLevel lowLimit(Integer lowLimit) {
        this.lowLimit = lowLimit;
        return this;
    }

    public void setLowLimit(Integer lowLimit) {
        this.lowLimit = lowLimit;
    }

    public Integer getMediumLimit() {
        return mediumLimit;
    }

    public CriticalLevel mediumLimit(Integer mediumLimit) {
        this.mediumLimit = mediumLimit;
        return this;
    }

    public void setMediumLimit(Integer mediumLimit) {
        this.mediumLimit = mediumLimit;
    }

    public Integer getHighLimit() {
        return highLimit;
    }

    public CriticalLevel highLimit(Integer highLimit) {
        this.highLimit = highLimit;
        return this;
    }

    public void setHighLimit(Integer highLimit) {
        this.highLimit = highLimit;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public CriticalLevel selfAssessment(SelfAssessment selfAssessment) {
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
        CriticalLevel criticalLevel = (CriticalLevel) o;
        if (criticalLevel.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), criticalLevel.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CriticalLevel{" +
            "id=" + getId() +
            ", side=" + getSide() +
            ", lowLimit=" + getLowLimit() +
            ", mediumLimit=" + getMediumLimit() +
            ", highLimit=" + getHighLimit() +
            "}";
    }
}
