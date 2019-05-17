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

package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.aop.annotation.KafkaRiskProfileHook;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.QuestionnaireStatusService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing QuestionnaireStatus.
 */
@RestController
@RequestMapping("/api")
public class QuestionnaireStatusResource {

    private final Logger log = LoggerFactory.getLogger(QuestionnaireStatusResource.class);

    private static final String ENTITY_NAME = "questionnaireStatus";

    private final QuestionnaireStatusService questionnaireStatusService;

    public QuestionnaireStatusResource(QuestionnaireStatusService questionnaireStatusService) {
        this.questionnaireStatusService = questionnaireStatusService;
    }

    /**
     * POST  /questionnaire-statuses : Create a new questionnaireStatus.
     *
     * @param questionnaireStatus the questionnaireStatus to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionnaireStatus, or with status 400 (Bad Request) if the questionnaireStatus has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/questionnaire-statuses")
    @Timed
    //@PreAuthorize("@questionnaireStatusGuardian.isCISO(#questionnaireStatus) || @questionnaireStatusGuardian.isExternal(#questionnaireStatus) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    @KafkaRiskProfileHook
    public ResponseEntity<QuestionnaireStatus> createQuestionnaireStatus(@Valid @RequestBody QuestionnaireStatus questionnaireStatus) throws URISyntaxException {
        log.debug("REST request to save QuestionnaireStatus : {}", questionnaireStatus);
        if (questionnaireStatus.getId() != null) {
            throw new BadRequestAlertException("A new questionnaireStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }

        //Set the current date for the questionnaire status (created and modified)
        ZonedDateTime now = ZonedDateTime.now();
        questionnaireStatus.setCreated(now);
        questionnaireStatus.setModified(now);

        QuestionnaireStatus result = questionnaireStatusService.save(questionnaireStatus);

        return ResponseEntity.created(new URI("/api/questionnaire-statuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /questionnaire-statuses : Updates an existing questionnaireStatus.
     *
     * @param questionnaireStatus the questionnaireStatus to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionnaireStatus,
     * or with status 400 (Bad Request) if the questionnaireStatus is not valid,
     * or with status 500 (Internal Server Error) if the questionnaireStatus couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/questionnaire-statuses")
    @Timed
    //@PreAuthorize("@questionnaireStatusGuardian.isCISO(#questionnaireStatus) || @questionnaireStatusGuardian.isExternal(#questionnaireStatus) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    @KafkaRiskProfileHook
    public ResponseEntity<QuestionnaireStatus> updateQuestionnaireStatus(@Valid @RequestBody QuestionnaireStatus questionnaireStatus) throws URISyntaxException {
        log.debug("REST request to update QuestionnaireStatus : {}", questionnaireStatus);
        if (questionnaireStatus.getId() == null) {
            return createQuestionnaireStatus(questionnaireStatus);
        }

        //Set the current date for the questionnaire status (modified)
        ZonedDateTime now = ZonedDateTime.now();
        questionnaireStatus.setModified(now);

        QuestionnaireStatus result = questionnaireStatusService.save(questionnaireStatus);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionnaireStatus.getId().toString()))
            .body(result);
    }

    /**
     * GET  /questionnaire-statuses : get all the questionnaireStatuses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaireStatuses in body
     */
    @GetMapping("/questionnaire-statuses")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public List<QuestionnaireStatus> getAllQuestionnaireStatuses() {
        log.debug("REST request to get all QuestionnaireStatuses");
        return questionnaireStatusService.findAll();
    }

    /**
     * GET  /questionnaire-statuses : get all the questionnaireStatuses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaireStatuses in body
     */
    @GetMapping("/questionnaire-statuses/company-profile/{companyProfileID}")
    @Timed
    @PreAuthorize("@companyProfileGuardian.isCISO(#companyProfileID) || @companyProfileGuardian.isExternal(#companyProfileID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    public List<QuestionnaireStatus> getAllQuestionnaireStatusesByCompanyProfile(@PathVariable Long companyProfileID) {
        log.debug("REST request to get all QuestionnaireStatuses by CompanyProfile");
        return questionnaireStatusService.findAllByCompanyProfile(companyProfileID);
    }

    /**
     * GET  /questionnaire-statuses : get all the questionnaireStatuses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaireStatuses in body
     */
    @GetMapping("/questionnaire-statuses/company-profile/{companyProfileID}/user/{userID}")
    @Timed
    @PreAuthorize("@companyProfileGuardian.isCISO(#companyProfileID) || @companyProfileGuardian.isExternal(#companyProfileID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    public List<QuestionnaireStatus> getAllQuestionnaireStatusesByCompanyProfileAndUser(@PathVariable Long companyProfileID, @PathVariable Long userID) {
        log.debug("REST request to get all QuestionnaireStatuses by self assessment and user");
        return questionnaireStatusService.findAllByCompanyProfileAndUser(companyProfileID, userID);
    }

