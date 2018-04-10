package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Motivation.
 */
@Entity
@Table(name = "motivation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "motivation")
public class Motivation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "modified")
    private ZonedDateTime modified;

    @ManyToMany(mappedBy = "motivations")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ThreatAgent> tagents = new HashSet<>();

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

    public Motivation name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Motivation description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public Motivation created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public Motivation modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public Set<ThreatAgent> getTagents() {
        return tagents;
    }

    public Motivation tagents(Set<ThreatAgent> threatAgents) {
        this.tagents = threatAgents;
        return this;
    }

    public Motivation addTagent(ThreatAgent threatAgent) {
        this.tagents.add(threatAgent);
        threatAgent.getMotivations().add(this);
        return this;
    }

    public Motivation removeTagent(ThreatAgent threatAgent) {
        this.tagents.remove(threatAgent);
        threatAgent.getMotivations().remove(this);
        return this;
    }

    public void setTagents(Set<ThreatAgent> threatAgents) {
        this.tagents = threatAgents;
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
        Motivation motivation = (Motivation) o;
        if (motivation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), motivation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Motivation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}
