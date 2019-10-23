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

package eu.hermeneut.web.rest.chart;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.ContainerType;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AnswerService;
import eu.hermeneut.service.MyAnswerService;
import eu.hermeneut.service.QuestionService;
import eu.hermeneut.service.QuestionnaireStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chart")
public class ChartController {

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private MyAnswerService myAnswerService;

    @PostMapping("/radar/vulnerability/{questionnaireStatusID}")
    public Map<Long/*VulnerabilityArea.ID*/, Map<ContainerType, Double/*Vulnerability*/>> getVulnerabilityRadar(@PathVariable Long questionnaireStatusID, @RequestBody List<VulnerabilityArea> areas) throws NotFoundException {

        QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findOne(questionnaireStatusID);

        if (questionnaireStatus == null) {
            throw new NotFoundException("QuestionnaireStatus not found!");
        }

        Questionnaire questionnaire = questionnaireStatus.getQuestionnaire();

        if (questionnaire == null) {
            throw new NotFoundException("Questionnaire not found!");
        }

        QuestionnairePurpose purpose = questionnaire.getPurpose();

        if (purpose == null) {
            throw new NotFoundException("QuestionnairePurpose not found!");
        } else if (!QuestionnairePurpose.SELFASSESSMENT.equals(purpose)) {
            throw new IllegalArgumentException("QuestionnairePurpose is not SelfAssessment!");
        }

        Status status = questionnaireStatus.getStatus();

        if (status == null) {
            throw new IllegalArgumentException("Status must not be null!");
        } else if (!Status.FULL.equals(status)) {
            throw new IllegalArgumentException("Status must be FULL");
        }

        List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(questionnaireStatusID);

        if (myAnswers == null || myAnswers.isEmpty()) {
            throw new NotFoundException("MyAnswers not found!");
        }

        List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);

        if (questions == null || questions.isEmpty()) {
            throw new NotFoundException("Questions not found!");
        }

        // Keep only the Questions belonging to a certain VulnerabilityArea
        if (areas != null && !areas.isEmpty()) {
            Map<Long, VulnerabilityArea> areasMap = areas.stream().parallel().collect(Collectors.toMap(
                VulnerabilityArea::getId,
                Function.identity()
            ));

            questions = questions.stream().parallel().filter((question) -> {
                Set<VulnerabilityArea> vulnerabilityAreas = question.getAreas();

                if (vulnerabilityAreas != null && !vulnerabilityAreas.isEmpty()) {
                    return vulnerabilityAreas.stream().parallel().anyMatch(vulnerabilityArea -> areasMap.containsKey(vulnerabilityArea.getId()));
                } else {
                    return false;
                }
            }).collect(Collectors.toList());
        }

        Map<Long, List<Question>> questionsByAreaIDMap = questions.stream().parallel()
            .flatMap(question -> question.getAreas().stream().parallel()
                .map(area -> new AbstractMap.SimpleEntry<VulnerabilityArea, Question>(area, question)))
            .collect(Collectors.groupingBy(o -> o.getKey().getId(), Collectors.mapping(Map.Entry::getValue, Collectors.toList())));


        // TODO Calculate the vulnerability for each AREA by the corresponding MyANswers previously stored.

        Map<Long/*VulnerabilityArea.ID*/, Map<ContainerType, Double/*Vulnerability*/>> vulnerabilitiesByAreaDataSet = new HashMap<>();

        if (areas != null && !areas.isEmpty()) {
            Random random = new Random();

            for (VulnerabilityArea area : areas) {
                Map<ContainerType, Double> vulnerabilities = new HashMap<>();

                vulnerabilities.put(ContainerType.HUMAN, random.nextDouble() * 5 + 1);
                vulnerabilities.put(ContainerType.IT, random.nextDouble() * 5 + 1);
                vulnerabilities.put(ContainerType.PHYSICAL, random.nextDouble() * 5 + 1);

                vulnerabilitiesByAreaDataSet.put(area.getId(), vulnerabilities);
            }
        }

        return vulnerabilitiesByAreaDataSet;
    }
}
