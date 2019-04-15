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

import eu.hermeneut.domain.Phase;
import eu.hermeneut.repository.PhaseRepository;
import eu.hermeneut.service.PhaseService;
import eu.hermeneut.repository.search.PhaseSearchRepository;
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

/**
 * Test class for the PhaseResource REST controller.
 *
 * @see PhaseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class PhaseResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Float DEFAULT_WEIGHT = 1F;
    private static final Float UPDATED_WEIGHT = 2F;

    @Autowired
    private PhaseRepository phaseRepository;

    @Autowired
    private PhaseService phaseService;

    @Autowired
    private PhaseSearchRepository phaseSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPhaseMockMvc;

    private Phase phase;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PhaseResource phaseResource = new PhaseResource(phaseService);
        this.restPhaseMockMvc = MockMvcBuilders.standaloneSetup(phaseResource)
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
    public static Phase createEntity(EntityManager em) {
        Phase phase = new Phase()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .weight(DEFAULT_WEIGHT);
        return phase;
    }

    @Before
    public void initTest() {
        phaseSearchRepository.deleteAll();
        phase = createEntity(em);
    }

    @Test
    @Transactional
    public void createPhase() throws Exception {
        int databaseSizeBeforeCreate = phaseRepository.findAll().size();

        // Create the Phase
        restPhaseMockMvc.perform(post("/api/phases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phase)))
            .andExpect(status().isCreated());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeCreate + 1);
        Phase testPhase = phaseList.get(phaseList.size() - 1);
        assertThat(testPhase.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPhase.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPhase.getWeight()).isEqualTo(DEFAULT_WEIGHT);

        // Validate the Phase in Elasticsearch
        Phase phaseEs = phaseSearchRepository.findOne(testPhase.getId());
        assertThat(phaseEs).isEqualToIgnoringGivenFields(testPhase);
    }

    @Test
    @Transactional
    public void createPhaseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = phaseRepository.findAll().size();

        // Create the Phase with an existing ID
        phase.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPhaseMockMvc.perform(post("/api/phases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phase)))
            .andExpect(status().isBadRequest());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = phaseRepository.findAll().size();
        // set the field null
        phase.setName(null);

        // Create the Phase, which fails.

        restPhaseMockMvc.perform(post("/api/phases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phase)))
            .andExpect(status().isBadRequest());

        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWeightIsRequired() throws Exception {
        int databaseSizeBeforeTest = phaseRepository.findAll().size();
        // set the field null
        phase.setWeight(null);

        // Create the Phase, which fails.

        restPhaseMockMvc.perform(post("/api/phases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phase)))
            .andExpect(status().isBadRequest());

        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPhases() throws Exception {
        // Initialize the database
        phaseRepository.saveAndFlush(phase);

        // Get all the phaseList
        restPhaseMockMvc.perform(get("/api/phases?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phase.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    @Test
    @Transactional
    public void getPhase() throws Exception {
        // Initialize the database
        phaseRepository.saveAndFlush(phase);

        // Get the phase
        restPhaseMockMvc.perform(get("/api/phases/{id}", phase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(phase.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingPhase() throws Exception {
        // Get the phase
        restPhaseMockMvc.perform(get("/api/phases/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePhase() throws Exception {
        // Initialize the database
        phaseService.save(phase);

        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();

        // Update the phase
        Phase updatedPhase = phaseRepository.findOne(phase.getId());
        // Disconnect from session so that the updates on updatedPhase are not directly saved in db
        em.detach(updatedPhase);
        updatedPhase
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .weight(UPDATED_WEIGHT);

        restPhaseMockMvc.perform(put("/api/phases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPhase)))
            .andExpect(status().isOk());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
        Phase testPhase = phaseList.get(phaseList.size() - 1);
        assertThat(testPhase.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPhase.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPhase.getWeight()).isEqualTo(UPDATED_WEIGHT);

        // Validate the Phase in Elasticsearch
        Phase phaseEs = phaseSearchRepository.findOne(testPhase.getId());
        assertThat(phaseEs).isEqualToIgnoringGivenFields(testPhase);
    }

    @Test
    @Transactional
    public void updateNonExistingPhase() throws Exception {
        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();

        // Create the Phase

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPhaseMockMvc.perform(put("/api/phases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phase)))
            .andExpect(status().isCreated());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePhase() throws Exception {
        // Initialize the database
        phaseService.save(phase);

        int databaseSizeBeforeDelete = phaseRepository.findAll().size();

        // Get the phase
        restPhaseMockMvc.perform(delete("/api/phases/{id}", phase.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean phaseExistsInEs = phaseSearchRepository.exists(phase.getId());
        assertThat(phaseExistsInEs).isFalse();

        // Validate the database is empty
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPhase() throws Exception {
        // Initialize the database
        phaseService.save(phase);

        // Search the phase
        restPhaseMockMvc.perform(get("/api/_search/phases?query=id:" + phase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phase.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Phase.class);
        Phase phase1 = new Phase();
        phase1.setId(1L);
        Phase phase2 = new Phase();
        phase2.setId(phase1.getId());
        assertThat(phase1).isEqualTo(phase2);
        phase2.setId(2L);
        assertThat(phase1).isNotEqualTo(phase2);
        phase1.setId(null);
        assertThat(phase1).isNotEqualTo(phase2);
    }
}
