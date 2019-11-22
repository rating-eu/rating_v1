package eu.hermeneut.domain;

import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * ==========QuestionRelevance==========
 */
@ApiModel(description = "==========QuestionRelevance==========")
@Entity
@Table(name = "question_relevance")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class QuestionRelevance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Min(value = 0)
    @Max(value = 5)
    @Column(name = "relevance")
    private Integer relevance;

    @ManyToOne
    private Question question;

    @ManyToOne
    private QuestionnaireStatus status;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRelevance() {
        return relevance;
    }

    public QuestionRelevance relevance(Integer relevance) {
        this.relevance = relevance;
        return this;
    }

    public void setRelevance(Integer relevance) {
        this.relevance = relevance;
    }

    public Question getQuestion() {
        return question;
    }

    public QuestionRelevance question(Question question) {
        this.question = question;
        return this;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public QuestionnaireStatus getStatus() {
        return status;
    }

    public QuestionRelevance status(QuestionnaireStatus questionnaireStatus) {
        this.status = questionnaireStatus;
        return this;
    }

    public void setStatus(QuestionnaireStatus questionnaireStatus) {
        this.status = questionnaireStatus;
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
        QuestionRelevance questionRelevance = (QuestionRelevance) o;
        if (questionRelevance.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionRelevance.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionRelevance{" +
            "id=" + getId() +
            ", relevance=" + getRelevance() +
            "}";
    }
}
