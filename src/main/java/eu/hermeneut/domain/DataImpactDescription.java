package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.DataImpact;

import eu.hermeneut.domain.enumeration.Language;

/**
 * =======GDPR Entities=======
 */
@ApiModel(description = "=======GDPR Entities=======")
@Entity
@Table(name = "data_impact_description")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class DataImpactDescription implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "impact", nullable = false)
    private DataImpact impact;

    @NotNull
    @Size(max = 2000)
    @Column(name = "description", length = 2000, nullable = false)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private Language language;

    @OneToMany(mappedBy = "dataImpactDescription")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Translation> translations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DataImpact getImpact() {
        return impact;
    }

    public DataImpactDescription impact(DataImpact impact) {
        this.impact = impact;
        return this;
    }

    public void setImpact(DataImpact impact) {
        this.impact = impact;
    }

    public String getDescription() {
        return description;
    }

    public DataImpactDescription description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Language getLanguage() {
        return language;
    }

    public DataImpactDescription language(Language language) {
        this.language = language;
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Set<Translation> getTranslations() {
        return translations;
    }

    public DataImpactDescription translations(Set<Translation> translations) {
        this.translations = translations;
        return this;
    }

    public DataImpactDescription addTranslations(Translation translation) {
        this.translations.add(translation);
        translation.setDataImpactDescription(this);
        return this;
    }

    public DataImpactDescription removeTranslations(Translation translation) {
        this.translations.remove(translation);
        translation.setDataImpactDescription(null);
        return this;
    }

    public void setTranslations(Set<Translation> translations) {
        this.translations = translations;
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
        DataImpactDescription dataImpactDescription = (DataImpactDescription) o;
        if (dataImpactDescription.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dataImpactDescription.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DataImpactDescription{" +
            "id=" + getId() +
            ", impact='" + getImpact() + "'" +
            ", description='" + getDescription() + "'" +
            ", language='" + getLanguage() + "'" +
            "}";
    }
}
