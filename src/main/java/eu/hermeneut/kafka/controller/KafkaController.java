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

package eu.hermeneut.kafka.controller;

import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.kafka.producer.KafkaProducer;
import eu.hermeneut.service.compact.RiskProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("kafka")
@RestController
public class KafkaController {
    @Autowired
    private KafkaProducer<RiskProfile> kafkaProducer;

    @Autowired
    private RiskProfileService riskProfileService;

    @PostMapping("/kafka/{topicName}/{selfAssessmentID}")
    public void sendRiskProfile(@PathVariable String topicName, @PathVariable Long selfAssessmentID) {
        try {
            RiskProfile riskProfile = this.riskProfileService.getRiskProfile(selfAssessmentID);

            if (riskProfile != null) {
                kafkaProducer.send(topicName, riskProfile);
            }
        } catch (NotFoundException e) {
            e.printStackTrace();
        }
    }
}
