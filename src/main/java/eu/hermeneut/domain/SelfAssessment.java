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

import eu.hermeneut.domain.enumeration.ImpactMode;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A SelfAssessment.
 */
@Entity
@Table(name = "self_assessment")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "selfassessment")
public class SelfAssessment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @CreationTimestamp
    @Column(name = "created")
    private ZonedDateTime created;

    @UpdateTimestamp
    @Column(name = "modified")
    private ZonedDateTime modified;

    @ManyToOne
    private CompanyProfile companyProfile;

    @ManyToOne
    private User user;

    @ManyToMany(fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "self_assessment_company_group",
        joinColumns = @JoinColumn(name = "self_assessments_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "company_groups_id", referencedColumnName = "id"))
    private Set<CompanyGroup> companyGroups = new HashSet<>();

    @ManyToOne
    private ExternalAudit externalAudit;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "impact_mode", nullable = false)
    private ImpactMode impactMode = ImpactMode.QUANTITATIVE;

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

    public SelfAssessment name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public SelfAssessment created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public SelfAssessment modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public CompanyProfile getCompanyProfile() {
        return companyProfile;
    }

    public SelfAssessment companyProfile(CompanyProfile companyProfile) {
        this.companyProfile = companyProfile;
        return this;
    }

    public void setCompanyProfile(CompanyProfile companyProfile) {
        this.companyProfile = companyProfile;
    }

    public User getUser() {
        return user;
    }

    public SelfAssessment user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ExternalAudit getExternalAudit() {
        return externalAudit;
    }

    public SelfAssessment externalAudit(ExternalAudit externalAudit) {
        this.externalAudit = externalAudit;
        return this;
    }

    public void setExternalAudit(ExternalAudit externalAudit) {
        this.externalAudit = externalAudit;
    }

    public Set<CompanyGroup> getCompanyGroups() {
        return companyGroups;
    }

    public SelfAssessment companyGroups(Set<CompanyGroup> companyGroups) {
        this.companyGroups = companyGroups;
        return this;
    }

    public SelfAssessment addCompanyGroup(CompanyGroup companyGroup) {
        this.companyGroups.add(companyGroup);
        return this;
    }

    public SelfAssessment removeCompanyGroup(CompanyGroup companyGroup) {
        this.companyGroups.remove(companyGroup);
        return this;
    }

    public void setCompanyGroups(Set<CompanyGroup> companyGroups) {
        this.companyGroups = companyGroups;
    }

    public ImpactMode getImpactMode() {
        return impactMode;
    }

    public void setImpactMode(ImpactMode impactMode) {
        this.impactMode = impactMode;
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
        SelfAssessment selfAssessment = (SelfAssessment) o;
        if (selfAssessment.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), selfAssessment.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SelfAssessment{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}
