package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.hermeneut.domain.enumeration.AnswerLikelihood;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

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

    @Column(name = "name")
    private String name;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "modified")
    private ZonedDateTime modified;

    @Column(name = "jhi_order")
    private Integer order;

    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood")
    private AnswerLikelihood likelihood;

    @OneToOne
    @JoinColumn(unique = true)
    private Asset asset;

    @ManyToMany(mappedBy = "answers")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Question> questions = new HashSet<>();

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

    public Integer getOrder() {
        return order;
    }

    public Answer order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public void setLikelihood(AnswerLikelihood attackStrategyLikelihood) {
        this.likelihood = attackStrategyLikelihood;
    }

    public AnswerLikelihood getLikelihood() {
        return likelihood;
    }

    public Answer likelihood(AnswerLikelihood attackStrategyLikelihood) {
        this.likelihood = attackStrategyLikelihood;
        return this;
    }

    public Asset getAsset() {
        return asset;
    }

    public Answer asset(Asset asset) {
        this.asset = asset;
        return this;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public Set<Question> getQuestions() {
        return questions;
    }

    public Answer questions(Set<Question> questions) {
        this.questions = questions;
        return this;
    }

    public Answer addQuestion(Question question) {
        this.questions.add(question);
        question.getAnswers().add(this);
        return this;
    }

    public Answer removeQuestion(Question question) {
        this.questions.remove(question);
        question.getAnswers().remove(this);
        return this;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
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
            ", name='" + getName() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            ", order=" + getOrder() +
            ", likelihood='" + getLikelihood() + "'" +
            "}";
    }
}
