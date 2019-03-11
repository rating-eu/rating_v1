package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.CostType;

/**
 * A AttackCost.
 */
@Entity
@Table(name = "attack_cost")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "attackcost")
public class AttackCost implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type", nullable = false)
    private CostType type;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "costs", precision=20, scale=2)
    private BigDecimal costs = BigDecimal.ZERO;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private MyAsset myAsset;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CostType getType() {
        return type;
    }

    public AttackCost type(CostType type) {
        this.type = type;
        return this;
    }

    public void setType(CostType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public AttackCost description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getCosts() {
        return costs;
    }

    public AttackCost costs(BigDecimal costs) {
        this.costs = costs;
        return this;
    }

    public void setCosts(BigDecimal costs) {
        this.costs = costs;
    }

    @JsonIgnore
    public MyAsset getMyAsset() {
        return myAsset;
    }

    public AttackCost myAsset(MyAsset myAsset) {
        this.myAsset = myAsset;
        return this;
    }

    public void setMyAsset(MyAsset myAsset) {
        this.myAsset = myAsset;
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
        AttackCost attackCost = (AttackCost) o;
        if (attackCost.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), attackCost.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AttackCost{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", description='" + getDescription() + "'" +
            ", costs=" + getCosts() +
            "}";
    }
}
