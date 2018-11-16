package eu.hermeneut.domain.compact;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.enumeration.Frequency;
import eu.hermeneut.domain.enumeration.ResourceLevel;
import eu.hermeneut.domain.enumeration.SkillLevel;
import org.apache.commons.math3.util.Precision;

public class AttackStrategyRisk implements MaxValues {

    private Long id;
    private String name;
    private String description;
    private SkillLevel skill;
    private Frequency frequency;
    private ResourceLevel resources;

    /**
     * Initial, Refined or Contextual likelihood associated to the AttackStrategy.
     * The rightmost is preferred if available.
     * This field represents a percentage value,
     * hence it assumes values between 0 and 1.
     */
    private Float risk;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public SkillLevel getSkill() {
        return skill;
    }

    public void setSkill(SkillLevel skill) {
        this.skill = skill;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public ResourceLevel getResources() {
        return resources;
    }

    public void setResources(ResourceLevel resources) {
        this.resources = resources;
    }

    public Float getRisk() {
        return risk;
    }

    public void setRisk(Float risk) {
        if (risk < 0 || risk > 1) {
            throw new IllegalArgumentException("Risk must be normalized to a value between 0 and 1");
        }

        this.risk = Precision.round(risk, 2);
    }
}
