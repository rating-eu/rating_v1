package eu.hermeneut.domain;

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

    @ManyToMany(fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "self_assessment_threatagent",
        joinColumns = @JoinColumn(name = "self_assessments_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "threatagents_id", referencedColumnName = "id"))
    private Set<ThreatAgent> threatagents = new HashSet<>();

    @ManyToOne
    private ExternalAudit externalAudit;

    @ManyToMany(fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "self_assessment_questionnaire",
        joinColumns = @JoinColumn(name = "self_assessments_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "questionnaires_id", referencedColumnName = "id"))
    private Set<Questionnaire> questionnaires = new HashSet<>();

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

    public Set<ThreatAgent> getThreatagents() {
        return threatagents;
    }

    public SelfAssessment threatagents(Set<ThreatAgent> threatAgents) {
        this.threatagents = threatAgents;
        return this;
    }

    public SelfAssessment addThreatagent(ThreatAgent threatAgent) {
        this.threatagents.add(threatAgent);
        return this;
    }

    public SelfAssessment removeThreatagent(ThreatAgent threatAgent) {
        this.threatagents.remove(threatAgent);
        return this;
    }

    public void setThreatagents(Set<ThreatAgent> threatAgents) {
        this.threatagents = threatAgents;
    }

    public Set<Questionnaire> getQuestionnaires() {
        return questionnaires;
    }

    public SelfAssessment questionnaires(Set<Questionnaire> questionnaires) {
        this.questionnaires = questionnaires;
        return this;
    }

    public SelfAssessment addQuestionnaire(Questionnaire questionnaire) {
        this.questionnaires.add(questionnaire);
        return this;
    }

    public SelfAssessment removeQuestionnaire(Questionnaire questionnaire) {
        this.questionnaires.remove(questionnaire);
        return this;
    }

    public void setQuestionnaires(Set<Questionnaire> questionnaires) {
        this.questionnaires = questionnaires;
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
