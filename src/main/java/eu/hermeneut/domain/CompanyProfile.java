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
    private Set<Department> departments = new HashSet<>();

    @ManyToOne
    private User user;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "company_profile_container",
               joinColumns = @JoinColumn(name="company_profiles_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="containers_id", referencedColumnName="id"))
    private Set<Container> containers = new HashSet<>();

    @ManyToMany(mappedBy = "companyprofiles")
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

    public Set<Department> getDepartments() {
        return departments;
    }

    public CompanyProfile departments(Set<Department> departments) {
        this.departments = departments;
        return this;
    }

    public CompanyProfile addDepartments(Department department) {
        this.departments.add(department);
        department.setCompanyprofile(this);
        return this;
    }

    public CompanyProfile removeDepartments(Department department) {
        this.departments.remove(department);
        department.setCompanyprofile(null);
        return this;
    }

    public void setDepartments(Set<Department> departments) {
        this.departments = departments;
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

    public CompanyProfile addContainer(Container container) {
        this.containers.add(container);
        container.getCompanies().add(this);
        return this;
    }

    public CompanyProfile removeContainer(Container container) {
        this.containers.remove(container);
        container.getCompanies().remove(this);
        return this;
    }

    public void setContainers(Set<Container> containers) {
        this.containers = containers;
    }

    public Set<SelfAssessment> getSelfassessments() {
        return selfassessments;
    }

    public CompanyProfile selfassessments(Set<SelfAssessment> selfAssessments) {
        this.selfassessments = selfAssessments;
        return this;
    }

    public CompanyProfile addSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.add(selfAssessment);
        selfAssessment.getCompanyprofiles().add(this);
        return this;
    }

    public CompanyProfile removeSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.remove(selfAssessment);
        selfAssessment.getCompanyprofiles().remove(this);
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
