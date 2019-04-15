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

package eu.hermeneut.kafka.service.impl;

import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.kafka.config.KafkaTopic;
import eu.hermeneut.kafka.producer.KafkaProducer;
import eu.hermeneut.kafka.service.MessageSenderService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.compact.RiskProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Profile("kafka")
@Service
@Transactional
public class MessageSenderServiceImpl implements MessageSenderService {

    @Autowired
    private RiskProfileService riskProfileService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private KafkaTopic kafkaTopic;

    @Autowired
    private KafkaProducer<RiskProfile> kafkaProducer;

    @Async
    @Override
    public void sendRiskProfile(Long selfAssessmentID) throws NullInputException, NotFoundException {
        if (selfAssessmentID == null) {
            throw new NullInputException("SelfAssessmentID CANNOT BE NULL!");
        }

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with id: " + selfAssessmentID + " NOT FOUND!");
        }

        RiskProfile riskProfile = this.riskProfileService.getRiskProfile(selfAssessmentID);

        this.kafkaProducer.send(this.kafkaTopic.getRiskProfile(), riskProfile);
    }
}
