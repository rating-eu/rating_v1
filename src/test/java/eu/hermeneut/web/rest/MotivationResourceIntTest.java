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

import eu.hermeneut.domain.Motivation;
import eu.hermeneut.repository.MotivationRepository;
import eu.hermeneut.service.MotivationService;
import eu.hermeneut.repository.search.MotivationSearchRepository;
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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static eu.hermeneut.web.rest.TestUtil.sameInstant;
import static eu.hermeneut.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MotivationResource REST controller.
 *
 * @see MotivationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class MotivationResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private MotivationRepository motivationRepository;

    @Autowired
    private MotivationService motivationService;

    @Autowired
    private MotivationSearchRepository motivationSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMotivationMockMvc;

    private Motivation motivation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MotivationResource motivationResource = new MotivationResource(motivationService);
        this.restMotivationMockMvc = MockMvcBuilders.standaloneSetup(motivationResource)
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
    public static Motivation createEntity(EntityManager em) {
        Motivation motivation = new Motivation()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED);
        return motivation;
    }

    @Before
    public void initTest() {
        motivationSearchRepository.deleteAll();
        motivation = createEntity(em);
    }

    @Test
    @Transactional
    public void createMotivation() throws Exception {
        int databaseSizeBeforeCreate = motivationRepository.findAll().size();

        // Create the Motivation
        restMotivationMockMvc.perform(post("/api/motivations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivation)))
            .andExpect(status().isCreated());

        // Validate the Motivation in the database
        List<Motivation> motivationList = motivationRepository.findAll();
        assertThat(motivationList).hasSize(databaseSizeBeforeCreate + 1);
        Motivation testMotivation = motivationList.get(motivationList.size() - 1);
        assertThat(testMotivation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMotivation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMotivation.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testMotivation.getModified()).isEqualTo(DEFAULT_MODIFIED);

        // Validate the Motivation in Elasticsearch
        Motivation motivationEs = motivationSearchRepository.findOne(testMotivation.getId());
        assertThat(testMotivation.getCreated()).isEqualTo(testMotivation.getCreated());
        assertThat(testMotivation.getModified()).isEqualTo(testMotivation.getModified());
        assertThat(motivationEs).isEqualToIgnoringGivenFields(testMotivation, "created", "modified");
    }

    @Test
    @Transactional
    public void createMotivationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = motivationRepository.findAll().size();

        // Create the Motivation with an existing ID
        motivation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMotivationMockMvc.perform(post("/api/motivations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivation)))
            .andExpect(status().isBadRequest());

        // Validate the Motivation in the database
        List<Motivation> motivationList = motivationRepository.findAll();
        assertThat(motivationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = motivationRepository.findAll().size();
        // set the field null
        motivation.setName(null);

        // Create the Motivation, which fails.

        restMotivationMockMvc.perform(post("/api/motivations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivation)))
            .andExpect(status().isBadRequest());

        List<Motivation> motivationList = motivationRepository.findAll();
        assertThat(motivationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMotivations() throws Exception {
        // Initialize the database
        motivationRepository.saveAndFlush(motivation);

        // Get all the motivationList
        restMotivationMockMvc.perform(get("/api/motivations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(motivation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void getMotivation() throws Exception {
        // Initialize the database
        motivationRepository.saveAndFlush(motivation);

        // Get the motivation
        restMotivationMockMvc.perform(get("/api/motivations/{id}", motivation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(motivation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    @Transactional
    public void getNonExistingMotivation() throws Exception {
        // Get the motivation
        restMotivationMockMvc.perform(get("/api/motivations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMotivation() throws Exception {
        // Initialize the database
        motivationService.save(motivation);

        int databaseSizeBeforeUpdate = motivationRepository.findAll().size();

        // Update the motivation
        Motivation updatedMotivation = motivationRepository.findOne(motivation.getId());
        // Disconnect from session so that the updates on updatedMotivation are not directly saved in db
        em.detach(updatedMotivation);
        updatedMotivation
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED);

        restMotivationMockMvc.perform(put("/api/motivations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMotivation)))
            .andExpect(status().isOk());

        // Validate the Motivation in the database
        List<Motivation> motivationList = motivationRepository.findAll();
        assertThat(motivationList).hasSize(databaseSizeBeforeUpdate);
        Motivation testMotivation = motivationList.get(motivationList.size() - 1);
        assertThat(testMotivation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMotivation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMotivation.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testMotivation.getModified()).isEqualTo(UPDATED_MODIFIED);

        // Validate the Motivation in Elasticsearch
        Motivation motivationEs = motivationSearchRepository.findOne(testMotivation.getId());
        assertThat(testMotivation.getCreated()).isEqualTo(testMotivation.getCreated());
        assertThat(testMotivation.getModified()).isEqualTo(testMotivation.getModified());
        assertThat(motivationEs).isEqualToIgnoringGivenFields(testMotivation, "created", "modified");
    }

    @Test
    @Transactional
    public void updateNonExistingMotivation() throws Exception {
        int databaseSizeBeforeUpdate = motivationRepository.findAll().size();

        // Create the Motivation

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMotivationMockMvc.perform(put("/api/motivations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivation)))
            .andExpect(status().isCreated());

        // Validate the Motivation in the database
        List<Motivation> motivationList = motivationRepository.findAll();
        assertThat(motivationList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMotivation() throws Exception {
        // Initialize the database
        motivationService.save(motivation);

        int databaseSizeBeforeDelete = motivationRepository.findAll().size();

        // Get the motivation
        restMotivationMockMvc.perform(delete("/api/motivations/{id}", motivation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean motivationExistsInEs = motivationSearchRepository.exists(motivation.getId());
        assertThat(motivationExistsInEs).isFalse();

        // Validate the database is empty
        List<Motivation> motivationList = motivationRepository.findAll();
        assertThat(motivationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMotivation() throws Exception {
        // Initialize the database
        motivationService.save(motivation);

        // Search the motivation
        restMotivationMockMvc.perform(get("/api/_search/motivations?query=id:" + motivation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(motivation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Motivation.class);
        Motivation motivation1 = new Motivation();
        motivation1.setId(1L);
        Motivation motivation2 = new Motivation();
        motivation2.setId(motivation1.getId());
        assertThat(motivation1).isEqualTo(motivation2);
        motivation2.setId(2L);
        assertThat(motivation1).isNotEqualTo(motivation2);
        motivation1.setId(null);
        assertThat(motivation1).isNotEqualTo(motivation2);
    }
}
