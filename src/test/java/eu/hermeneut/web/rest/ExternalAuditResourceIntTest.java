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

import eu.hermeneut.domain.ExternalAudit;
import eu.hermeneut.repository.ExternalAuditRepository;
import eu.hermeneut.service.ExternalAuditService;
import eu.hermeneut.repository.search.ExternalAuditSearchRepository;
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
 * Test class for the ExternalAuditResource REST controller.
 *
 * @see ExternalAuditResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class ExternalAuditResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private ExternalAuditRepository externalAuditRepository;

    @Autowired
    private ExternalAuditService externalAuditService;

    @Autowired
    private ExternalAuditSearchRepository externalAuditSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restExternalAuditMockMvc;

    private ExternalAudit externalAudit;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ExternalAuditResource externalAuditResource = new ExternalAuditResource(externalAuditService);
        this.restExternalAuditMockMvc = MockMvcBuilders.standaloneSetup(externalAuditResource)
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
    public static ExternalAudit createEntity(EntityManager em) {
        ExternalAudit externalAudit = new ExternalAudit()
            .name(DEFAULT_NAME);
        return externalAudit;
    }

    @Before
    public void initTest() {
        externalAuditSearchRepository.deleteAll();
        externalAudit = createEntity(em);
    }

    @Test
    @Transactional
    public void createExternalAudit() throws Exception {
        int databaseSizeBeforeCreate = externalAuditRepository.findAll().size();

        // Create the ExternalAudit
        restExternalAuditMockMvc.perform(post("/api/external-audits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(externalAudit)))
            .andExpect(status().isCreated());

        // Validate the ExternalAudit in the database
        List<ExternalAudit> externalAuditList = externalAuditRepository.findAll();
        assertThat(externalAuditList).hasSize(databaseSizeBeforeCreate + 1);
        ExternalAudit testExternalAudit = externalAuditList.get(externalAuditList.size() - 1);
        assertThat(testExternalAudit.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the ExternalAudit in Elasticsearch
        ExternalAudit externalAuditEs = externalAuditSearchRepository.findOne(testExternalAudit.getId());
        assertThat(externalAuditEs).isEqualToIgnoringGivenFields(testExternalAudit);
    }

    @Test
    @Transactional
    public void createExternalAuditWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = externalAuditRepository.findAll().size();

        // Create the ExternalAudit with an existing ID
        externalAudit.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restExternalAuditMockMvc.perform(post("/api/external-audits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(externalAudit)))
            .andExpect(status().isBadRequest());

        // Validate the ExternalAudit in the database
        List<ExternalAudit> externalAuditList = externalAuditRepository.findAll();
        assertThat(externalAuditList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = externalAuditRepository.findAll().size();
        // set the field null
        externalAudit.setName(null);

        // Create the ExternalAudit, which fails.

        restExternalAuditMockMvc.perform(post("/api/external-audits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(externalAudit)))
            .andExpect(status().isBadRequest());

        List<ExternalAudit> externalAuditList = externalAuditRepository.findAll();
        assertThat(externalAuditList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllExternalAudits() throws Exception {
        // Initialize the database
        externalAuditRepository.saveAndFlush(externalAudit);

        // Get all the externalAuditList
        restExternalAuditMockMvc.perform(get("/api/external-audits?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(externalAudit.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getExternalAudit() throws Exception {
        // Initialize the database
        externalAuditRepository.saveAndFlush(externalAudit);

        // Get the externalAudit
        restExternalAuditMockMvc.perform(get("/api/external-audits/{id}", externalAudit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(externalAudit.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingExternalAudit() throws Exception {
        // Get the externalAudit
        restExternalAuditMockMvc.perform(get("/api/external-audits/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateExternalAudit() throws Exception {
        // Initialize the database
        externalAuditService.save(externalAudit);

        int databaseSizeBeforeUpdate = externalAuditRepository.findAll().size();

        // Update the externalAudit
        ExternalAudit updatedExternalAudit = externalAuditRepository.findOne(externalAudit.getId());
        // Disconnect from session so that the updates on updatedExternalAudit are not directly saved in db
        em.detach(updatedExternalAudit);
        updatedExternalAudit
            .name(UPDATED_NAME);

        restExternalAuditMockMvc.perform(put("/api/external-audits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedExternalAudit)))
            .andExpect(status().isOk());

        // Validate the ExternalAudit in the database
        List<ExternalAudit> externalAuditList = externalAuditRepository.findAll();
        assertThat(externalAuditList).hasSize(databaseSizeBeforeUpdate);
        ExternalAudit testExternalAudit = externalAuditList.get(externalAuditList.size() - 1);
        assertThat(testExternalAudit.getName()).isEqualTo(UPDATED_NAME);

        // Validate the ExternalAudit in Elasticsearch
        ExternalAudit externalAuditEs = externalAuditSearchRepository.findOne(testExternalAudit.getId());
        assertThat(externalAuditEs).isEqualToIgnoringGivenFields(testExternalAudit);
    }

    @Test
    @Transactional
    public void updateNonExistingExternalAudit() throws Exception {
        int databaseSizeBeforeUpdate = externalAuditRepository.findAll().size();

        // Create the ExternalAudit

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restExternalAuditMockMvc.perform(put("/api/external-audits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(externalAudit)))
            .andExpect(status().isCreated());

        // Validate the ExternalAudit in the database
        List<ExternalAudit> externalAuditList = externalAuditRepository.findAll();
        assertThat(externalAuditList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteExternalAudit() throws Exception {
        // Initialize the database
        externalAuditService.save(externalAudit);

        int databaseSizeBeforeDelete = externalAuditRepository.findAll().size();

        // Get the externalAudit
        restExternalAuditMockMvc.perform(delete("/api/external-audits/{id}", externalAudit.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean externalAuditExistsInEs = externalAuditSearchRepository.exists(externalAudit.getId());
        assertThat(externalAuditExistsInEs).isFalse();

        // Validate the database is empty
        List<ExternalAudit> externalAuditList = externalAuditRepository.findAll();
        assertThat(externalAuditList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchExternalAudit() throws Exception {
        // Initialize the database
        externalAuditService.save(externalAudit);

        // Search the externalAudit
        restExternalAuditMockMvc.perform(get("/api/_search/external-audits?query=id:" + externalAudit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(externalAudit.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExternalAudit.class);
        ExternalAudit externalAudit1 = new ExternalAudit();
        externalAudit1.setId(1L);
        ExternalAudit externalAudit2 = new ExternalAudit();
        externalAudit2.setId(externalAudit1.getId());
        assertThat(externalAudit1).isEqualTo(externalAudit2);
        externalAudit2.setId(2L);
        assertThat(externalAudit1).isNotEqualTo(externalAudit2);
        externalAudit1.setId(null);
        assertThat(externalAudit1).isNotEqualTo(externalAudit2);
    }
}
