package eu.hermeneut.domain;

import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.GDPRQuestionnairePurpose;

/**
 * =======GDPR Questions=======
 */
@ApiModel(description = "=======GDPR Questions=======")
@Entity
@Table(name = "gdpr_questionnaire")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class GDPRQuestionnaire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false, unique = true)
    private GDPRQuestionnairePurpose purpose;

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

    public GDPRQuestionnaire name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GDPRQuestionnairePurpose getPurpose() {
        return purpose;
    }

    public GDPRQuestionnaire purpose(GDPRQuestionnairePurpose purpose) {
        this.purpose = purpose;
        return this;
    }

    public void setPurpose(GDPRQuestionnairePurpose purpose) {
        this.purpose = purpose;
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
        GDPRQuestionnaire gDPRQuestionnaire = (GDPRQuestionnaire) o;
        if (gDPRQuestionnaire.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), gDPRQuestionnaire.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "GDPRQuestionnaire{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", purpose='" + getPurpose() + "'" +
            "}";
    }
}
