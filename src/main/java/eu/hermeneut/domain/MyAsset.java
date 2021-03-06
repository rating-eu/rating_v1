/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
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

    @Column(name = "ranking")
    private Integer ranking;

    @Column(name = "estimated")
    private Boolean estimated;

    /**
     * WP3
     */
    @ApiModelProperty(value = "WP3")
    @Column(name = "economic_value", precision = 50, scale = 2)
    private BigDecimal economicValue;

    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "impact")
    private Integer impact;

    @Column(name = "economic_impact", precision = 50, scale = 2)
    private BigDecimal economicImpact;

    @Column(name = "loss_value", precision = 50, scale = 2)
    private BigDecimal lossValue;

    @OneToMany(mappedBy = "myAsset", fetch = FetchType.EAGER,
        cascade = {CascadeType.ALL, CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<AttackCost> costs = new HashSet<>();

    @ManyToOne
    private Asset asset;

    @ManyToOne
    private SelfAssessment selfAssessment;

    @ManyToOne
    private Questionnaire questionnaire;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean isEstimated() {
        return estimated;
    }

    public MyAsset estimated(Boolean estimated) {
        this.estimated = estimated;
        return this;
    }

    public void setEstimated(Boolean estimated) {
        this.estimated = estimated;
    }

    public BigDecimal getEconomicValue() {
        return economicValue;
    }

    public MyAsset economicValue(BigDecimal economicValue) {
        this.economicValue = economicValue;
        return this;
    }

    public void setEconomicValue(BigDecimal economicValue) {
        this.economicValue = economicValue;
    }

    public Integer getImpact() {
        return impact;
    }

    public MyAsset impact(Integer impact) {
        this.impact = impact;
        return this;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
    }

    public BigDecimal getEconomicImpact() {
        return economicImpact;
    }

    public void setEconomicImpact(BigDecimal economicImpact) {
        this.economicImpact = economicImpact;
    }

    public MyAsset economicImpact(BigDecimal economicImpact) {
        this.economicImpact = economicImpact;
        return this;
    }

    public BigDecimal getLossValue() {
        return lossValue;
    }

    public MyAsset lossValue(BigDecimal lossValue) {
        this.lossValue = lossValue;
        return this;
    }

    public void setLossValue(BigDecimal lossValue) {
        this.lossValue = lossValue;
    }

    public Set<AttackCost> getCosts() {
        return costs;
    }

    public MyAsset costs(Set<AttackCost> attackCosts) {
        this.costs = attackCosts;
        return this;
    }

    public MyAsset addCosts(AttackCost attackCost) {
        this.costs.add(attackCost);
        attackCost.setMyAsset(this);
        return this;
    }

    public MyAsset removeCosts(AttackCost attackCost) {
        this.costs.remove(attackCost);
        attackCost.setMyAsset(null);
        return this;
    }

    public void setCosts(Set<AttackCost> attackCosts) {
        this.costs = attackCosts;
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
            ", ranking=" + getRanking() +
            ", estimated='" + isEstimated() + "'" +
            ", economicValue=" + getEconomicValue() +
            ", impact=" + getImpact() +
            ", lossValue=" + getLossValue() +
            "}";
    }
}
