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

import eu.hermeneut.domain.enumeration.CompType;

/**
 * A CompanyProfile.
 */
@Entity
@Table(name = "company_profile")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "companyprofile")
public class CompanyProfile implements Serializable {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type")
    private CompType type;

    @OneToMany(mappedBy = "companyprofile")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<CompanyGroup> companyGroups = new HashSet<>();

    @ManyToOne
    private User user;

    @ManyToMany(fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "company_profile_containers",
               joinColumns = @JoinColumn(name="company_profiles_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="containers_id", referencedColumnName="id"))
    private Set<Container> containers = new HashSet<>();

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

    public CompanyProfile name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public CompanyProfile description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public CompanyProfile created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public CompanyProfile modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public CompType getType() {
        return type;
    }

    public CompanyProfile type(CompType type) {
        this.type = type;
        return this;
    }

    public void setType(CompType type) {
        this.type = type;
    }

    public Set<CompanyGroup> getCompanyGroups() {
        return companyGroups;
    }

    public CompanyProfile companyGroups(Set<CompanyGroup> companyGroups) {
        this.companyGroups = companyGroups;
        return this;
    }

    public CompanyProfile addCompanyGroups(CompanyGroup companyGroup) {
        this.companyGroups.add(companyGroup);
        companyGroup.setCompanyprofile(this);
        return this;
    }

    public CompanyProfile removeCompanyGroups(CompanyGroup companyGroup) {
        this.companyGroups.remove(companyGroup);
        companyGroup.setCompanyprofile(null);
        return this;
    }

    public void setCompanyGroups(Set<CompanyGroup> companyGroups) {
        this.companyGroups = companyGroups;
    }

    public User getUser() {
        return user;
    }

    public CompanyProfile user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Container> getContainers() {
        return containers;
    }

    public CompanyProfile containers(Set<Container> containers) {
        this.containers = containers;
        return this;
    }

    public CompanyProfile addContainers(Container container) {
        this.containers.add(container);
        return this;
    }

    public CompanyProfile removeContainers(Container container) {
        this.containers.remove(container);
        return this;
    }

    public void setContainers(Set<Container> containers) {
        this.containers = containers;
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
        CompanyProfile companyProfile = (CompanyProfile) o;
        if (companyProfile.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), companyProfile.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CompanyProfile{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
