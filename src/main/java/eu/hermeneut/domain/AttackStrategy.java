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

import eu.hermeneut.domain.enumeration.AS_Frequency;

import eu.hermeneut.domain.enumeration.SkillLevel;

import eu.hermeneut.domain.enumeration.ResourceLevel;

import eu.hermeneut.domain.enumeration.Likelihood;

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
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "freq", nullable = false)
    private AS_Frequency freq;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "skill", nullable = false)
    private SkillLevel skill;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "resources", nullable = false)
    private ResourceLevel resources;

    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood")
    private Likelihood likelihood;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "modified")
    private ZonedDateTime modified;

    @OneToMany(mappedBy = "attackStrategy")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<LevelWrapper> levels = new HashSet<>();

    @OneToMany(mappedBy = "attackStrategy")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<PhaseWrapper> phases = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "attack_strategy_mitigation",
               joinColumns = @JoinColumn(name="attack_strategies_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="mitigations_id", referencedColumnName="id"))
    private Set<Mitigation> mitigations = new HashSet<>();

    @ManyToMany(mappedBy = "attacks")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Answer> answstrategies = new HashSet<>();

    @ManyToMany(mappedBy = "attackstrategies")
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

    public AS_Frequency getFreq() {
        return freq;
    }

    public AttackStrategy freq(AS_Frequency freq) {
        this.freq = freq;
        return this;
    }

    public void setFreq(AS_Frequency freq) {
        this.freq = freq;
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

    public Likelihood getLikelihood() {
        return likelihood;
    }

    public AttackStrategy likelihood(Likelihood likelihood) {
        this.likelihood = likelihood;
        return this;
    }

    public void setLikelihood(Likelihood likelihood) {
        this.likelihood = likelihood;
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

    public Set<LevelWrapper> getLevels() {
        return levels;
    }

    public AttackStrategy levels(Set<LevelWrapper> levelWrappers) {
        this.levels = levelWrappers;
        return this;
    }

    public AttackStrategy addLevels(LevelWrapper levelWrapper) {
        this.levels.add(levelWrapper);
        levelWrapper.setAttackStrategy(this);
        return this;
    }

    public AttackStrategy removeLevels(LevelWrapper levelWrapper) {
        this.levels.remove(levelWrapper);
        levelWrapper.setAttackStrategy(null);
        return this;
    }

    public void setLevels(Set<LevelWrapper> levelWrappers) {
        this.levels = levelWrappers;
    }

    public Set<PhaseWrapper> getPhases() {
        return phases;
    }

    public AttackStrategy phases(Set<PhaseWrapper> phaseWrappers) {
        this.phases = phaseWrappers;
        return this;
    }

    public AttackStrategy addPhases(PhaseWrapper phaseWrapper) {
        this.phases.add(phaseWrapper);
        phaseWrapper.setAttackStrategy(this);
        return this;
    }

    public AttackStrategy removePhases(PhaseWrapper phaseWrapper) {
        this.phases.remove(phaseWrapper);
        phaseWrapper.setAttackStrategy(null);
        return this;
    }

    public void setPhases(Set<PhaseWrapper> phaseWrappers) {
        this.phases = phaseWrappers;
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

    public Set<Answer> getAnswstrategies() {
        return answstrategies;
    }

    public AttackStrategy answstrategies(Set<Answer> answers) {
        this.answstrategies = answers;
        return this;
    }

    public AttackStrategy addAnswstrategy(Answer answer) {
        this.answstrategies.add(answer);
        answer.getAttacks().add(this);
        return this;
    }

    public AttackStrategy removeAnswstrategy(Answer answer) {
        this.answstrategies.remove(answer);
        answer.getAttacks().remove(this);
        return this;
    }

    public void setAnswstrategies(Set<Answer> answers) {
        this.answstrategies = answers;
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
            ", freq='" + getFreq() + "'" +
            ", skill='" + getSkill() + "'" +
            ", resources='" + getResources() + "'" +
            ", likelihood='" + getLikelihood() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}
