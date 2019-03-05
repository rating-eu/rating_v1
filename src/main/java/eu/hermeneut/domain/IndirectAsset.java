package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A IndirectAsset.
 */
@Entity
@Table(name = "indirect_asset")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "indirectasset")
public class IndirectAsset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @ManyToOne(optional = false)
    private DirectAsset directAsset;

    @NotNull
    @OneToOne(optional = false)
    private MyAsset myAsset;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

	@JsonIgnore
    public DirectAsset getDirectAsset() {
        return directAsset;
    }

    public IndirectAsset directAsset(DirectAsset directAsset) {
        this.directAsset = directAsset;
        return this;
    }
	
    public void setDirectAsset(DirectAsset directAsset) {
        this.directAsset = directAsset;
    }

    public MyAsset getMyAsset() {
        return myAsset;
    }

    public IndirectAsset myAsset(MyAsset myAsset) {
        this.myAsset = myAsset;
        return this;
    }

    public void setMyAsset(MyAsset myAsset) {
        this.myAsset = myAsset;
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
        IndirectAsset indirectAsset = (IndirectAsset) o;
        if (indirectAsset.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), indirectAsset.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "IndirectAsset{" +
            "id=" + getId() +
            "}";
    }
}
