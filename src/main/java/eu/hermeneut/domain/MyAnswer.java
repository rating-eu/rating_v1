package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.util.Objects;

/**
 * A MyAnswer.
 */
@Entity
@Table(name = "my_answer",
    uniqueConstraints = @UniqueConstraint(columnNames = {"questionnaire_status_id", "questionnaire_id", "question_id", "user_id", "answer_id"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "myanswer")
public class MyAnswer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "mycheck")
    private String mycheck;

    @ManyToOne
    private QuestionnaireStatus questionnaireStatus;

    @OneToOne
    @JoinColumn
    private Answer answer;

    @OneToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @OneToOne
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMycheck() {
        return mycheck;
    }

    public MyAnswer mycheck(String mycheck) {
        this.mycheck = mycheck;
        return this;
    }

    public void setMycheck(String mycheck) {
        this.mycheck = mycheck;
    }

    public QuestionnaireStatus getQuestionnaireStatus() {
        return questionnaireStatus;
    }

    public MyAnswer questionnaireStatus(QuestionnaireStatus questionnaireStatus) {
        this.questionnaireStatus = questionnaireStatus;
        return this;
    }

    public void setQuestionnaireStatus(QuestionnaireStatus questionnaireStatus) {
        this.questionnaireStatus = questionnaireStatus;
    }

    public Answer getAnswer() {
        return answer;
    }

    public MyAnswer answer(Answer answer) {
        this.answer = answer;
        return this;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public Question getQuestion() {
        return question;
    }

    public MyAnswer question(Question question) {
        this.question = question;
        return this;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public MyAnswer questionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
        return this;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public User getUser() {
        return user;
    }

    public MyAnswer user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        MyAnswer myAnswer = (MyAnswer) o;
        if (myAnswer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), myAnswer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MyAnswer{" +
            "id=" + getId() +
            ", mycheck='" + getMycheck() + "'" +
            "}";
    }
}
