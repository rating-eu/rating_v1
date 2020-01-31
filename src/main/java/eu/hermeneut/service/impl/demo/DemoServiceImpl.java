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
import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.User;
import eu.hermeneut.service.QuestionnaireStatusService;
import eu.hermeneut.service.demo.DemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class DemoServiceImpl implements DemoService {

    @Value("classpath:demo/health-care/1) Threat Agents - Questionnaire Status.json")
    private File questionnaireStatusJSON;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Override
    public boolean loadThreatAgentsQuestionnaireStatus(User user, CompanyProfile companyProfile) {
        try {
            QuestionnaireStatus questionnaireStatus = this.objectMapper.readValue(this.questionnaireStatusJSON, QuestionnaireStatus.class);

            System.out.println("QuestionnaireStatus from JSON:");
            System.out.println("ID: " + questionnaireStatus.getId());

            System.out.println("Target User: " + user.getLogin());
            System.out.println("Target Company: " + companyProfile.getName());

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
