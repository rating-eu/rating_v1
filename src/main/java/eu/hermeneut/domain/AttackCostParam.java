package eu.hermeneut.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import eu.hermeneut.domain.enumeration.AttackCostParamType;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "attack_cost_param",
    uniqueConstraints = @UniqueConstraint(columnNames = {"self_assessment_id", "param_type"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "attack_cost_param")
public class AttackCostParam implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "param_type", nullable = false)
    private AttackCostParamType type;

    @NotNull
    @Column(precision = 50, scale = 2)
    private BigDecimal value;

    @Transient
    @JsonSerialize
    @JsonDeserialize
    private BigDecimal min;

    @Transient
    @JsonSerialize
    @JsonDeserialize
    private BigDecimal max;

    @NotNull
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "self_assessment_id")
    private SelfAssessment selfAssessment;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AttackCostParam type(AttackCostParamType type) {
        this.type = type;
        return this;
    }

    public AttackCostParamType getType() {
        return type;
    }

    public void setType(AttackCostParamType type) {
        this.type = type;
    }

    public AttackCostParam value(BigDecimal value) {
        this.value = value;
        return this;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public BigDecimal getMin() {
        return min;
    }

    public void setMin(BigDecimal min) {
        this.min = min;
    }

    public AttackCostParam min(BigDecimal min) {
        this.min = min;
        return this;
    }

    public BigDecimal getMax() {
        return max;
    }

    public void setMax(BigDecimal max) {
        this.max = max;
    }

    public AttackCostParam max(BigDecimal max) {
        this.max = max;
        return this;
    }

    public SelfAssessment getSelfAssessment() {
        return selfAssessment;
    }

    public void setSelfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AttackCostParam that = (AttackCostParam) o;
        return Objects.equals(id, that.id) &&
            type == that.type &&
            Objects.equals(value, that.value) &&
            Objects.equals(min, that.min) &&
            Objects.equals(max, that.max) &&
            Objects.equals(selfAssessment, that.selfAssessment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, type, value, min, max, selfAssessment);
    }

    @Override
    public String toString() {
        return "AttackCostParam{" +
            "id=" + id +
            ", type=" + type +
            ", value=" + value +
            ", min=" + min +
            ", max=" + max +
            ", selfAssessment=" + selfAssessment +
            '}';
    }

    public AttackCostParam selfAssessment(SelfAssessment selfAssessment) {
        this.selfAssessment = selfAssessment;
        return this;
    }
}
