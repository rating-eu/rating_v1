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

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A EBIT.
 */
@Entity
@Table(name = "ebit")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "ebit")
public class EBIT implements Serializable {

    private static final long serialVersionUID = 1L;

    public EBIT() {
    }

    public EBIT(Integer year, BigDecimal value, ZonedDateTime created, SelfAssessment selfAssessment) {
        this.year = year;
        this.value = value;
        this.created = created;
        this.selfAssessment = selfAssessment;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * 2 (6 times)
     */
    @ApiModelProperty(value = "2 (6 times)")
    @Column(name = "jhi_year")
    private Integer year;

    @Column(name = "jhi_value", precision=50, scale=2)
    private BigDecimal value;

    @CreationTimestamp
    @Column(name = "created")
    private ZonedDateTime created;

    @NotNull
    @OneToOne
    private SelfAssessment selfAssessment;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getYear() {
        return year;
    }

    public EBIT year(Integer year) {
        this.year = year;
        return this;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getValue() {
        return value;
    }

    public EBIT value(BigDecimal value) {
        this.value = value;
        return this;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public EBIT created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public EBIT selfAssessment(SelfAssessment selfAssessment) {
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
        EBIT eBIT = (EBIT) o;
        if (eBIT.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), eBIT.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EBIT{" +
            "id=" + getId() +
            ", year=" + getYear() +
            ", value=" + getValue() +
            ", created='" + getCreated() + "'" +
            "}";
    }
}
