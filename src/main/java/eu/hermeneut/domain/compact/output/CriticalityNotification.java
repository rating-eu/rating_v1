package eu.hermeneut.domain.compact.output;

import java.io.Serializable;

public class CriticalityNotification implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long companyID;

    private Long attackID;

    private CriticalityType type;

    private float criticality;

    public Long getCompanyID() {
        return companyID;
    }

    public void setCompanyID(Long companyID) {
        this.companyID = companyID;
    }

    public Long getAttackID() {
        return attackID;
    }

    public void setAttackID(Long attackID) {
        this.attackID = attackID;
    }

    public CriticalityType getType() {
        return type;
    }

    public void setType(CriticalityType type) {
        this.type = type;
    }

    public float getCriticality() {
        return criticality;
    }

    public void setCriticality(float criticality) {
        this.criticality = criticality;
    }
}
