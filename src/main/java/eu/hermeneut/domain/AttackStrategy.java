package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.hermeneut.domain.enumeration.AttackStrategyLikelihood;
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

import eu.hermeneut.domain.enumeration.Frequency;

import eu.hermeneut.domain.enumeration.SkillLevel;

import eu.hermeneut.domain.enumeration.ResourceLevel;

/**
 * A AttackStrategy.
 */
@Entity
@Table(name = "attack_strategy")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "attackstrategy")
public class AttackStrategy implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    protected Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    protected String name;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    protected String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", nullable = false)
    protected Frequency frequency;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "skill", nullable = false)
    protected SkillLevel skill;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "resources", nullable = false)
    protected ResourceLevel resources;

    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood")
    protected AttackStrategyLikelihood likelihood;

    @Column(name = "created")
    protected ZonedDateTime created;

    @Column(name = "modified")
    protected ZonedDateTime modified;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "attack_strategy_mitigation",
        joinColumns = @JoinColumn(name = "attack_strategies_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "mitigations_id", referencedColumnName = "id"))
    protected Set<Mitigation> mitigations = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "attack_strategy_level",
        joinColumns = @JoinColumn(name = "attack_strategies_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "levels_id", referencedColumnName = "id"))
    protected Set<Level> levels = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "attack_strategy_phase",
        joinColumns = @JoinColumn(name = "attack_strategies_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "phases_id", referencedColumnName = "id"))
    protected Set<Phase> phases = new HashSet<>();

    @ManyToMany(mappedBy = "attackStrategies")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    protected Set<Question> questions = new HashSet<>();

    @ManyToMany(mappedBy = "attackstrategies")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    protected Set<SelfAssessment> selfassessments = new HashSet<>();

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

    public AttackStrategy name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public AttackStrategy description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public AttackStrategy frequency(Frequency frequency) {
        this.frequency = frequency;
        return this;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public SkillLevel getSkill() {
        return skill;
    }

    public AttackStrategy skill(SkillLevel skill) {
        this.skill = skill;
        return this;
    }

    public void setSkill(SkillLevel skill) {
        this.skill = skill;
    }

    public ResourceLevel getResources() {
        return resources;
    }

    public AttackStrategy resources(ResourceLevel resources) {
        this.resources = resources;
        return this;
    }

    public void setResources(ResourceLevel resources) {
        this.resources = resources;
    }

    public AttackStrategyLikelihood getLikelihood() {
        return likelihood;
    }

    public AttackStrategy likelihood(AttackStrategyLikelihood attackStrategyLikelihood) {
        this.likelihood = attackStrategyLikelihood;
        return this;
    }

    public void setLikelihood(AttackStrategyLikelihood attackStrategyLikelihood) {
        this.likelihood = attackStrategyLikelihood;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public AttackStrategy created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public AttackStrategy modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public Set<Mitigation> getMitigations() {
        return mitigations;
    }

    public AttackStrategy mitigations(Set<Mitigation> mitigations) {
        this.mitigations = mitigations;
        return this;
    }

    public AttackStrategy addMitigation(Mitigation mitigation) {
        this.mitigations.add(mitigation);
        mitigation.getCountermeasures().add(this);
        return this;
    }

    public AttackStrategy removeMitigation(Mitigation mitigation) {
        this.mitigations.remove(mitigation);
        mitigation.getCountermeasures().remove(this);
        return this;
    }

    public void setMitigations(Set<Mitigation> mitigations) {
        this.mitigations = mitigations;
    }

    public Set<Level> getLevels() {
        return levels;
    }

    public AttackStrategy levels(Set<Level> levels) {
        this.levels = levels;
        return this;
    }

    public AttackStrategy addLevel(Level level) {
        this.levels.add(level);
        return this;
    }

    public AttackStrategy removeLevel(Level level) {
        this.levels.remove(level);
        return this;
    }

    public void setLevels(Set<Level> levels) {
        this.levels = levels;
    }

    public Set<Phase> getPhases() {
        return phases;
    }

    public AttackStrategy phases(Set<Phase> phases) {
        this.phases = phases;
        return this;
    }

    public AttackStrategy addPhase(Phase phase) {
        this.phases.add(phase);
        return this;
    }

    public AttackStrategy removePhase(Phase phase) {
        this.phases.remove(phase);
        return this;
    }

    public void setPhases(Set<Phase> phases) {
        this.phases = phases;
    }

    public Set<Question> getQuestions() {
        return questions;
    }

    public AttackStrategy questions(Set<Question> questions) {
        this.questions = questions;
        return this;
    }

    public AttackStrategy addQuestion(Question question) {
        this.questions.add(question);
        question.getAttackStrategies().add(this);
        return this;
    }

    public AttackStrategy removeQuestion(Question question) {
        this.questions.remove(question);
        question.getAttackStrategies().remove(this);
        return this;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }

    public Set<SelfAssessment> getSelfassessments() {
        return selfassessments;
    }

    public AttackStrategy selfassessments(Set<SelfAssessment> selfAssessments) {
        this.selfassessments = selfAssessments;
        return this;
    }

    public AttackStrategy addSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.add(selfAssessment);
        selfAssessment.getAttackstrategies().add(this);
        return this;
    }

    public AttackStrategy removeSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.remove(selfAssessment);
        selfAssessment.getAttackstrategies().remove(this);
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
        AttackStrategy attackStrategy = (AttackStrategy) o;
        if (attackStrategy.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), attackStrategy.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AttackStrategy{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", frequency='" + getFrequency() + "'" +
            ", skill='" + getSkill() + "'" +
            ", resources='" + getResources() + "'" +
            ", likelihood='" + getLikelihood() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}
