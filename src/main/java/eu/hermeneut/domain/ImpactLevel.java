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

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A ImpactLevel.
 */
@Entity
@Table(
    name = "impact_level",
    uniqueConstraints = @UniqueConstraint(columnNames = {"self_assessment_id", "impact"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "impactlevel")
public class ImpactLevel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "self_assessment_id", nullable = false)
    private Long selfAssessmentID;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "impact", nullable = false)
    private Integer impact;

    @NotNull
    @Min(value = 0L)
    @Column(name = "min_loss", nullable = false, precision = 50, scale = 2)
    private BigDecimal minLoss;

    @NotNull
    @Min(value = 0L)
    @Column(name = "max_loss", nullable = false, precision = 50, scale = 2)
    private BigDecimal maxLoss;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSelfAssessmentID() {
        return selfAssessmentID;
    }

    public ImpactLevel selfAssessmentID(Long selfAssessmentID) {
        this.selfAssessmentID = selfAssessmentID;
        return this;
    }

    public void setSelfAssessmentID(Long selfAssessmentID) {
        this.selfAssessmentID = selfAssessmentID;
    }

    public Integer getImpact() {
        return impact;
    }

    public ImpactLevel impact(Integer impact) {
        this.impact = impact;
        return this;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
    }

    public BigDecimal getMinLoss() {
        return minLoss;
    }

    public ImpactLevel minLoss(BigDecimal minLoss) {
        this.minLoss = minLoss;
        return this;
    }

    public void setMinLoss(BigDecimal minLoss) {
        this.minLoss = minLoss;
    }

    public BigDecimal getMaxLoss() {
        return maxLoss;
    }

    public ImpactLevel maxLoss(BigDecimal maxLoss) {
        this.maxLoss = maxLoss;
        return this;
    }

    public void setMaxLoss(BigDecimal maxLoss) {
        this.maxLoss = maxLoss;
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
        ImpactLevel impactLevel = (ImpactLevel) o;
        if (impactLevel.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), impactLevel.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ImpactLevel{" +
            "id=" + getId() +
            ", selfAssessmentID=" + getSelfAssessmentID() +
            ", impact=" + getImpact() +
            ", minLoss=" + getMinLoss() +
            ", maxLoss=" + getMaxLoss() +
            "}";
    }
}
