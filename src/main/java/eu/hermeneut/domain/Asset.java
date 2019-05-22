/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Asset.
 */
@Entity
@Table(name = "asset")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Asset implements Serializable {

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

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "modified")
    private ZonedDateTime modified;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "asset_container",
        joinColumns = @JoinColumn(name = "assets_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "containers_id", referencedColumnName = "id"))
    private Set<Container> containers = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "asset_domains_of_influence",
        joinColumns = @JoinColumn(name = "assets_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "domains_of_influences_id", referencedColumnName = "id"))
    private Set<DomainOfInfluence> domainsOfInfluences = new HashSet<>();

    @ManyToOne
    private AssetCategory assetcategory;

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

    public Asset name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Asset description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public Asset created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public Asset modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public Set<Container> getContainers() {
        return containers;
    }

    public Asset containers(Set<Container> containers) {
        this.containers = containers;
        return this;
    }

    public Asset addContainer(Container container) {
        this.containers.add(container);
        return this;
    }

    public Asset removeContainer(Container container) {
        this.containers.remove(container);
        return this;
    }

    public void setContainers(Set<Container> containers) {
        this.containers = containers;
    }

    public Set<DomainOfInfluence> getDomainsOfInfluences() {
        return domainsOfInfluences;
    }

    public Asset domainsOfInfluences(Set<DomainOfInfluence> domainOfInfluences) {
        this.domainsOfInfluences = domainOfInfluences;
        return this;
    }

    public Asset addDomainsOfInfluence(DomainOfInfluence domainOfInfluence) {
        this.domainsOfInfluences.add(domainOfInfluence);
        return this;
    }

    public Asset removeDomainsOfInfluence(DomainOfInfluence domainOfInfluence) {
        this.domainsOfInfluences.remove(domainOfInfluence);
        return this;
    }

    public void setDomainsOfInfluences(Set<DomainOfInfluence> domainOfInfluences) {
        this.domainsOfInfluences = domainOfInfluences;
    }

    public AssetCategory getAssetcategory() {
        return assetcategory;
    }

    public Asset assetcategory(AssetCategory assetCategory) {
        this.assetcategory = assetCategory;
        return this;
    }

    public void setAssetcategory(AssetCategory assetCategory) {
        this.assetcategory = assetCategory;
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
        Asset asset = (Asset) o;
        if (asset.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), asset.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Asset{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}
