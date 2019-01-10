package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.SectorType;

import eu.hermeneut.domain.enumeration.CategoryType;

/**
 * A SplittingValue.
 */
@Entity
@Table(name = "splitting_value")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "splittingvalue")
public class SplittingValue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "sector_type")
    private SectorType sectorType;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_type")
    private CategoryType categoryType;

    @Column(name = "jhi_value", precision=10, scale=2)
    private BigDecimal value;

    @ManyToOne
    private SelfAssessment selfAssessment;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SectorType getSectorType() {
        return sectorType;
    }

    public SplittingValue sectorType(SectorType sectorType) {
        this.sectorType = sectorType;
        return this;
    }

    public void setSectorType(SectorType sectorType) {
        this.sectorType = sectorType;
    }

    public CategoryType getCategoryType() {
        return categoryType;
    }

    public SplittingValue categoryType(CategoryType categoryType) {
        this.categoryType = categoryType;
        return this;
    }

    public void setCategoryType(CategoryType categoryType) {
        this.categoryType = categoryType;
    }

    public BigDecimal getValue() {
        return value;
    }

    public SplittingValue value(BigDecimal value) {
        this.value = value;
        return this;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public SplittingValue selfAssessment(SelfAssessment selfAssessment) {
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
        SplittingValue splittingValue = (SplittingValue) o;
        if (splittingValue.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), splittingValue.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SplittingValue{" +
            "id=" + getId() +
            ", sectorType='" + getSectorType() + "'" +
            ", categoryType='" + getCategoryType() + "'" +
            ", value=" + getValue() +
            "}";
    }
}
