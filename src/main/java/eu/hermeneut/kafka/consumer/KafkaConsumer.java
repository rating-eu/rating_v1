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

package eu.hermeneut.kafka.consumer;

import eu.hermeneut.constant.KafkaListenerFactories;
import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.Criticality;
import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.domain.compact.input.VulnerabilityProfile;
import eu.hermeneut.domain.compact.output.CriticalityNotification;
import eu.hermeneut.domain.compact.output.CriticalityType;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.service.CompanyProfileService;
import eu.hermeneut.service.CriticalityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Profile("kafka")
@Component
public class KafkaConsumer implements KafkaListenerFactories {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumer.class);

    @Autowired
    private CriticalityService criticalityService;

    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @KafkaListener(topics = "${kafka.topic.risk-profile}", containerFactory = RISK_PROFILE)
    public void receiveRiskProfile(RiskProfile riskProfile) {
        LOGGER.debug("Message received on RiskProfile: " + riskProfile);
    }

    @KafkaListener(topics = "${kafka.topic.vulnerability-profile}", containerFactory = VULNERABILITY_PROFILE)
    public void receiveVulnerabilityProfile(VulnerabilityProfile vulnerabilityProfile) {
        LOGGER.debug("Message received on VulnerabilityProfile: " + vulnerabilityProfile);
    }

    @KafkaListener(topics = "${kafka.topic.criticality-notification}", containerFactory = CRITICALITY_NOTIFICATION)
    public void receiveCriticalityNotification(CriticalityNotification criticalityNotification) {
        LOGGER.debug("Message received on CriticalityNotification: " + criticalityNotification);

        Long companyID = criticalityNotification.getCompanyID();
        CompanyProfile companyProfile = this.companyProfileService.findOne(companyID);

        Long attackID = criticalityNotification.getAttackID();
        AttackStrategy attackStrategy = this.attackStrategyService.findOne(attackID);

        CriticalityType type = criticalityNotification.getType();

        float criticalityPercentage = criticalityNotification.getCriticality();

        if (companyProfile != null && attackStrategy != null && type != null && criticalityPercentage >= 0
            && criticalityPercentage <= 1) {
            Criticality criticality = this.criticalityService
                .findOneByCompanyProfileAttackStrategyAndCriticalityType(companyID, attackID, type);

            if (criticality != null) {
                this.criticalityService.delete(criticality.getId());
            }

            criticality = new Criticality();
            criticality.setId(null);
            criticality.setCompanyProfile(companyProfile);
            criticality.setAttackStrategy(attackStrategy);
            criticality.setType(type);
            criticality.setCriticality(criticalityPercentage);

            this.criticalityService.save(criticality);
        }
    }
}
