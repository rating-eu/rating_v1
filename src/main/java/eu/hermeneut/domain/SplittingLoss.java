package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.SectorType;

import eu.hermeneut.domain.enumeration.CategoryType;

/**
 * A SplittingLoss.
 */
@Entity
@Table(name = "splitting_loss")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "splittingloss")
public class SplittingLoss implements Serializable {

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

    @Column(name = "loss_percentage", precision = 10, scale = 2)
    private BigDecimal lossPercentage;

    @Column(name = "loss", precision = 50, scale = 2)
    private BigDecimal loss;

    @OneToOne
    @NotNull
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

    public SplittingLoss sectorType(SectorType sectorType) {
        this.sectorType = sectorType;
        return this;
    }

    public void setSectorType(SectorType sectorType) {
        this.sectorType = sectorType;
    }

    public CategoryType getCategoryType() {
        return categoryType;
    }

    public SplittingLoss categoryType(CategoryType categoryType) {
        this.categoryType = categoryType;
        return this;
    }

    public void setCategoryType(CategoryType categoryType) {
        this.categoryType = categoryType;
    }

    public BigDecimal getLossPercentage() {
        return lossPercentage;
    }

    public SplittingLoss lossPercentage(BigDecimal lossPercentage) {
        this.lossPercentage = lossPercentage;
        return this;
    }

    public void setLossPercentage(BigDecimal lossPercentage) {
        this.lossPercentage = lossPercentage;
    }

    public BigDecimal getLoss() {
        return loss;
    }

    public SplittingLoss loss(BigDecimal loss) {
        this.loss = loss;
        return this;
    }

    public void setLoss(BigDecimal loss) {
        this.loss = loss;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public SplittingLoss selfAssessment(SelfAssessment selfAssessment) {
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
        SplittingLoss splittingLoss = (SplittingLoss) o;
        if (splittingLoss.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), splittingLoss.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SplittingLoss{" +
            "id=" + getId() +
            ", sectorType='" + getSectorType() + "'" +
            ", categoryType='" + getCategoryType() + "'" +
            ", lossPercentage=" + getLossPercentage() +
            ", loss=" + getLoss() +
            "}";
    }
}
