package eu.hermeneut.domain;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A EBIT.
 */
@Entity
@Table(name = "ebit")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "ebit")
public class EBIT implements Serializable {

    private static final long serialVersionUID = 1L;

    public EBIT() {
    }

    public EBIT(Integer year, Double value, ZonedDateTime created, SelfAssessment selfAssessment) {
        this.year = year;
        this.value = value;
        this.created = created;
        this.selfAssessment = selfAssessment;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * 2 (6 times)
     */
    @ApiModelProperty(value = "2 (6 times)")
    @Column(name = "jhi_year")
    private Integer year;

    @Column(name = "jhi_value")
    private Double value;

    @Column(name = "created")
    private ZonedDateTime created;

    @NotNull
    @OneToOne
    private SelfAssessment selfAssessment;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getYear() {
        return year;
    }

    public EBIT year(Integer year) {
        this.year = year;
        return this;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Double getValue() {
        return value;
    }

    public EBIT value(Double value) {
        this.value = value;
        return this;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public EBIT created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public EBIT selfAssessment(SelfAssessment selfAssessment) {
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
        EBIT eBIT = (EBIT) o;
        if (eBIT.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), eBIT.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EBIT{" +
            "id=" + getId() +
            ", year=" + getYear() +
            ", value=" + getValue() +
            ", created='" + getCreated() + "'" +
            "}";
    }
}
