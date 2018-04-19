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

import eu.hermeneut.domain.enumeration.AnswerType;

/**
 * A Answer.
 */
@Entity
@Table(name = "answer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "answer")
public class Answer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type", nullable = false)
    private AnswerType type;

    @Column(name = "name")
    private String name;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "modified")
    private ZonedDateTime modified;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "answer_threat_agents",
        joinColumns = @JoinColumn(name = "answers_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "threat_agents_id", referencedColumnName = "id"))
    private Set<ThreatAgent> threatAgents = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "answer_attacks",
        joinColumns = @JoinColumn(name = "answers_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "attacks_id", referencedColumnName = "id"))
    private Set<AttackStrategy> attacks = new HashSet<>();

    @ManyToOne
    @JsonIgnore
    private Question question;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AnswerType getType() {
        return type;
    }

    public Answer type(AnswerType type) {
        this.type = type;
        return this;
    }

    public void setType(AnswerType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public Answer name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public Answer created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public Answer modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public Set<ThreatAgent> getThreatAgents() {
        return threatAgents;
    }

    public Answer threatAgents(Set<ThreatAgent> threatAgents) {
        this.threatAgents = threatAgents;
        return this;
    }

    public Answer addThreatAgents(ThreatAgent threatAgent) {
        this.threatAgents.add(threatAgent);
        threatAgent.getAnswthreats().add(this);
        return this;
    }

    public Answer removeThreatAgents(ThreatAgent threatAgent) {
        this.threatAgents.remove(threatAgent);
        threatAgent.getAnswthreats().remove(this);
        return this;
    }

    public void setThreatAgents(Set<ThreatAgent> threatAgents) {
        this.threatAgents = threatAgents;
    }

    public Set<AttackStrategy> getAttacks() {
        return attacks;
    }

    public Answer attacks(Set<AttackStrategy> attackStrategies) {
        this.attacks = attackStrategies;
        return this;
    }

    public Answer addAttacks(AttackStrategy attackStrategy) {
        this.attacks.add(attackStrategy);
        attackStrategy.getAnswstrategies().add(this);
        return this;
    }

    public Answer removeAttacks(AttackStrategy attackStrategy) {
        this.attacks.remove(attackStrategy);
        attackStrategy.getAnswstrategies().remove(this);
        return this;
    }

    public void setAttacks(Set<AttackStrategy> attackStrategies) {
        this.attacks = attackStrategies;
    }

    public Question getQuestion() {
        return question;
    }

    public Answer question(Question question) {
        this.question = question;
        return this;
    }

    public void setQuestion(Question question) {
        this.question = question;
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
        Answer answer = (Answer) o;
        if (answer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), answer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Answer{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", name='" + getName() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}
