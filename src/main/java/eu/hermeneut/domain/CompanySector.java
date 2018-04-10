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

/**
 * A CompanySector.
 */
@Entity
@Table(name = "company_sector")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "companysector")
public class CompanySector implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "department", nullable = false)
    private String department;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "modified")
    private ZonedDateTime modified;

    @ManyToOne
    private User user;

    @ManyToOne
    private CompanyProfile companyprofile;

    @ManyToMany(mappedBy = "companysectors")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<SelfAssessment> selfassessments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartment() {
        return department;
    }

    public CompanySector department(String department) {
        this.department = department;
        return this;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public CompanySector description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public CompanySector created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public CompanySector modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public User getUser() {
        return user;
    }

    public CompanySector user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CompanyProfile getCompanyprofile() {
        return companyprofile;
    }

    public CompanySector companyprofile(CompanyProfile companyProfile) {
        this.companyprofile = companyProfile;
        return this;
    }

    public void setCompanyprofile(CompanyProfile companyProfile) {
        this.companyprofile = companyProfile;
    }

    public Set<SelfAssessment> getSelfassessments() {
        return selfassessments;
    }

    public CompanySector selfassessments(Set<SelfAssessment> selfAssessments) {
        this.selfassessments = selfAssessments;
        return this;
    }

    public CompanySector addSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.add(selfAssessment);
        selfAssessment.getCompanysectors().add(this);
        return this;
    }

    public CompanySector removeSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.remove(selfAssessment);
        selfAssessment.getCompanysectors().remove(this);
        return this;
    }

    public void setSelfassessments(Set<SelfAssessment> selfAssessments) {
        this.selfassessments = selfAssessments;
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
        CompanySector companySector = (CompanySector) o;
        if (companySector.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), companySector.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CompanySector{" +
            "id=" + getId() +
            ", department='" + getDepartment() + "'" +
            ", description='" + getDescription() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}
