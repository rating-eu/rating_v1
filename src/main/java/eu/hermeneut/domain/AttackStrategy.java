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

import eu.hermeneut.domain.enumeration.*;
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
 * A AttackStrategy.
 */
@Entity
@Table(name = "attack_strategy")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)

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
               joinColumns = @JoinColumn(name="attack_strategies_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="mitigations_id", referencedColumnName="id"))
    protected Set<Mitigation> mitigations = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "attack_strategy_level",
               joinColumns = @JoinColumn(name="attack_strategies_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="levels_id", referencedColumnName="id"))
    protected Set<Level> levels = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "attack_strategy_phase",
               joinColumns = @JoinColumn(name="attack_strategies_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="phases_id", referencedColumnName="id"))
    protected Set<Phase> phases = new HashSet<>();

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

    public AttackStrategy likelihood(AttackStrategyLikelihood likelihood) {
        this.likelihood = likelihood;
        return this;
    }

    public void setLikelihood(AttackStrategyLikelihood likelihood) {
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

    public Set<Mitigation> getMitigations() {
        return mitigations;
    }

    public AttackStrategy mitigations(Set<Mitigation> mitigations) {
        this.mitigations = mitigations;
        return this;
    }

    public AttackStrategy addMitigation(Mitigation mitigation) {
        this.mitigations.add(mitigation);
        return this;
    }

    public AttackStrategy removeMitigation(Mitigation mitigation) {
        this.mitigations.remove(mitigation);
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
