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

package eu.hermeneut.service.impl.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.hermeneut.domain.*;
import eu.hermeneut.service.DirectAssetService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.QuestionnaireStatusService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.demo.DemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DemoServiceImpl implements DemoService {

    @Value("classpath:demo/health-care/1) Threat Agents - Questionnaire Status.json")
    private File threatAgentsQuestionnaireStatusJSON;

    @Value("classpath:demo/health-care/2) Vulnerabilities - Questionnaire Status.json")
    private File vulnerabilitiesQuestionnaireStatusJSON;

    @Value("classpath:demo/health-care/3) Service - SelfAssessment.json")
    private File serviceJSON;

    @Value("classpath:demo/health-care/4) Service.MyAssetsAndCosts - MyAsset.json")
    private File myAssetsAndCostsJSON;

    @Value("classpath:demo/health-care/5) Service.DirectAndIndirectAssets - DirectAsset.json")
    private File directAndIndirectAssetsJSON;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private DirectAssetService directAssetService;

    @Override
    public boolean loadThreatAgentsQuestionnaireStatus(User user, CompanyProfile companyProfile) {
        return this.loadQuestionnaireStatus(this.threatAgentsQuestionnaireStatusJSON, user, companyProfile);
    }

    @Override
    public boolean loadVulnerabilitiesQuestionnaireStatus(User user, CompanyProfile companyProfile) {
        return this.loadQuestionnaireStatus(this.vulnerabilitiesQuestionnaireStatusJSON, user, companyProfile);
    }

    @Override
    public boolean loadService(User user, CompanyProfile companyProfile) {
        try {
            SelfAssessment service = this.objectMapper.readValue(this.serviceJSON, SelfAssessment.class);

            service.setUser(user);
            service.setCompanyProfile(companyProfile);
            service.setCompanyGroups(new HashSet<>());

            SelfAssessment demoService = this.selfAssessmentService.save(service);

            if (demoService != null) {
                MyAsset[] myAssets = this.objectMapper.readValue(this.myAssetsAndCostsJSON, MyAsset[].class);
                DirectAsset[] directAssets = this.objectMapper.readValue(this.directAndIndirectAssetsJSON, DirectAsset[].class);

                /*
                 *  1) Take note of the old MyAsset.ID
                 *  2) Set the IDs to null
                 *  3) Set the ref to the Service (SelfAssessment)
                 *  4) Persist the MyAssets and map the new ID to the old one
                 */

                Map<Long, Long> oldToNewMyAssetIDsMap = new HashMap<>();
                List<MyAsset> demoMyAssets = new ArrayList<>();

                for (MyAsset myAsset : myAssets) {
                    Long oldID = myAsset.getId();

                    myAsset.setId(null);
                    myAsset.selfAssessment(demoService);

                    final MyAsset persisted = this.myAssetService.save(myAsset);
                    demoMyAssets.add(persisted);

                    Long newID = persisted.getId();

                    oldToNewMyAssetIDsMap.put(oldID, newID);
                }

                /*
                 *  5) Set the IDs of Direct and Indirect assets to null
                 *  6) Set the ref of Direct and Indirect assets to the new MyAsset.ID
                 */

                for (DirectAsset directAsset : directAssets) {
                    directAsset.setId(null);

                    Long oldMyAssetID = directAsset.getMyAsset().getId();
                    Long newMyAssetID = oldToNewMyAssetIDsMap.get(oldMyAssetID);

                    directAsset.getMyAsset().setId(newMyAssetID);

                    Set<IndirectAsset> indirectAssets = directAsset.getEffects();

                    if (indirectAssets != null && !indirectAssets.isEmpty()) {
                        for (IndirectAsset indirectAsset : indirectAssets) {
                            Long oldMAID = indirectAsset.getMyAsset().getId();
                            Long newMAID = oldToNewMyAssetIDsMap.get(oldMAID);

                            indirectAsset.getMyAsset().setId(newMAID);
                        }
                    }

                    this.directAssetService.save(directAsset);
                }
            }

            return demoService != null;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }

    private boolean loadQuestionnaireStatus(File fileJSON, User user, CompanyProfile companyProfile) {
        try {
            QuestionnaireStatus questionnaireStatus = this.objectMapper.readValue(fileJSON, QuestionnaireStatus.class);

            /*
             * 1) Change Reference to the new User
             * 2) Change Reference to the new CompanyProfile
             * 3) Change Reference of MyAnswers to the new User
             */
            questionnaireStatus.setUser(user);
            questionnaireStatus.setCompanyProfile(companyProfile);

            questionnaireStatus.getAnswers().stream().forEach((myAnswer) -> {
                myAnswer.setUser(user);
            });

            QuestionnaireStatus demo = this.questionnaireStatusService.save(questionnaireStatus);

            return demo != null;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }
}
