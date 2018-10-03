package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A ImpactLevelDescription.
 */
@Entity
@Table(name = "impact_level_description")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "impactleveldescription")
public class ImpactLevelDescription implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "impact", nullable = false)
    private Integer impact;

    @NotNull
    @Column(name = "people_effects", nullable = false)
    private String peopleEffects;

    @NotNull
    @Column(name = "reputation", nullable = false)
    private String reputation;

    @NotNull
    @Column(name = "service_outputs", nullable = false)
    private String serviceOutputs;

    @NotNull
    @Column(name = "legal_and_compliance", nullable = false)
    private String legalAndCompliance;

    @NotNull
    @Column(name = "management_impact", nullable = false)
    private String managementImpact;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getImpact() {
        return impact;
    }

    public ImpactLevelDescription impact(Integer impact) {
        this.impact = impact;
        return this;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
    }

    public String getPeopleEffects() {
        return peopleEffects;
    }

    public ImpactLevelDescription peopleEffects(String peopleEffects) {
        this.peopleEffects = peopleEffects;
        return this;
    }

    public void setPeopleEffects(String peopleEffects) {
        this.peopleEffects = peopleEffects;
    }

    public String getReputation() {
        return reputation;
    }

    public ImpactLevelDescription reputation(String reputation) {
        this.reputation = reputation;
        return this;
    }

    public void setReputation(String reputation) {
        this.reputation = reputation;
    }

    public String getServiceOutputs() {
        return serviceOutputs;
    }

    public ImpactLevelDescription serviceOutputs(String serviceOutputs) {
        this.serviceOutputs = serviceOutputs;
        return this;
    }

    public void setServiceOutputs(String serviceOutputs) {
        this.serviceOutputs = serviceOutputs;
    }

    public String getLegalAndCompliance() {
        return legalAndCompliance;
    }

    public ImpactLevelDescription legalAndCompliance(String legalAndCompliance) {
        this.legalAndCompliance = legalAndCompliance;
        return this;
    }

    public void setLegalAndCompliance(String legalAndCompliance) {
        this.legalAndCompliance = legalAndCompliance;
    }

    public String getManagementImpact() {
        return managementImpact;
    }

    public ImpactLevelDescription managementImpact(String managementImpact) {
        this.managementImpact = managementImpact;
        return this;
    }

    public void setManagementImpact(String managementImpact) {
        this.managementImpact = managementImpact;
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
        ImpactLevelDescription impactLevelDescription = (ImpactLevelDescription) o;
        if (impactLevelDescription.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), impactLevelDescription.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ImpactLevelDescription{" +
            "id=" + getId() +
            ", impact=" + getImpact() +
            ", peopleEffects='" + getPeopleEffects() + "'" +
            ", reputation='" + getReputation() + "'" +
            ", serviceOutputs='" + getServiceOutputs() + "'" +
            ", legalAndCompliance='" + getLegalAndCompliance() + "'" +
            ", managementImpact='" + getManagementImpact() + "'" +
            "}";
    }
}
