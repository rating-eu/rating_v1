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

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * =======WP3=======
 */
@ApiModel(description = "=======WP3=======")
@Entity
@Table(name = "economic_coefficients")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "economiccoefficients")
public class EconomicCoefficients implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @DecimalMin(value = "0")
    @DecimalMax(value = "100")
    @Column(name = "discounting_rate", precision = 20, scale = 2)
    private BigDecimal discountingRate;

    @Column(name = "physical_assets_return", precision = 50, scale = 2)
    private BigDecimal physicalAssetsReturn;

    @Column(name = "long_term_liabilities", precision = 50, scale = 2)
    private BigDecimal longTermLiabilities;

    /**
     * Fixed Assets Return
     */
    @ApiModelProperty(value = "Fixed Assets Return")
    @Column(name = "financial_assets_return", precision = 50, scale = 2)
    private BigDecimal financialAssetsReturn;

    @Column(name = "current_liabilities", precision = 50, scale = 2)
    private BigDecimal currentLiabilities;

    /**
     * Current Assets Return
     */
    @ApiModelProperty(value = "Current Assets Return")
    @Column(name = "loss_of_intangible", precision = 50, scale = 2)
    private BigDecimal lossOfIntangible;

    /**
     * WP3
     */
    @ApiModelProperty(value = "WP3")
    @OneToOne
    @JoinColumn(unique = true)
    private SelfAssessment selfAssessment;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getDiscountingRate() {
        return discountingRate;
    }

    public EconomicCoefficients discountingRate(BigDecimal discountingRate) {
        this.discountingRate = discountingRate;
        return this;
    }

    public void setDiscountingRate(BigDecimal discountingRate) {
        this.discountingRate = discountingRate;
    }

    public BigDecimal getPhysicalAssetsReturn() {
        return physicalAssetsReturn;
    }

    public EconomicCoefficients physicalAssetsReturn(BigDecimal physicalAssetsReturn) {
        this.physicalAssetsReturn = physicalAssetsReturn;
        return this;
    }

    public void setPhysicalAssetsReturn(BigDecimal physicalAssetsReturn) {
        this.physicalAssetsReturn = physicalAssetsReturn;
    }

    public BigDecimal getFinancialAssetsReturn() {
        return financialAssetsReturn;
    }

    public EconomicCoefficients financialAssetsReturn(BigDecimal financialAssetsReturn) {
        this.financialAssetsReturn = financialAssetsReturn;
        return this;
    }

    public BigDecimal getLongTermLiabilities() {
        return longTermLiabilities;
    }

    public void setLongTermLiabilities(BigDecimal longTermLiabilities) {
        this.longTermLiabilities = longTermLiabilities;
    }

    public void setFinancialAssetsReturn(BigDecimal financialAssetsReturn) {
        this.financialAssetsReturn = financialAssetsReturn;
    }

    public BigDecimal getCurrentLiabilities() {
        return currentLiabilities;
    }

    public void setCurrentLiabilities(BigDecimal currentLiabilities) {
        this.currentLiabilities = currentLiabilities;
    }

    public BigDecimal getLossOfIntangible() {
        return lossOfIntangible;
    }

    public EconomicCoefficients lossOfIntangible(BigDecimal lossOfIntangible) {
        this.lossOfIntangible = lossOfIntangible;
        return this;
    }

    public void setLossOfIntangible(BigDecimal lossOfIntangible) {
        this.lossOfIntangible = lossOfIntangible;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public EconomicCoefficients selfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
        return this;
    }

    public void setSelfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
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
        EconomicCoefficients economicCoefficients = (EconomicCoefficients) o;
        if (economicCoefficients.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), economicCoefficients.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EconomicCoefficients{" +
            "id=" + getId() +
            ", discountingRate=" + getDiscountingRate() +
            ", physicalAssetsReturn=" + getPhysicalAssetsReturn() +
            ", financialAssetsReturn=" + getFinancialAssetsReturn() +
            ", lossOfIntangible=" + getLossOfIntangible() +
            "}";
    }
}
