package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.Status;

/**
 * A GDPRQuestionnaireStatus.
 */
@Entity
@Table(name = "gdpr_questionnaire_status")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class GDPRQuestionnaireStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @OneToMany(mappedBy = "gDPRQuestionnaireStatus")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<GDPRMyAnswer> answers = new HashSet<>();

    @ManyToOne
    private DataOperation operation;

    @ManyToOne
    private GDPRQuestionnaire questionnaire;

    @ManyToOne
    private User user;

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

    public GDPRQuestionnaireStatus status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Set<GDPRMyAnswer> getAnswers() {
        return answers;
    }

    public GDPRQuestionnaireStatus answers(Set<GDPRMyAnswer> gDPRMyAnswers) {
        this.answers = gDPRMyAnswers;
        return this;
    }

    public GDPRQuestionnaireStatus addAnswers(GDPRMyAnswer gDPRMyAnswer) {
        this.answers.add(gDPRMyAnswer);
        gDPRMyAnswer.setGDPRQuestionnaireStatus(this);
        return this;
    }

    public GDPRQuestionnaireStatus removeAnswers(GDPRMyAnswer gDPRMyAnswer) {
        this.answers.remove(gDPRMyAnswer);
        gDPRMyAnswer.setGDPRQuestionnaireStatus(null);
        return this;
    }

    public void setAnswers(Set<GDPRMyAnswer> gDPRMyAnswers) {
        this.answers = gDPRMyAnswers;
    }

    public DataOperation getOperation() {
        return operation;
    }

    public GDPRQuestionnaireStatus operation(DataOperation dataOperation) {
        this.operation = dataOperation;
        return this;
    }

    public void setOperation(DataOperation dataOperation) {
        this.operation = dataOperation;
    }

    public GDPRQuestionnaire getQuestionnaire() {
        return questionnaire;
    }

    public GDPRQuestionnaireStatus questionnaire(GDPRQuestionnaire gDPRQuestionnaire) {
        this.questionnaire = gDPRQuestionnaire;
        return this;
    }

    public void setQuestionnaire(GDPRQuestionnaire gDPRQuestionnaire) {
        this.questionnaire = gDPRQuestionnaire;
    }

    public User getUser() {
        return user;
    }

    public GDPRQuestionnaireStatus user(User user) {
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
        GDPRQuestionnaireStatus gDPRQuestionnaireStatus = (GDPRQuestionnaireStatus) o;
        if (gDPRQuestionnaireStatus.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), gDPRQuestionnaireStatus.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "GDPRQuestionnaireStatus{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
