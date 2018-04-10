package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DomainOfInfluence.
 */
@Entity
@Table(name = "domain_of_influence")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "domainofinfluence")
public class DomainOfInfluence implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @ManyToMany(mappedBy = "domains")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Asset> domains = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public DomainOfInfluence name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public DomainOfInfluence description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Asset> getDomains() {
        return domains;
    }

    public DomainOfInfluence domains(Set<Asset> assets) {
        this.domains = assets;
        return this;
    }

    public DomainOfInfluence addDomain(Asset asset) {
        this.domains.add(asset);
        asset.getDomains().add(this);
        return this;
    }

    public DomainOfInfluence removeDomain(Asset asset) {
        this.domains.remove(asset);
        asset.getDomains().remove(this);
        return this;
    }

    public void setDomains(Set<Asset> assets) {
        this.domains = assets;
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
        DomainOfInfluence domainOfInfluence = (DomainOfInfluence) o;
        if (domainOfInfluence.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), domainOfInfluence.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DomainOfInfluence{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
