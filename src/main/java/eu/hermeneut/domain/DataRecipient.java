package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.DataRecipientType;

/**
 * A DataRecipient.
 */
@Entity
@Table(name = "data_recipient")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class DataRecipient implements Serializable {

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
    @Column(name = "jhi_type", nullable = false)
    private DataRecipientType type;

    @ManyToOne
    private DataOperation operation;

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

    public DataRecipient name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DataRecipientType getType() {
        return type;
    }

    public DataRecipient type(DataRecipientType type) {
        this.type = type;
        return this;
    }

    public void setType(DataRecipientType type) {
        this.type = type;
    }

    @JsonIgnore
    public DataOperation getOperation() {
        return operation;
    }

    public DataRecipient operation(DataOperation dataOperation) {
        this.operation = dataOperation;
        return this;
    }

    public void setOperation(DataOperation dataOperation) {
        this.operation = dataOperation;
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
        DataRecipient dataRecipient = (DataRecipient) o;
        if (dataRecipient.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dataRecipient.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DataRecipient{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
