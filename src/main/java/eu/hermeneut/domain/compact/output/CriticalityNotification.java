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
