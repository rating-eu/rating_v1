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

package eu.hermeneut.service.impl;

import eu.hermeneut.domain.MyCompany;
import eu.hermeneut.domain.User;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;
import eu.hermeneut.service.MyAnswerService;
import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.service.QuestionnaireStatusService;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.repository.QuestionnaireStatusRepository;
import eu.hermeneut.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service Implementation for managing QuestionnaireStatus.
 */
@Service
//@Transactional
public class QuestionnaireStatusServiceImpl implements QuestionnaireStatusService {

    private final Logger log = LoggerFactory.getLogger(QuestionnaireStatusServiceImpl.class);

    private final QuestionnaireStatusRepository questionnaireStatusRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MyCompanyService myCompanyService;

    @Autowired
    private MyAnswerService myAnswerService;

    public QuestionnaireStatusServiceImpl(QuestionnaireStatusRepository questionnaireStatusRepository) {
        this.questionnaireStatusRepository = questionnaireStatusRepository;
    }

    /**
     * Save a questionnaireStatus.
     *
     * @param questionnaireStatus the entity to save
     * @return the persisted entity
     */
    @Override
    //@Transactional(propagation = Propagation.REQUIRES_NEW)
    public QuestionnaireStatus save(QuestionnaireStatus questionnaireStatus) {
        log.debug("Request to save QuestionnaireStatus : {}", questionnaireStatus);

        if (questionnaireStatus.getId() != null) {
            QuestionnaireStatus existingQStatus = this.questionnaireStatusRepository
                .findOne(questionnaireStatus.getId());

            if (existingQStatus != null) {
                // Delete the Old MyAnswers
                existingQStatus.getAnswers().clear();
                this.questionnaireStatusRepository.save(existingQStatus);
            }
        }

        if (questionnaireStatus.getAnswers() != null && !questionnaireStatus.getAnswers().isEmpty()) {
            questionnaireStatus.getAnswers().stream().forEach((myAnswer) -> {
                myAnswer.setQuestionnaireStatus(questionnaireStatus);
            });
        }

        if (questionnaireStatus.getRefinement() != null && !questionnaireStatus.getRefinement().getAnswers().isEmpty()) {

            QuestionnaireStatus refinement = questionnaireStatus.getRefinement();

            if (refinement.getId() != null) {
                QuestionnaireStatus existingRefinement = this.questionnaireStatusRepository.findOne(refinement.getId());

                if (existingRefinement != null) {
                    // Delete the Old MyAnswers
                    existingRefinement.getAnswers().clear();
                    this.questionnaireStatusRepository.save(existingRefinement);
                }
            }

            refinement.getAnswers().stream().forEach((myAnswer) -> {
                myAnswer.setQuestionnaireStatus(refinement);
            });
        }

        QuestionnaireStatus result = questionnaireStatusRepository.save(questionnaireStatus);
        log.debug("Saved QuestionnaireStatus", result);

        return result;
    }

    /**
     * Get all the questionnaireStatuses.
     *
     * @return the list of entities
     */
    @Override
    public List<QuestionnaireStatus> findAll() {
        log.debug("Request to get all QuestionnaireStatuses");
        return questionnaireStatusRepository.findAll();
    }

    /**
     * Get one questionnaireStatus by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    public QuestionnaireStatus findOne(Long id) {
        log.debug("Request to get QuestionnaireStatus : {}", id);
        return questionnaireStatusRepository.findOne(id);
    }

    /**
     * Delete the questionnaireStatus by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete QuestionnaireStatus : {}", id);
        questionnaireStatusRepository.delete(id);
    }

    @Override
    public List<QuestionnaireStatus> findAllByCompanyProfileAndUser(Long companyProfileID, Long userID) {
        return this.questionnaireStatusRepository.findAllByCompanyProfileAndUser(companyProfileID, userID);
    }

    @Override
    public List<QuestionnaireStatus> findAllByRoleCompanyProfileAndQuestionnaire(Role role, Long companyProfileID, Long questionnaireID) {
        return this.questionnaireStatusRepository.findAllByRoleCompanyProfileAndQuestionnaire(role, companyProfileID, questionnaireID);
    }

    @Override
    public List<QuestionnaireStatus> findAllByCompanyProfile(Long companyProfileID) {
        return this.questionnaireStatusRepository.findAllByCompanyProfile(companyProfileID);
    }

    @Override
    public List<QuestionnaireStatus> findAllByCompanyProfileAndQuestionnairePurpose(Long companyProfileID, QuestionnairePurpose purpose) {
        return this.questionnaireStatusRepository.findAllByCompanyProfileAndQuestionnairePurpose(companyProfileID, purpose);
    }

    @Override
    public List<QuestionnaireStatus> findAllByCompanyProfileRoleAndQuestionnairePurpose(Long companyProfileID, Role role, QuestionnairePurpose purpose) {
        return this.questionnaireStatusRepository.findAllByCompanyProfileRoleAndQuestionnairePurpose(companyProfileID, role, purpose);
    }

    @Override
    public List<QuestionnaireStatus> findAllByCompanyProfileQuestionnairePurposeAndCISOUser(Long companyProfileID, QuestionnairePurpose questionnairePurpose, Long userID) {
        return this.questionnaireStatusRepository.findAllByCompanyProfileQuestionnairePurposeAndCISOUser(companyProfileID, questionnairePurpose, userID);
    }

    @Override
    public List<QuestionnaireStatus> findAllByCompanyProfileQuestionnairePurposeAndExternalUser(Long companyProfileID, QuestionnairePurpose questionnairePurpose, Long externalID) {
        return this.questionnaireStatusRepository.findAllByCompanyProfileQuestionnairePurposeAndExternalUser(companyProfileID, questionnairePurpose, externalID);
    }

    @Override
    public List<QuestionnaireStatus> findAllByCurrentUserAndQuestionnairePurpose(QuestionnairePurpose questionnairePurpose) {
        User currentUser = this.userService.getUserWithAuthorities().orElse(null);

        if (currentUser != null) {
            MyCompany myCompany = this.myCompanyService.findOneByUser(currentUser.getId());

            if (myCompany != null && myCompany.getCompanyProfile() != null) {
                if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.CISO)) {
                    return this.findAllByCompanyProfileQuestionnairePurposeAndCISOUser(myCompany.getCompanyProfile().getId(), questionnairePurpose, currentUser.getId());
                } else if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.EXTERNAL_AUDIT)) {
                    return this.findAllByCompanyProfileQuestionnairePurposeAndExternalUser(myCompany.getCompanyProfile().getId(), questionnairePurpose, currentUser.getId());
                }
            }
        }

        return null;
    }


}
