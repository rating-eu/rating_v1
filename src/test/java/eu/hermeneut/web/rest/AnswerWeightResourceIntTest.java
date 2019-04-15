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

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.AnswerWeight;
import eu.hermeneut.domain.enumeration.AnswerLikelihood;
import eu.hermeneut.repository.AnswerWeightRepository;
import eu.hermeneut.service.AnswerWeightService;
import eu.hermeneut.repository.search.AnswerWeightSearchRepository;
import eu.hermeneut.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static eu.hermeneut.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import eu.hermeneut.domain.enumeration.QuestionType;
/**
 * Test class for the AnswerWeightResource REST controller.
 *
 * @see AnswerWeightResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class AnswerWeightResourceIntTest {

    private static final AnswerLikelihood DEFAULT_ATTACK_STRATEGY_LIKELIHOOD = AnswerLikelihood.LOW;
    private static final AnswerLikelihood UPDATED_ATTACK_STRATEGY_LIKELIHOOD = AnswerLikelihood.LOW_MEDIUM;

    private static final QuestionType DEFAULT_QUESTION_TYPE = QuestionType.REGULAR;
    private static final QuestionType UPDATED_QUESTION_TYPE = QuestionType.RELEVANT;

    private static final Float DEFAULT_WEIGHT = 1F;
    private static final Float UPDATED_WEIGHT = 2F;

    @Autowired
    private AnswerWeightRepository answerWeightRepository;

    @Autowired
    private AnswerWeightService answerWeightService;

    @Autowired
    private AnswerWeightSearchRepository answerWeightSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAnswerWeightMockMvc;

    private AnswerWeight answerWeight;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AnswerWeightResource answerWeightResource = new AnswerWeightResource(answerWeightService);
        this.restAnswerWeightMockMvc = MockMvcBuilders.standaloneSetup(answerWeightResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AnswerWeight createEntity(EntityManager em) {
        AnswerWeight answerWeight = new AnswerWeight()
            .likelihood(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD)
            .questionType(DEFAULT_QUESTION_TYPE)
            .weight(DEFAULT_WEIGHT);
        return answerWeight;
    }

    @Before
    public void initTest() {
        answerWeightSearchRepository.deleteAll();
        answerWeight = createEntity(em);
    }

    @Test
    @Transactional
    public void createAnswerWeight() throws Exception {
        int databaseSizeBeforeCreate = answerWeightRepository.findAll().size();

        // Create the AnswerWeight
        restAnswerWeightMockMvc.perform(post("/api/answer-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(answerWeight)))
            .andExpect(status().isCreated());

        // Validate the AnswerWeight in the database
        List<AnswerWeight> answerWeightList = answerWeightRepository.findAll();
        assertThat(answerWeightList).hasSize(databaseSizeBeforeCreate + 1);
        AnswerWeight testAnswerWeight = answerWeightList.get(answerWeightList.size() - 1);
        assertThat(testAnswerWeight.getLikelihood()).isEqualTo(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD);
        assertThat(testAnswerWeight.getQuestionType()).isEqualTo(DEFAULT_QUESTION_TYPE);
        assertThat(testAnswerWeight.getWeight()).isEqualTo(DEFAULT_WEIGHT);

        // Validate the AnswerWeight in Elasticsearch
        AnswerWeight answerWeightEs = answerWeightSearchRepository.findOne(testAnswerWeight.getId());
        assertThat(answerWeightEs).isEqualToIgnoringGivenFields(testAnswerWeight);
    }

    @Test
    @Transactional
    public void createAnswerWeightWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = answerWeightRepository.findAll().size();

        // Create the AnswerWeight with an existing ID
        answerWeight.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnswerWeightMockMvc.perform(post("/api/answer-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(answerWeight)))
            .andExpect(status().isBadRequest());

        // Validate the AnswerWeight in the database
        List<AnswerWeight> answerWeightList = answerWeightRepository.findAll();
        assertThat(answerWeightList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllAnswerWeights() throws Exception {
        // Initialize the database
        answerWeightRepository.saveAndFlush(answerWeight);

        // Get all the answerWeightList
        restAnswerWeightMockMvc.perform(get("/api/answer-weights?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(answerWeight.getId().intValue())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD.toString())))
            .andExpect(jsonPath("$.[*].questionType").value(hasItem(DEFAULT_QUESTION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    @Test
    @Transactional
    public void getAnswerWeight() throws Exception {
        // Initialize the database
        answerWeightRepository.saveAndFlush(answerWeight);

        // Get the answerWeight
        restAnswerWeightMockMvc.perform(get("/api/answer-weights/{id}", answerWeight.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(answerWeight.getId().intValue()))
            .andExpect(jsonPath("$.likelihood").value(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD.toString()))
            .andExpect(jsonPath("$.questionType").value(DEFAULT_QUESTION_TYPE.toString()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAnswerWeight() throws Exception {
        // Get the answerWeight
        restAnswerWeightMockMvc.perform(get("/api/answer-weights/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAnswerWeight() throws Exception {
        // Initialize the database
        answerWeightService.save(answerWeight);

        int databaseSizeBeforeUpdate = answerWeightRepository.findAll().size();

        // Update the answerWeight
        AnswerWeight updatedAnswerWeight = answerWeightRepository.findOne(answerWeight.getId());
        // Disconnect from session so that the updates on updatedAnswerWeight are not directly saved in db
        em.detach(updatedAnswerWeight);
        updatedAnswerWeight
            .likelihood(UPDATED_ATTACK_STRATEGY_LIKELIHOOD)
            .questionType(UPDATED_QUESTION_TYPE)
            .weight(UPDATED_WEIGHT);

        restAnswerWeightMockMvc.perform(put("/api/answer-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAnswerWeight)))
            .andExpect(status().isOk());

        // Validate the AnswerWeight in the database
        List<AnswerWeight> answerWeightList = answerWeightRepository.findAll();
        assertThat(answerWeightList).hasSize(databaseSizeBeforeUpdate);
        AnswerWeight testAnswerWeight = answerWeightList.get(answerWeightList.size() - 1);
        assertThat(testAnswerWeight.getLikelihood()).isEqualTo(UPDATED_ATTACK_STRATEGY_LIKELIHOOD);
        assertThat(testAnswerWeight.getQuestionType()).isEqualTo(UPDATED_QUESTION_TYPE);
        assertThat(testAnswerWeight.getWeight()).isEqualTo(UPDATED_WEIGHT);

        // Validate the AnswerWeight in Elasticsearch
        AnswerWeight answerWeightEs = answerWeightSearchRepository.findOne(testAnswerWeight.getId());
        assertThat(answerWeightEs).isEqualToIgnoringGivenFields(testAnswerWeight);
    }

    @Test
    @Transactional
    public void updateNonExistingAnswerWeight() throws Exception {
        int databaseSizeBeforeUpdate = answerWeightRepository.findAll().size();

        // Create the AnswerWeight

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAnswerWeightMockMvc.perform(put("/api/answer-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(answerWeight)))
            .andExpect(status().isCreated());

        // Validate the AnswerWeight in the database
        List<AnswerWeight> answerWeightList = answerWeightRepository.findAll();
        assertThat(answerWeightList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAnswerWeight() throws Exception {
        // Initialize the database
        answerWeightService.save(answerWeight);

        int databaseSizeBeforeDelete = answerWeightRepository.findAll().size();

        // Get the answerWeight
        restAnswerWeightMockMvc.perform(delete("/api/answer-weights/{id}", answerWeight.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean answerWeightExistsInEs = answerWeightSearchRepository.exists(answerWeight.getId());
        assertThat(answerWeightExistsInEs).isFalse();

        // Validate the database is empty
        List<AnswerWeight> answerWeightList = answerWeightRepository.findAll();
        assertThat(answerWeightList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchAnswerWeight() throws Exception {
        // Initialize the database
        answerWeightService.save(answerWeight);

        // Search the answerWeight
        restAnswerWeightMockMvc.perform(get("/api/_search/answer-weights?query=id:" + answerWeight.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(answerWeight.getId().intValue())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD.toString())))
            .andExpect(jsonPath("$.[*].questionType").value(hasItem(DEFAULT_QUESTION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AnswerWeight.class);
        AnswerWeight answerWeight1 = new AnswerWeight();
        answerWeight1.setId(1L);
        AnswerWeight answerWeight2 = new AnswerWeight();
        answerWeight2.setId(answerWeight1.getId());
        assertThat(answerWeight1).isEqualTo(answerWeight2);
        answerWeight2.setId(2L);
        assertThat(answerWeight1).isNotEqualTo(answerWeight2);
        answerWeight1.setId(null);
        assertThat(answerWeight1).isNotEqualTo(answerWeight2);
    }
}
