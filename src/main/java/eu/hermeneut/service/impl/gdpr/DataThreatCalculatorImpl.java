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

package eu.hermeneut.service.impl.gdpr;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.*;
import eu.hermeneut.service.GDPRQuestionService;
import eu.hermeneut.service.gdpr.DataThreatCalculator;
import eu.hermeneut.utils.range.DiscreteRange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class DataThreatCalculatorImpl implements DataThreatCalculator {
    @Autowired
    private GDPRQuestionService questionService;

    @Override
    public DataThreat calculateDataThreat(DataOperation operation, ThreatArea area, List<GDPRQuestion> questions, List<GDPRMyAnswer> myAnswers) {
        if (area == null) {
            throw new IllegalArgumentException("ThreatArea must be NOT NULL!");
        } else if (questions == null || questions.isEmpty()) {
            throw new IllegalArgumentException("Questions must be NOT NULL and NOT EMPTY!");
        } else if (myAnswers.size() > questions.size()) {
            throw new IllegalArgumentException("MyAnswers must be at most equal to the questions' size!");
        }

        Map<Long/*Question.ID*/, GDPRQuestion> questionsMap = new HashMap<>();

        // Check that all the Questions belong to the specified ThreatArea
        questions.stream().parallel().forEach((question) -> {
            if (!question.getThreatArea().equals(area)) {
                throw new IllegalArgumentException("All the questions must BELONG to the GIVEN ThreatArea!");
            } else {
                // Populate the Map
                questionsMap.put(question.getId(), question);
            }
        });

        Map<Long/*Question.ID*/, GDPRMyAnswer> myAnswersMap = new HashMap<>();

        // Check that all the MyAnswers are linked to one of the given Questions.
        myAnswers.stream().parallel().forEach((myAnswer) -> {
            if (myAnswer != null && myAnswer.getQuestion() != null) {
                GDPRQuestion question = myAnswer.getQuestion();

                if (!questionsMap.containsKey(question.getId())) {
                    throw new IllegalArgumentException("All the myAnswers must be LINKED to one of the GIVEN Questions!");
                } else {
                    if (myAnswersMap.containsKey(question.getId())) {
                        throw new IllegalArgumentException("Multiple myAnswers for the same Quesion are not allowed!");
                    } else {
                        myAnswersMap.put(question.getId(), myAnswer);
                    }
                }
            }
        });

        DiscreteRange yesCountRange = new DiscreteRange(0, questions.size());
        DiscreteRange likelihoodRange = new DiscreteRange(DataThreatLikelihood.LOW.getValue(), DataThreatLikelihood.HIGH.getValue());

        DataThreat dataThreat = new DataThreat();
        dataThreat.setOperation(operation);
        dataThreat.setThreatArea(area);

        long yesCount = myAnswers.stream().parallel().filter(myAnswer -> AnswerValue.YES.equals(myAnswer.getAnswer().getAnswerValue())).count();
        int likelihoodValue = yesCountRange.convert((int) yesCount, likelihoodRange);

        DataThreatLikelihood likelihood = DataThreatLikelihood.getByValue(likelihoodValue);

        dataThreat.setLikelihood(likelihood);

        return dataThreat;
    }

    @Override
    public Set<DataThreat> calculateDataThreats(GDPRQuestionnaireStatus questionnaireStatus) {
        if (questionnaireStatus == null) {
            throw new IllegalArgumentException("QuestionnaireStatus must be NOT NULL!");
        } else if (questionnaireStatus.getQuestionnaire() == null) {
            throw new IllegalArgumentException("Questionnaire must be NOT NULL!");
        } else if (!questionnaireStatus.getQuestionnaire().getPurpose().equals(GDPRQuestionnairePurpose.THREAT_LIKELIHOOD)) {
            throw new IllegalArgumentException("Questionnaire.Purpose must be THREAT_LIKELIHOOD!");
        } else if (questionnaireStatus.getOperation() == null) {
            throw new IllegalArgumentException("DataOperation must be NOT NULL!");
        }

        Set<DataThreat> dataThreats = new HashSet<>();
        Status status = questionnaireStatus.getStatus();

        switch (status) {
            case PENDING:
            case FULL: {
                DataOperation operation = questionnaireStatus.getOperation();
                GDPRQuestionnaire questionnaire = questionnaireStatus.getQuestionnaire();
                List<GDPRQuestion> questions = this.questionService.findAllByQuestionnaire(questionnaire.getId());
                Set<GDPRMyAnswer> myAnswers = questionnaireStatus.getAnswers();

                if (myAnswers == null || myAnswers.isEmpty()) {
                    throw new IllegalArgumentException("MyAnswers must be NOT NULL && NOT EMPTY!");
                }

                Map<ThreatArea, List<GDPRQuestion>> questionsByThreatArea = questions.stream().parallel()
                    .collect(Collectors.groupingBy(question -> question.getThreatArea()));

                Map<Long/*Question.ID*/, GDPRMyAnswer> myAnswerByQuestionIDMap = myAnswers.stream().parallel()
                    .collect(Collectors.toMap(
                        (myAnswer) -> myAnswer.getQuestion().getId(),
                        Function.identity())
                    );

                questionsByThreatArea.entrySet().stream().parallel()
                    .forEach(threatAreaQuestionsEntry -> {
                        ThreatArea area = threatAreaQuestionsEntry.getKey();
                        List<GDPRQuestion> areaQuestions = threatAreaQuestionsEntry.getValue();
                        List<GDPRMyAnswer> gdprMyAnswers = new ArrayList<>();

                        areaQuestions.stream().parallel()
                            .forEach((question) -> {
                                if (myAnswerByQuestionIDMap.containsKey(question.getId())) {
                                    gdprMyAnswers.add(myAnswerByQuestionIDMap.get(question.getId()));
                                }
                            });

                        final DataThreat dataThreat = this.calculateDataThreat(operation, area, areaQuestions, gdprMyAnswers);
                        dataThreats.add(dataThreat);
                    });

                break;
            }
            case EMPTY:
            default: {
                // Do Nothing
                // Return the Empty Set of DataThreats
            }
        }

        return dataThreats;
    }

    @Override
    public OverallDataThreat calculateOverallDataThreat(Set<DataThreat> dataThreats) {
        Map<ThreatArea, DataThreat> threatsMap = dataThreats.stream().collect(Collectors.toMap(o -> o.getThreatArea(), Function.identity()));

        if (threatsMap.size() != ThreatArea.values().length) {
            throw new IllegalArgumentException("A DataThreat for each ThreatArea is required!");
        }

        OverallDataThreat overallDataThreat = new OverallDataThreat();
        overallDataThreat.setThreats(dataThreats);

        //Calculate the OverallLikelihood
        int overall = 0;

        DataOperation operation = null;

        for (DataThreat threat : dataThreats) {
            overall += threat.getLikelihood().getValue();

            operation = threat.getOperation();
        }

        overallDataThreat.setOperation(operation);

        DataThreatLikelihood likelihood = DataThreatLikelihood.LOW;

        // TODO Think about something more dynamic
        if (overall <= 5) {
            likelihood = DataThreatLikelihood.LOW;
        } else if (overall <= 8) {
            likelihood = DataThreatLikelihood.MEDIUM;
        } else if (overall <= 12) {
            likelihood = DataThreatLikelihood.HIGH;
        }

        overallDataThreat.setLikelihood(likelihood);

        return overallDataThreat;
    }
}
