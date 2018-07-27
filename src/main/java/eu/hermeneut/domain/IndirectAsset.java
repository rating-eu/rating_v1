package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A IndirectAsset.
 */
@Entity
@Table(name = "indirect_asset")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "indirectasset")
public class IndirectAsset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    private DirectAsset directAsset;

    @OneToOne
    @JoinColumn(unique = true)
    private MyAsset asset;

    @OneToMany(mappedBy = "indirectAsset")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<AttackCost> costs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DirectAsset getDirectAsset() {
        return directAsset;
    }

    public IndirectAsset directAsset(DirectAsset directAsset) {
        this.directAsset = directAsset;
        return this;
    }

    public void setDirectAsset(DirectAsset directAsset) {
        this.directAsset = directAsset;
    }

    public MyAsset getAsset() {
        return asset;
    }

    public IndirectAsset asset(MyAsset myAsset) {
        this.asset = myAsset;
        return this;
    }

    public void setAsset(MyAsset myAsset) {
        this.asset = myAsset;
    }

    public Set<AttackCost> getCosts() {
        return costs;
    }

    public IndirectAsset costs(Set<AttackCost> attackCosts) {
        this.costs = attackCosts;
        return this;
    }

    public IndirectAsset addCosts(AttackCost attackCost) {
        this.costs.add(attackCost);
        attackCost.setIndirectAsset(this);
        return this;
    }

    public IndirectAsset removeCosts(AttackCost attackCost) {
        this.costs.remove(attackCost);
        attackCost.setIndirectAsset(null);
        return this;
    }

    public void setCosts(Set<AttackCost> attackCosts) {
        this.costs = attackCosts;
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
        IndirectAsset indirectAsset = (IndirectAsset) o;
        if (indirectAsset.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), indirectAsset.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "IndirectAsset{" +
            "id=" + getId() +
            "}";
    }
}
