package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.Language;

/**
 * A Translation.
 */
@Entity
@Table(name = "translation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Translation implements Serializable {

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

    @ManyToOne
    private DataImpactDescription dataImpactDescription;

    @ManyToOne
    private GDPRQuestion gDPRQuestion;

    @ManyToOne
    private GDPRAnswer gDPRAnswer;

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

    public Translation text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Language getLanguage() {
        return language;
    }

    public Translation language(Language language) {
        this.language = language;
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public DataImpactDescription getDataImpactDescription() {
        return dataImpactDescription;
    }

    public Translation dataImpactDescription(DataImpactDescription dataImpactDescription) {
        this.dataImpactDescription = dataImpactDescription;
        return this;
    }

    public void setDataImpactDescription(DataImpactDescription dataImpactDescription) {
        this.dataImpactDescription = dataImpactDescription;
    }

    public GDPRQuestion getGDPRQuestion() {
        return gDPRQuestion;
    }

    public Translation gDPRQuestion(GDPRQuestion gDPRQuestion) {
        this.gDPRQuestion = gDPRQuestion;
        return this;
    }

    public void setGDPRQuestion(GDPRQuestion gDPRQuestion) {
        this.gDPRQuestion = gDPRQuestion;
    }

    public GDPRAnswer getGDPRAnswer() {
        return gDPRAnswer;
    }

    public Translation gDPRAnswer(GDPRAnswer gDPRAnswer) {
        this.gDPRAnswer = gDPRAnswer;
        return this;
    }

    public void setGDPRAnswer(GDPRAnswer gDPRAnswer) {
        this.gDPRAnswer = gDPRAnswer;
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
        Translation translation = (Translation) o;
        if (translation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), translation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Translation{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", language='" + getLanguage() + "'" +
            "}";
    }
}
