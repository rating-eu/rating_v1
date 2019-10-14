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

import eu.hermeneut.domain.enumeration.DataImpact;

/**
 * A OverallSecurityImpact.
 */
@Entity
@Table(name = "overall_security_impact")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class OverallSecurityImpact implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "impact", nullable = false)
    private DataImpact impact;

    @OneToOne
    @JoinColumn(unique = true)
    private DataOperation operation;

    @OneToMany(mappedBy = "overallSecurityImpact")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<SecurityImpact> impacts = new HashSet<>();

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

    public OverallSecurityImpact impact(DataImpact impact) {
        this.impact = impact;
        return this;
    }

    public void setImpact(DataImpact impact) {
        this.impact = impact;
    }

    public DataOperation getOperation() {
        return operation;
    }

    public OverallSecurityImpact operation(DataOperation dataOperation) {
        this.operation = dataOperation;
        return this;
    }

    public void setOperation(DataOperation dataOperation) {
        this.operation = dataOperation;
    }

    public Set<SecurityImpact> getImpacts() {
        return impacts;
    }

    public OverallSecurityImpact impacts(Set<SecurityImpact> securityImpacts) {
        this.impacts = securityImpacts;
        return this;
    }

    public OverallSecurityImpact addImpact(SecurityImpact securityImpact) {
        this.impacts.add(securityImpact);
        securityImpact.setOverallSecurityImpact(this);
        return this;
    }

    public OverallSecurityImpact removeImpact(SecurityImpact securityImpact) {
        this.impacts.remove(securityImpact);
        securityImpact.setOverallSecurityImpact(null);
        return this;
    }

    public void setImpacts(Set<SecurityImpact> securityImpacts) {
        this.impacts = securityImpacts;
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
        OverallSecurityImpact overallSecurityImpact = (OverallSecurityImpact) o;
        if (overallSecurityImpact.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), overallSecurityImpact.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OverallSecurityImpact{" +
            "id=" + getId() +
            ", impact='" + getImpact() + "'" +
            "}";
    }
}
