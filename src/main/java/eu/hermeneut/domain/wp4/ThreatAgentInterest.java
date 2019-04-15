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

package eu.hermeneut.domain.wp4;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.ThreatAgent;

import java.util.Set;

public class ThreatAgentInterest extends ThreatAgent {

    public ThreatAgentInterest(ThreatAgent threatAgent) {
        this.setId(threatAgent.getId());
        this.setName(threatAgent.getName());
        this.setDescription(threatAgent.getDescription());

        this.setCreated(threatAgent.getCreated());
        this.setModified(threatAgent.getModified());

        this.setSkillLevel(threatAgent.getSkillLevel());
        this.setAccess(threatAgent.getAccess());
        this.setIntent(threatAgent.getIntent());

        this.setMotivations(threatAgent.getMotivations());

        this.setIdentifiedByDefault(threatAgent.getIdentifiedByDefault());
    }

    private float levelOfInterest;

    private Set<AttackStrategy> attackStrategies;

    public float getLevelOfInterest() {
        return levelOfInterest;
    }

    public void setLevelOfInterest(float levelOfInterest) {
        this.levelOfInterest = levelOfInterest;
    }

    public Set<AttackStrategy> getAttackStrategies() {
        return attackStrategies;
    }

    public void setAttackStrategies(Set<AttackStrategy> attackStrategies) {
        this.attackStrategies = attackStrategies;
    }
}
