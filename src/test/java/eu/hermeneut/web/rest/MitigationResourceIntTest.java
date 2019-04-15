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

import eu.hermeneut.domain.Mitigation;
import eu.hermeneut.repository.MitigationRepository;
import eu.hermeneut.service.MitigationService;
import eu.hermeneut.repository.search.MitigationSearchRepository;
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
 * Test class for the MitigationResource REST controller.
 *
 * @see MitigationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class MitigationResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private MitigationRepository mitigationRepository;

    @Autowired
    private MitigationService mitigationService;

    @Autowired
    private MitigationSearchRepository mitigationSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMitigationMockMvc;

    private Mitigation mitigation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MitigationResource mitigationResource = new MitigationResource(mitigationService);
        this.restMitigationMockMvc = MockMvcBuilders.standaloneSetup(mitigationResource)
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
    public static Mitigation createEntity(EntityManager em) {
        Mitigation mitigation = new Mitigation()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED);
        return mitigation;
    }

    @Before
    public void initTest() {
        mitigationSearchRepository.deleteAll();
        mitigation = createEntity(em);
    }

    @Test
    @Transactional
    public void createMitigation() throws Exception {
        int databaseSizeBeforeCreate = mitigationRepository.findAll().size();

        // Create the Mitigation
        restMitigationMockMvc.perform(post("/api/mitigations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mitigation)))
            .andExpect(status().isCreated());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeCreate + 1);
        Mitigation testMitigation = mitigationList.get(mitigationList.size() - 1);
        assertThat(testMitigation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMitigation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMitigation.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testMitigation.getModified()).isEqualTo(DEFAULT_MODIFIED);

        // Validate the Mitigation in Elasticsearch
        Mitigation mitigationEs = mitigationSearchRepository.findOne(testMitigation.getId());
        assertThat(testMitigation.getCreated()).isEqualTo(testMitigation.getCreated());
        assertThat(testMitigation.getModified()).isEqualTo(testMitigation.getModified());
        assertThat(mitigationEs).isEqualToIgnoringGivenFields(testMitigation, "created", "modified");
    }

    @Test
    @Transactional
    public void createMitigationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = mitigationRepository.findAll().size();

        // Create the Mitigation with an existing ID
        mitigation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMitigationMockMvc.perform(post("/api/mitigations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mitigation)))
            .andExpect(status().isBadRequest());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMitigations() throws Exception {
        // Initialize the database
        mitigationRepository.saveAndFlush(mitigation);

        // Get all the mitigationList
        restMitigationMockMvc.perform(get("/api/mitigations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mitigation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void getMitigation() throws Exception {
        // Initialize the database
        mitigationRepository.saveAndFlush(mitigation);

        // Get the mitigation
        restMitigationMockMvc.perform(get("/api/mitigations/{id}", mitigation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(mitigation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    @Transactional
    public void getNonExistingMitigation() throws Exception {
        // Get the mitigation
        restMitigationMockMvc.perform(get("/api/mitigations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMitigation() throws Exception {
        // Initialize the database
        mitigationService.save(mitigation);

        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();

        // Update the mitigation
        Mitigation updatedMitigation = mitigationRepository.findOne(mitigation.getId());
        // Disconnect from session so that the updates on updatedMitigation are not directly saved in db
        em.detach(updatedMitigation);
        updatedMitigation
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED);

        restMitigationMockMvc.perform(put("/api/mitigations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMitigation)))
            .andExpect(status().isOk());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
        Mitigation testMitigation = mitigationList.get(mitigationList.size() - 1);
        assertThat(testMitigation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMitigation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMitigation.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testMitigation.getModified()).isEqualTo(UPDATED_MODIFIED);

        // Validate the Mitigation in Elasticsearch
        Mitigation mitigationEs = mitigationSearchRepository.findOne(testMitigation.getId());
        assertThat(testMitigation.getCreated()).isEqualTo(testMitigation.getCreated());
        assertThat(testMitigation.getModified()).isEqualTo(testMitigation.getModified());
        assertThat(mitigationEs).isEqualToIgnoringGivenFields(testMitigation, "created", "modified");
    }

    @Test
    @Transactional
    public void updateNonExistingMitigation() throws Exception {
        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();

        // Create the Mitigation

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMitigationMockMvc.perform(put("/api/mitigations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mitigation)))
            .andExpect(status().isCreated());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMitigation() throws Exception {
        // Initialize the database
        mitigationService.save(mitigation);

        int databaseSizeBeforeDelete = mitigationRepository.findAll().size();

        // Get the mitigation
        restMitigationMockMvc.perform(delete("/api/mitigations/{id}", mitigation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean mitigationExistsInEs = mitigationSearchRepository.exists(mitigation.getId());
        assertThat(mitigationExistsInEs).isFalse();

        // Validate the database is empty
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMitigation() throws Exception {
        // Initialize the database
        mitigationService.save(mitigation);

        // Search the mitigation
        restMitigationMockMvc.perform(get("/api/_search/mitigations?query=id:" + mitigation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mitigation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mitigation.class);
        Mitigation mitigation1 = new Mitigation();
        mitigation1.setId(1L);
        Mitigation mitigation2 = new Mitigation();
        mitigation2.setId(mitigation1.getId());
        assertThat(mitigation1).isEqualTo(mitigation2);
        mitigation2.setId(2L);
        assertThat(mitigation1).isNotEqualTo(mitigation2);
        mitigation1.setId(null);
        assertThat(mitigation1).isNotEqualTo(mitigation2);
    }
}
