package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.ContainerType;

/**
 * A Container.
 */
@Entity
@Table(name = "container")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "container")
public class Container implements Serializable {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "container_type")
    private ContainerType containerType;

    @Column(name = "created")
    private ZonedDateTime created;

    @ManyToMany(mappedBy = "containers")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<CompanyProfile> companies = new HashSet<>();

    @ManyToMany(mappedBy = "containers")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Asset> assets = new HashSet<>();

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

    public Container name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Container description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ContainerType getContainerType() {
        return containerType;
    }

    public Container containerType(ContainerType containerType) {
        this.containerType = containerType;
        return this;
    }

    public void setContainerType(ContainerType containerType) {
        this.containerType = containerType;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public Container created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public Set<CompanyProfile> getCompanies() {
        return companies;
    }

    public Container companies(Set<CompanyProfile> companyProfiles) {
        this.companies = companyProfiles;
        return this;
    }

    public Container addCompany(CompanyProfile companyProfile) {
        this.companies.add(companyProfile);
        companyProfile.getContainers().add(this);
        return this;
    }

    public Container removeCompany(CompanyProfile companyProfile) {
        this.companies.remove(companyProfile);
        companyProfile.getContainers().remove(this);
        return this;
    }

    public void setCompanies(Set<CompanyProfile> companyProfiles) {
        this.companies = companyProfiles;
    }

    public Set<Asset> getAssets() {
        return assets;
    }

    public Container assets(Set<Asset> assets) {
        this.assets = assets;
        return this;
    }

    public Container addAsset(Asset asset) {
        this.assets.add(asset);
        asset.getContainers().add(this);
        return this;
    }

    public Container removeAsset(Asset asset) {
        this.assets.remove(asset);
        asset.getContainers().remove(this);
        return this;
    }

    public void setAssets(Set<Asset> assets) {
        this.assets = assets;
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
        Container container = (Container) o;
        if (container.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), container.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Container{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", containerType='" + getContainerType() + "'" +
            ", created='" + getCreated() + "'" +
            "}";
    }
}
