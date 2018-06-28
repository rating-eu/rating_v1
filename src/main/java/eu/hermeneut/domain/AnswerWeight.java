package eu.hermeneut.domain;

import eu.hermeneut.domain.enumeration.AnswerLikelihood;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.QuestionType;

/**
 * A AnswerWeight.
 */
@Entity
@Table(
    name = "answer_weight",
    uniqueConstraints = @UniqueConstraint(columnNames = {"likelihood", "question_type"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "answerweight")
public class AnswerWeight implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood")
    private AnswerLikelihood likelihood;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type")
    private QuestionType questionType;

    @Column(name = "weight")
    private Float weight;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AnswerLikelihood getLikelihood() {
        return likelihood;
    }

    public AnswerWeight likelihood(AnswerLikelihood answerLikelihood) {
        this.likelihood = answerLikelihood;
        return this;
    }

    public void setLikelihood(AnswerLikelihood answerLikelihood) {
        this.likelihood = answerLikelihood;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public AnswerWeight questionType(QuestionType questionType) {
        this.questionType = questionType;
        return this;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public Float getWeight() {
        return weight;
    }

    public AnswerWeight weight(Float weight) {
        this.weight = weight;
        return this;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
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
        AnswerWeight answerWeight = (AnswerWeight) o;
        if (answerWeight.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), answerWeight.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AnswerWeight{" +
            "id=" + getId() +
            ", likelihood='" + getLikelihood() + "'" +
            ", questionType='" + getQuestionType() + "'" +
            ", weight=" + getWeight() +
            "}";
    }
}
