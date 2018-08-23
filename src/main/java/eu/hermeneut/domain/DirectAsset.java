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
 * A DirectAsset.
 */
@Entity
@Table(name = "direct_asset")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "directasset")
public class DirectAsset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private MyAsset myAsset;

    @OneToMany(mappedBy = "directAsset")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<AttackCost> costs = new HashSet<>();

    @OneToMany(mappedBy = "directAsset")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<IndirectAsset> effects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MyAsset getMyAsset() {
        return myAsset;
    }

    public DirectAsset myAsset(MyAsset myAsset) {
        this.myAsset = myAsset;
        return this;
    }

    public void setMyAsset(MyAsset myAsset) {
        this.myAsset = myAsset;
    }

    public Set<AttackCost> getCosts() {
        return costs;
    }

    public DirectAsset costs(Set<AttackCost> attackCosts) {
        this.costs = attackCosts;
        return this;
    }

    public DirectAsset addCosts(AttackCost attackCost) {
        this.costs.add(attackCost);
        attackCost.setDirectAsset(this);
        return this;
    }

    public DirectAsset removeCosts(AttackCost attackCost) {
        this.costs.remove(attackCost);
        attackCost.setDirectAsset(null);
        return this;
    }

    public void setCosts(Set<AttackCost> attackCosts) {
        this.costs = attackCosts;
    }

    public Set<IndirectAsset> getEffects() {
        return effects;
    }

    public DirectAsset effects(Set<IndirectAsset> indirectAssets) {
        this.effects = indirectAssets;
        return this;
    }

    public DirectAsset addEffects(IndirectAsset indirectAsset) {
        this.effects.add(indirectAsset);
        indirectAsset.setDirectAsset(this);
        return this;
    }

    public DirectAsset removeEffects(IndirectAsset indirectAsset) {
        this.effects.remove(indirectAsset);
        indirectAsset.setDirectAsset(null);
        return this;
    }

    public void setEffects(Set<IndirectAsset> indirectAssets) {
        this.effects = indirectAssets;
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
        DirectAsset directAsset = (DirectAsset) o;
        if (directAsset.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), directAsset.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DirectAsset{" +
            "id=" + getId() +
            "}";
    }
}
