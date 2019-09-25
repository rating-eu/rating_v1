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

import eu.hermeneut.domain.enumeration.GDPRAnswerType;

import eu.hermeneut.domain.enumeration.DataOperationField;

import eu.hermeneut.domain.enumeration.SecurityPillar;

import eu.hermeneut.domain.enumeration.ThreatArea;

/**
 * A GDPRQuestion.
 */
@Entity
@Table(name = "gdpr_question")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class GDPRQuestion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "description")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private Language language;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "answer_type", nullable = false)
    private GDPRAnswerType answerType;

    @NotNull
    @Column(name = "jhi_order", nullable = false)
    private Integer order;

    @Enumerated(EnumType.STRING)
    @Column(name = "data_operation_field")
    private DataOperationField dataOperationField;

    @Enumerated(EnumType.STRING)
    @Column(name = "security_pillar")
    private SecurityPillar securityPillar;

    @Enumerated(EnumType.STRING)
    @Column(name = "threat_area")
    private ThreatArea threatArea;

    @OneToMany(mappedBy = "gDPRQuestion")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Translation> translations = new HashSet<>();

    @ManyToOne
    private GDPRQuestionnaire questionnaire;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "gdprquestion_answers",
               joinColumns = @JoinColumn(name="gdprquestions_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="answers_id", referencedColumnName="id"))
    private Set<GDPRAnswer> answers = new HashSet<>();

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

    public GDPRQuestion text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDescription() {
        return description;
    }

    public GDPRQuestion description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Language getLanguage() {
        return language;
    }

    public GDPRQuestion language(Language language) {
        this.language = language;
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public GDPRAnswerType getAnswerType() {
        return answerType;
    }

    public GDPRQuestion answerType(GDPRAnswerType answerType) {
        this.answerType = answerType;
        return this;
    }

    public void setAnswerType(GDPRAnswerType answerType) {
        this.answerType = answerType;
    }

    public Integer getOrder() {
        return order;
    }

    public GDPRQuestion order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public DataOperationField getDataOperationField() {
        return dataOperationField;
    }

    public GDPRQuestion dataOperationField(DataOperationField dataOperationField) {
        this.dataOperationField = dataOperationField;
        return this;
    }

    public void setDataOperationField(DataOperationField dataOperationField) {
        this.dataOperationField = dataOperationField;
    }

    public SecurityPillar getSecurityPillar() {
        return securityPillar;
    }

    public GDPRQuestion securityPillar(SecurityPillar securityPillar) {
        this.securityPillar = securityPillar;
        return this;
    }

    public void setSecurityPillar(SecurityPillar securityPillar) {
        this.securityPillar = securityPillar;
    }

    public ThreatArea getThreatArea() {
        return threatArea;
    }

    public GDPRQuestion threatArea(ThreatArea threatArea) {
        this.threatArea = threatArea;
        return this;
    }

    public void setThreatArea(ThreatArea threatArea) {
        this.threatArea = threatArea;
    }

    public Set<Translation> getTranslations() {
        return translations;
    }

    public GDPRQuestion translations(Set<Translation> translations) {
        this.translations = translations;
        return this;
    }

    public GDPRQuestion addTranslations(Translation translation) {
        this.translations.add(translation);
        translation.setGDPRQuestion(this);
        return this;
    }

    public GDPRQuestion removeTranslations(Translation translation) {
        this.translations.remove(translation);
        translation.setGDPRQuestion(null);
        return this;
    }

    public void setTranslations(Set<Translation> translations) {
        this.translations = translations;
    }

    public GDPRQuestionnaire getQuestionnaire() {
        return questionnaire;
    }

    public GDPRQuestion questionnaire(GDPRQuestionnaire gDPRQuestionnaire) {
        this.questionnaire = gDPRQuestionnaire;
        return this;
    }

    public void setQuestionnaire(GDPRQuestionnaire gDPRQuestionnaire) {
        this.questionnaire = gDPRQuestionnaire;
    }

    public Set<GDPRAnswer> getAnswers() {
        return answers;
    }

    public GDPRQuestion answers(Set<GDPRAnswer> gDPRAnswers) {
        this.answers = gDPRAnswers;
        return this;
    }

    public GDPRQuestion addAnswers(GDPRAnswer gDPRAnswer) {
        this.answers.add(gDPRAnswer);
        gDPRAnswer.getQuestions().add(this);
        return this;
    }

    public GDPRQuestion removeAnswers(GDPRAnswer gDPRAnswer) {
        this.answers.remove(gDPRAnswer);
        gDPRAnswer.getQuestions().remove(this);
        return this;
    }

    public void setAnswers(Set<GDPRAnswer> gDPRAnswers) {
        this.answers = gDPRAnswers;
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
        GDPRQuestion gDPRQuestion = (GDPRQuestion) o;
        if (gDPRQuestion.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), gDPRQuestion.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "GDPRQuestion{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", description='" + getDescription() + "'" +
            ", language='" + getLanguage() + "'" +
            ", answerType='" + getAnswerType() + "'" +
            ", order=" + getOrder() +
            ", dataOperationField='" + getDataOperationField() + "'" +
            ", securityPillar='" + getSecurityPillar() + "'" +
            ", threatArea='" + getThreatArea() + "'" +
            "}";
    }
}
