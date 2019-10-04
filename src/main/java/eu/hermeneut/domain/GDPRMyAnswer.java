package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A GDPRMyAnswer.
 */
@Entity
@Table(name = "gdpr_my_answer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class GDPRMyAnswer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    private GDPRQuestionnaireStatus gDPRQuestionnaireStatus;

    @ManyToOne
    private GDPRQuestion question;

    @ManyToOne
    private GDPRAnswer answer;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GDPRQuestionnaireStatus getGDPRQuestionnaireStatus() {
        return gDPRQuestionnaireStatus;
    }

    public GDPRMyAnswer gDPRQuestionnaireStatus(GDPRQuestionnaireStatus gDPRQuestionnaireStatus) {
        this.gDPRQuestionnaireStatus = gDPRQuestionnaireStatus;
        return this;
    }

    public void setGDPRQuestionnaireStatus(GDPRQuestionnaireStatus gDPRQuestionnaireStatus) {
        this.gDPRQuestionnaireStatus = gDPRQuestionnaireStatus;
    }

    public GDPRQuestion getQuestion() {
        return question;
    }

    public GDPRMyAnswer question(GDPRQuestion gDPRQuestion) {
        this.question = gDPRQuestion;
        return this;
    }

    public void setQuestion(GDPRQuestion gDPRQuestion) {
        this.question = gDPRQuestion;
    }

    public GDPRAnswer getAnswer() {
        return answer;
    }

    public GDPRMyAnswer answer(GDPRAnswer gDPRAnswer) {
        this.answer = gDPRAnswer;
        return this;
    }

    public void setAnswer(GDPRAnswer gDPRAnswer) {
        this.answer = gDPRAnswer;
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
        GDPRMyAnswer gDPRMyAnswer = (GDPRMyAnswer) o;
        if (gDPRMyAnswer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), gDPRMyAnswer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "GDPRMyAnswer{" +
            "id=" + getId() +
            "}";
    }
}