    @GetMapping("/questionnaire-statuses/company-profile/{companyProfileID}/purpose/{questionnairePurpose}")
    @Timed
    @PreAuthorize("@companyProfileGuardian.isCISO(#companyProfileID) || @companyProfileGuardian.isExternal(#companyProfileID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    public List<QuestionnaireStatus> getQuestionnaireStatusByCompanyProfileAndQuestionnairePurpose(@PathVariable Long companyProfileID, @PathVariable String questionnairePurpose) {
        log.debug("REST request to get QuestionnaireStatus by CompanyProfile and questionnairePurpose");
        log.debug("CompanyProfile: " + companyProfileID);
        log.debug("QuestionnairePurpose: " + questionnairePurpose);

        QuestionnairePurpose purpose = QuestionnairePurpose.valueOf(questionnairePurpose);
        log.debug("Purpose enum: " + purpose);

        List<QuestionnaireStatus> questionnaireStatuses = questionnaireStatusService.findAllByCompanyProfileAndQuestionnairePurpose(companyProfileID, purpose);
        return questionnaireStatuses;
    }

    /**
     * GET  /questionnaire-statuses : get all the questionnaireStatuses by Role CompanyProfile and Questionnaire.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaireStatuses in body
     */
    @GetMapping("/questionnaire-statuses/company-profile/{companyProfileID}/questionnaire/{questionnaireID}/role/{role}")
    @Timed
    @PreAuthorize("@companyProfileGuardian.isCISO(#companyProfileID) || @companyProfileGuardian.isExternal(#companyProfileID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    public List<QuestionnaireStatus> getAllQuestionnaireStatusesByCompanyProfileQuestionnaireAndRole(@PathVariable Long companyProfileID, @PathVariable Long questionnaireID, @PathVariable Role role) {
        log.debug("REST request to get all QuestionnaireStatuses by Role CompanyProfile and Questionnaire");
        return questionnaireStatusService.findAllByRoleCompanyProfileAndQuestionnaire(role, companyProfileID, questionnaireID);
    }

    /**
     * GET  /questionnaire-statuses/:id : get the "id" questionnaireStatus.
     *
     * @param id the id of the questionnaireStatus to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionnaireStatus, or with status 404 (Not Found)
     */
    @GetMapping("/questionnaire-statuses/{id}")
    @Timed
    @PreAuthorize("@questionnaireStatusGuardian.isCISO(#id) || @questionnaireStatusGuardian.isExternal(#id) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    public ResponseEntity<QuestionnaireStatus> getQuestionnaireStatus(@PathVariable Long id) {
        log.debug("REST request to get QuestionnaireStatus : {}", id);
        QuestionnaireStatus questionnaireStatus = questionnaireStatusService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionnaireStatus));
    }

    @GetMapping("/questionnaire-statuses/company-profile/{companyProfileID}/purpose/{questionnairePurpose}/user/{userID}")
    @Timed
    @PreAuthorize("@companyProfileGuardian.isCISO(#companyProfileID) || @companyProfileGuardian.isExternal(#companyProfileID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    public List<QuestionnaireStatus> getQuestionnaireStatusByCompanyProfileQuestionnairePurposeAndUser(@PathVariable Long companyProfileID, @PathVariable QuestionnairePurpose questionnairePurpose, @PathVariable Long userID) {
        log.debug("REST request to get QuestionnaireStatus by CompanyProfile and questionnairePurpose");
        log.debug("CompanyProfile: " + companyProfileID);
        log.debug("QuestionnairePurpose: " + questionnairePurpose);

        List<QuestionnaireStatus> questionnaireStatuses = questionnaireStatusService.findAllByCompanyProfileQuestionnairePurposeAndUser(companyProfileID, questionnairePurpose, userID);
        return questionnaireStatuses;
    }

    /**
     * DELETE  /questionnaire-statuses/:id : delete the "id" questionnaireStatus.
     *
     * @param id the id of the questionnaireStatus to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/questionnaire-statuses/{id}")
    @Timed
    @PreAuthorize("@questionnaireStatusGuardian.isCISO(#id) || @questionnaireStatusGuardian.isExternal(#id) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteQuestionnaireStatus(@PathVariable Long id) {
        log.debug("REST request to delete QuestionnaireStatus : {}", id);
        questionnaireStatusService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
