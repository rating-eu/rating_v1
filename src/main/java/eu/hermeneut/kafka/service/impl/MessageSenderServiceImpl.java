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

import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.domain.compact.input.VulnerabilityProfile;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.kafka.config.KafkaTopic;
import eu.hermeneut.kafka.producer.KafkaProducer;
import eu.hermeneut.kafka.service.MessageSenderService;
import eu.hermeneut.service.CompanyProfileService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.compact.RiskProfileService;
import eu.hermeneut.service.compact.VulnerabilityProfileService;
import eu.hermeneut.service.dashboard.CompanyBoardStatusService;
import eu.hermeneut.service.dashboard.RiskBoardStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Profile("kafka")
@Service
@Transactional
public class MessageSenderServiceImpl implements MessageSenderService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageSenderService.class);

    @Autowired
    private RiskProfileService riskProfileService;

    @Autowired
    private VulnerabilityProfileService vulnerabilityProfileService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private KafkaTopic kafkaTopic;

    @Autowired
    private KafkaProducer<RiskProfile> kafkaRiskProfileProducer;

    @Autowired
    private KafkaProducer<VulnerabilityProfile> kafkaVulnerabilityProfileProducer;

    @Autowired
    private CompanyBoardStatusService companyBoardStatusService;

    @Autowired
    private RiskBoardStatusService riskBoardStatusService;

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

        if (this.riskBoardStatusService.getAssetClusteringStatus(selfAssessmentID).equals(Status.FULL) &&
            this.riskBoardStatusService.getImpactEvaluationStatus(selfAssessmentID).equals(Status.FULL)) {

            LOGGER.warn("Sending RiskProfile...");

            RiskProfile riskProfile = this.riskProfileService.getRiskProfile(selfAssessmentID);

            this.kafkaRiskProfileProducer.send(this.kafkaTopic.getRiskProfile(), riskProfile);
        }
    }

    @Async
    @Override
    public void sendVulnerabilityProfile(Long companyProfileID) throws NullInputException, NotFoundException {
        if (companyProfileID == null) {
            throw new NullInputException("CompanyProfileID CANNOT BE NULL");
        }

        CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

        if (companyProfile == null) {
            throw new NotFoundException("CompanyProfile NOT FOUND!");
        }

        if (this.companyBoardStatusService.getIdentifyThreatAgentsStatus(companyProfileID).equals(Status.FULL) &&
            this.companyBoardStatusService.getAssessVulnerabilitiesStatus(companyProfileID).equals(Status.FULL)) {

            LOGGER.warn("Sending VulnerabilityProfile...");

            VulnerabilityProfile vulnerabilityProfile = this.vulnerabilityProfileService.getVulnerabilityProfile(companyProfileID);

            this.kafkaVulnerabilityProfileProducer.send(this.kafkaTopic.getVulnerabilityProfile(), vulnerabilityProfile);
        }
    }
}
