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

import eu.hermeneut.domain.enumeration.SkillLevel;

import eu.hermeneut.domain.enumeration.Intent;

import eu.hermeneut.domain.enumeration.TA_Access;

/**
 * A ThreatAgent.
 */
@Entity
@Table(name = "threat_agent")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "threatagent")
public class ThreatAgent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "skill_level", nullable = false)
    private SkillLevel skillLevel;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "intent", nullable = false)
    private Intent intent;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_access", nullable = false)
    private TA_Access access;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "modified")
    private ZonedDateTime modified;

    @NotNull
    @Column(name = "identified_by_default", nullable = false)
    private Boolean identifiedByDefault;

    @OneToMany(mappedBy = "threatAgent")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Question> questions = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "threat_agent_motivation",
        joinColumns = @JoinColumn(name = "threat_agents_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "motivations_id", referencedColumnName = "id"))
    private Set<Motivation> motivations = new HashSet<>();

    @ManyToMany(mappedBy = "threatagents")
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

    public ThreatAgent name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public ThreatAgent description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImage() {
        return image;
    }

    public ThreatAgent image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public ThreatAgent imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public SkillLevel getSkillLevel() {
        return skillLevel;
    }

    public ThreatAgent skillLevel(SkillLevel skillLevel) {
        this.skillLevel = skillLevel;
        return this;
    }

    public void setSkillLevel(SkillLevel skillLevel) {
        this.skillLevel = skillLevel;
    }

    public Intent getIntent() {
        return intent;
    }

    public ThreatAgent intent(Intent intent) {
        this.intent = intent;
        return this;
    }

    public void setIntent(Intent intent) {
        this.intent = intent;
    }

    public TA_Access getAccess() {
        return access;
    }

    public ThreatAgent access(TA_Access access) {
        this.access = access;
        return this;
    }

    public void setAccess(TA_Access access) {
        this.access = access;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public ThreatAgent created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public ThreatAgent modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public Boolean isIdentifiedByDefault() {
        return identifiedByDefault;
    }

    public ThreatAgent identifiedByDefault(Boolean identifiedByDefault) {
        this.identifiedByDefault = identifiedByDefault;
        return this;
    }

    public void setIdentifiedByDefault(Boolean identifiedByDefault) {
        this.identifiedByDefault = identifiedByDefault;
    }

    public Boolean getIdentifiedByDefault() {
        return this.identifiedByDefault;
    }

    public Set<Question> getQuestions() {
        return questions;
    }

    public ThreatAgent questions(Set<Question> questions) {
        this.questions = questions;
        return this;
    }

    public ThreatAgent addQuestions(Question question) {
        this.questions.add(question);
        question.setThreatAgent(this);
        return this;
    }

    public ThreatAgent removeQuestions(Question question) {
        this.questions.remove(question);
        question.setThreatAgent(null);
        return this;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }

    public Set<Motivation> getMotivations() {
        return motivations;
    }

    public ThreatAgent motivations(Set<Motivation> motivations) {
        this.motivations = motivations;
        return this;
    }

    public ThreatAgent addMotivation(Motivation motivation) {
        this.motivations.add(motivation);
        motivation.getTagents().add(this);
        return this;
    }

    public ThreatAgent removeMotivation(Motivation motivation) {
        this.motivations.remove(motivation);
        motivation.getTagents().remove(this);
        return this;
    }

    public void setMotivations(Set<Motivation> motivations) {
        this.motivations = motivations;
    }

    public Set<SelfAssessment> getSelfassessments() {
        return selfassessments;
    }

    public ThreatAgent selfassessments(Set<SelfAssessment> selfAssessments) {
        this.selfassessments = selfAssessments;
        return this;
    }

    public ThreatAgent addSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.add(selfAssessment);
        selfAssessment.getThreatagents().add(this);
        return this;
    }

    public ThreatAgent removeSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.remove(selfAssessment);
        selfAssessment.getThreatagents().remove(this);
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
        ThreatAgent threatAgent = (ThreatAgent) o;
        if (threatAgent.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), threatAgent.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ThreatAgent{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", skillLevel='" + getSkillLevel() + "'" +
            ", intent='" + getIntent() + "'" +
            ", access='" + getAccess() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            ", identifiedByDefault='" + isIdentifiedByDefault() + "'" +
            "}";
    }
}
