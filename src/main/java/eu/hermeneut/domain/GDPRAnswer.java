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

import eu.hermeneut.domain.enumeration.Language;

import eu.hermeneut.domain.enumeration.AnswerValue;

import eu.hermeneut.domain.enumeration.DataImpact;

/**
 * A GDPRAnswer.
 */
@Entity
@Table(name = "gdpr_answer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class GDPRAnswer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "text", nullable = false)
    private String text;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(name = "answer_value")
    private AnswerValue answerValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "data_impact")
    private DataImpact dataImpact;

    @Column(name = "jhi_order")
    private Integer order;

    @OneToMany(mappedBy = "gDPRAnswer")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Translation> translations = new HashSet<>();

    @ManyToMany(mappedBy = "answers")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<GDPRQuestion> questions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public GDPRAnswer text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Language getLanguage() {
        return language;
    }

    public GDPRAnswer language(Language language) {
        this.language = language;
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public AnswerValue getAnswerValue() {
        return answerValue;
    }

    public GDPRAnswer answerValue(AnswerValue answerValue) {
        this.answerValue = answerValue;
        return this;
    }

    public void setAnswerValue(AnswerValue answerValue) {
        this.answerValue = answerValue;
    }

    public DataImpact getDataImpact() {
        return dataImpact;
    }

    public GDPRAnswer dataImpact(DataImpact dataImpact) {
        this.dataImpact = dataImpact;
        return this;
    }

    public void setDataImpact(DataImpact dataImpact) {
        this.dataImpact = dataImpact;
    }

    public Integer getOrder() {
        return order;
    }

    public GDPRAnswer order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Set<Translation> getTranslations() {
        return translations;
    }

    public GDPRAnswer translations(Set<Translation> translations) {
        this.translations = translations;
        return this;
    }

    public GDPRAnswer addTranslations(Translation translation) {
        this.translations.add(translation);
        translation.setGDPRAnswer(this);
        return this;
    }

    public GDPRAnswer removeTranslations(Translation translation) {
        this.translations.remove(translation);
        translation.setGDPRAnswer(null);
        return this;
    }

    public void setTranslations(Set<Translation> translations) {
        this.translations = translations;
    }

    public Set<GDPRQuestion> getQuestions() {
        return questions;
    }

    public GDPRAnswer questions(Set<GDPRQuestion> gDPRQuestions) {
        this.questions = gDPRQuestions;
        return this;
    }

    public GDPRAnswer addQuestion(GDPRQuestion gDPRQuestion) {
        this.questions.add(gDPRQuestion);
        gDPRQuestion.getAnswers().add(this);
        return this;
    }

    public GDPRAnswer removeQuestion(GDPRQuestion gDPRQuestion) {
        this.questions.remove(gDPRQuestion);
        gDPRQuestion.getAnswers().remove(this);
        return this;
    }

    public void setQuestions(Set<GDPRQuestion> gDPRQuestions) {
        this.questions = gDPRQuestions;
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
        GDPRAnswer gDPRAnswer = (GDPRAnswer) o;
        if (gDPRAnswer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), gDPRAnswer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "GDPRAnswer{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", language='" + getLanguage() + "'" +
            ", answerValue='" + getAnswerValue() + "'" +
            ", dataImpact='" + getDataImpact() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
