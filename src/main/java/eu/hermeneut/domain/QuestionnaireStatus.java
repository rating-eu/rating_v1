package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.Status;

/**
 * A QuestionnaireStatus.
 */
@Entity
@Table(
    name = "questionnaire_status",
    uniqueConstraints = @UniqueConstraint(columnNames = {"self_assessment_id", "questionnaire_id", "user_id"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "questionnairestatus")
public class QuestionnaireStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @OneToOne
    @JoinColumn(name = "self_assessment_id")
    private SelfAssessment selfAssessment;

    @OneToOne
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "questionnaireStatus", fetch = FetchType.EAGER)
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<MyAnswer> answers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public QuestionnaireStatus status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public QuestionnaireStatus selfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
        return this;
    }

    public void setSelfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public QuestionnaireStatus questionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
        return this;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public User getUser() {
        return user;
    }

    public QuestionnaireStatus user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<MyAnswer> getAnswers() {
        return answers;
    }

    public QuestionnaireStatus answers(Set<MyAnswer> myAnswers) {
        this.answers = myAnswers;
        return this;
    }

    public QuestionnaireStatus addAnswers(MyAnswer myAnswer) {
        this.answers.add(myAnswer);
        myAnswer.setQuestionnaireStatus(this);
        return this;
    }

    public QuestionnaireStatus removeAnswers(MyAnswer myAnswer) {
        this.answers.remove(myAnswer);
        myAnswer.setQuestionnaireStatus(null);
        return this;
    }

    public void setAnswers(Set<MyAnswer> myAnswers) {
        this.answers = myAnswers;
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
        QuestionnaireStatus questionnaireStatus = (QuestionnaireStatus) o;
        if (questionnaireStatus.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionnaireStatus.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionnaireStatus{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
