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

/**
 * A ExternalAudit.
 */
@Entity
@Table(name = "external_audit")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "externalaudit")
public class ExternalAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    private User user;

    @ManyToMany(mappedBy = "externalaudits")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<SelfAssessment> selfassessments = new HashSet<>();

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

    public ExternalAudit name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public ExternalAudit user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<SelfAssessment> getSelfassessments() {
        return selfassessments;
    }

    public ExternalAudit selfassessments(Set<SelfAssessment> selfAssessments) {
        this.selfassessments = selfAssessments;
        return this;
    }

    public ExternalAudit addSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.add(selfAssessment);
        selfAssessment.getExternalaudits().add(this);
        return this;
    }

    public ExternalAudit removeSelfassessment(SelfAssessment selfAssessment) {
        this.selfassessments.remove(selfAssessment);
        selfAssessment.getExternalaudits().remove(this);
        return this;
    }

    public void setSelfassessments(Set<SelfAssessment> selfAssessments) {
        this.selfassessments = selfAssessments;
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
        ExternalAudit externalAudit = (ExternalAudit) o;
        if (externalAudit.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), externalAudit.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ExternalAudit{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
