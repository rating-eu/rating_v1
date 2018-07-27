package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A MyAsset.
 */
@Entity
@Table(name = "my_asset")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "myasset")
public class MyAsset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "magnitude")
    private String magnitude;

    @Column(name = "ranking")
    private Integer ranking;

    @OneToOne
    @JoinColumn(unique = true)
    private Asset asset;

    @OneToOne
    @JoinColumn(unique = true)
    private SelfAssessment selfAssessment;

    @OneToOne
    @JoinColumn(unique = true)
    private Questionnaire questionnaire;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMagnitude() {
        return magnitude;
    }

    public MyAsset magnitude(String magnitude) {
        this.magnitude = magnitude;
        return this;
    }

    public void setMagnitude(String magnitude) {
        this.magnitude = magnitude;
    }

    public Integer getRanking() {
        return ranking;
    }

    public MyAsset ranking(Integer ranking) {
        this.ranking = ranking;
        return this;
    }

    public void setRanking(Integer ranking) {
        this.ranking = ranking;
    }

    public Asset getAsset() {
        return asset;
    }

    public MyAsset asset(Asset asset) {
        this.asset = asset;
        return this;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public MyAsset selfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
        return this;
    }

    public void setSelfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public MyAsset questionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
        return this;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
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
        MyAsset myAsset = (MyAsset) o;
        if (myAsset.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), myAsset.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MyAsset{" +
            "id=" + getId() +
            ", magnitude='" + getMagnitude() + "'" +
            ", ranking=" + getRanking() +
            "}";
    }
}
