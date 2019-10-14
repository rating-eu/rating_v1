package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.SecurityPillar;

import eu.hermeneut.domain.enumeration.DataImpact;

/**
 * A SecurityImpact.
 */
@Entity
@Table(name = "security_impact")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class SecurityImpact implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "security_pillar", nullable = false)
    private SecurityPillar securityPillar;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "impact", nullable = false)
    private DataImpact impact;

    @ManyToOne
    private DataOperation operation;

    @ManyToOne
    private OverallSecurityImpact overallSecurityImpact;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SecurityPillar getSecurityPillar() {
        return securityPillar;
    }

    public SecurityImpact securityPillar(SecurityPillar securityPillar) {
        this.securityPillar = securityPillar;
        return this;
    }

    public void setSecurityPillar(SecurityPillar securityPillar) {
        this.securityPillar = securityPillar;
    }

    public DataImpact getImpact() {
        return impact;
    }

    public SecurityImpact impact(DataImpact impact) {
        this.impact = impact;
        return this;
    }

    public void setImpact(DataImpact impact) {
        this.impact = impact;
    }

    @JsonIgnore
    public DataOperation getOperation() {
        return operation;
    }

    public SecurityImpact operation(DataOperation dataOperation) {
        this.operation = dataOperation;
        return this;
    }

    public void setOperation(DataOperation dataOperation) {
        this.operation = dataOperation;
    }

    public OverallSecurityImpact getOverallSecurityImpact() {
        return overallSecurityImpact;
    }

    public SecurityImpact overallSecurityImpact(OverallSecurityImpact overallSecurityImpact) {
        this.overallSecurityImpact = overallSecurityImpact;
        return this;
    }

    public void setOverallSecurityImpact(OverallSecurityImpact overallSecurityImpact) {
        this.overallSecurityImpact = overallSecurityImpact;
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
        SecurityImpact securityImpact = (SecurityImpact) o;
        if (securityImpact.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), securityImpact.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SecurityImpact{" +
            "id=" + getId() +
            ", securityPillar='" + getSecurityPillar() + "'" +
            ", impact='" + getImpact() + "'" +
            "}";
    }
}
