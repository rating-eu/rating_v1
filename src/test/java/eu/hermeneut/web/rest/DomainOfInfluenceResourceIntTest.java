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

import eu.hermeneut.domain.DomainOfInfluence;
import eu.hermeneut.repository.DomainOfInfluenceRepository;
import eu.hermeneut.service.DomainOfInfluenceService;
import eu.hermeneut.repository.search.DomainOfInfluenceSearchRepository;
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
 * Test class for the DomainOfInfluenceResource REST controller.
 *
 * @see DomainOfInfluenceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class DomainOfInfluenceResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private DomainOfInfluenceRepository domainOfInfluenceRepository;

    @Autowired
    private DomainOfInfluenceService domainOfInfluenceService;

    @Autowired
    private DomainOfInfluenceSearchRepository domainOfInfluenceSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDomainOfInfluenceMockMvc;

    private DomainOfInfluence domainOfInfluence;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DomainOfInfluenceResource domainOfInfluenceResource = new DomainOfInfluenceResource(domainOfInfluenceService);
        this.restDomainOfInfluenceMockMvc = MockMvcBuilders.standaloneSetup(domainOfInfluenceResource)
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
    public static DomainOfInfluence createEntity(EntityManager em) {
        DomainOfInfluence domainOfInfluence = new DomainOfInfluence()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return domainOfInfluence;
    }

    @Before
    public void initTest() {
        domainOfInfluenceSearchRepository.deleteAll();
        domainOfInfluence = createEntity(em);
    }

    @Test
    @Transactional
    public void createDomainOfInfluence() throws Exception {
        int databaseSizeBeforeCreate = domainOfInfluenceRepository.findAll().size();

        // Create the DomainOfInfluence
        restDomainOfInfluenceMockMvc.perform(post("/api/domain-of-influences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainOfInfluence)))
            .andExpect(status().isCreated());

        // Validate the DomainOfInfluence in the database
        List<DomainOfInfluence> domainOfInfluenceList = domainOfInfluenceRepository.findAll();
        assertThat(domainOfInfluenceList).hasSize(databaseSizeBeforeCreate + 1);
        DomainOfInfluence testDomainOfInfluence = domainOfInfluenceList.get(domainOfInfluenceList.size() - 1);
        assertThat(testDomainOfInfluence.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDomainOfInfluence.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);

        // Validate the DomainOfInfluence in Elasticsearch
        DomainOfInfluence domainOfInfluenceEs = domainOfInfluenceSearchRepository.findOne(testDomainOfInfluence.getId());
        assertThat(domainOfInfluenceEs).isEqualToIgnoringGivenFields(testDomainOfInfluence);
    }

    @Test
    @Transactional
    public void createDomainOfInfluenceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = domainOfInfluenceRepository.findAll().size();

        // Create the DomainOfInfluence with an existing ID
        domainOfInfluence.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDomainOfInfluenceMockMvc.perform(post("/api/domain-of-influences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainOfInfluence)))
            .andExpect(status().isBadRequest());

        // Validate the DomainOfInfluence in the database
        List<DomainOfInfluence> domainOfInfluenceList = domainOfInfluenceRepository.findAll();
        assertThat(domainOfInfluenceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = domainOfInfluenceRepository.findAll().size();
        // set the field null
        domainOfInfluence.setName(null);

        // Create the DomainOfInfluence, which fails.

        restDomainOfInfluenceMockMvc.perform(post("/api/domain-of-influences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainOfInfluence)))
            .andExpect(status().isBadRequest());

        List<DomainOfInfluence> domainOfInfluenceList = domainOfInfluenceRepository.findAll();
        assertThat(domainOfInfluenceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDomainOfInfluences() throws Exception {
        // Initialize the database
        domainOfInfluenceRepository.saveAndFlush(domainOfInfluence);

        // Get all the domainOfInfluenceList
        restDomainOfInfluenceMockMvc.perform(get("/api/domain-of-influences?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(domainOfInfluence.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getDomainOfInfluence() throws Exception {
        // Initialize the database
        domainOfInfluenceRepository.saveAndFlush(domainOfInfluence);

        // Get the domainOfInfluence
        restDomainOfInfluenceMockMvc.perform(get("/api/domain-of-influences/{id}", domainOfInfluence.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(domainOfInfluence.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDomainOfInfluence() throws Exception {
        // Get the domainOfInfluence
        restDomainOfInfluenceMockMvc.perform(get("/api/domain-of-influences/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDomainOfInfluence() throws Exception {
        // Initialize the database
        domainOfInfluenceService.save(domainOfInfluence);

        int databaseSizeBeforeUpdate = domainOfInfluenceRepository.findAll().size();

        // Update the domainOfInfluence
        DomainOfInfluence updatedDomainOfInfluence = domainOfInfluenceRepository.findOne(domainOfInfluence.getId());
        // Disconnect from session so that the updates on updatedDomainOfInfluence are not directly saved in db
        em.detach(updatedDomainOfInfluence);
        updatedDomainOfInfluence
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restDomainOfInfluenceMockMvc.perform(put("/api/domain-of-influences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDomainOfInfluence)))
            .andExpect(status().isOk());

        // Validate the DomainOfInfluence in the database
        List<DomainOfInfluence> domainOfInfluenceList = domainOfInfluenceRepository.findAll();
        assertThat(domainOfInfluenceList).hasSize(databaseSizeBeforeUpdate);
        DomainOfInfluence testDomainOfInfluence = domainOfInfluenceList.get(domainOfInfluenceList.size() - 1);
        assertThat(testDomainOfInfluence.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDomainOfInfluence.getDescription()).isEqualTo(UPDATED_DESCRIPTION);

        // Validate the DomainOfInfluence in Elasticsearch
        DomainOfInfluence domainOfInfluenceEs = domainOfInfluenceSearchRepository.findOne(testDomainOfInfluence.getId());
        assertThat(domainOfInfluenceEs).isEqualToIgnoringGivenFields(testDomainOfInfluence);
    }

    @Test
    @Transactional
    public void updateNonExistingDomainOfInfluence() throws Exception {
        int databaseSizeBeforeUpdate = domainOfInfluenceRepository.findAll().size();

        // Create the DomainOfInfluence

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDomainOfInfluenceMockMvc.perform(put("/api/domain-of-influences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainOfInfluence)))
            .andExpect(status().isCreated());

        // Validate the DomainOfInfluence in the database
        List<DomainOfInfluence> domainOfInfluenceList = domainOfInfluenceRepository.findAll();
        assertThat(domainOfInfluenceList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDomainOfInfluence() throws Exception {
        // Initialize the database
        domainOfInfluenceService.save(domainOfInfluence);

        int databaseSizeBeforeDelete = domainOfInfluenceRepository.findAll().size();

        // Get the domainOfInfluence
        restDomainOfInfluenceMockMvc.perform(delete("/api/domain-of-influences/{id}", domainOfInfluence.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean domainOfInfluenceExistsInEs = domainOfInfluenceSearchRepository.exists(domainOfInfluence.getId());
        assertThat(domainOfInfluenceExistsInEs).isFalse();

        // Validate the database is empty
        List<DomainOfInfluence> domainOfInfluenceList = domainOfInfluenceRepository.findAll();
        assertThat(domainOfInfluenceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchDomainOfInfluence() throws Exception {
        // Initialize the database
        domainOfInfluenceService.save(domainOfInfluence);

        // Search the domainOfInfluence
        restDomainOfInfluenceMockMvc.perform(get("/api/_search/domain-of-influences?query=id:" + domainOfInfluence.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(domainOfInfluence.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DomainOfInfluence.class);
        DomainOfInfluence domainOfInfluence1 = new DomainOfInfluence();
        domainOfInfluence1.setId(1L);
        DomainOfInfluence domainOfInfluence2 = new DomainOfInfluence();
        domainOfInfluence2.setId(domainOfInfluence1.getId());
        assertThat(domainOfInfluence1).isEqualTo(domainOfInfluence2);
        domainOfInfluence2.setId(2L);
        assertThat(domainOfInfluence1).isNotEqualTo(domainOfInfluence2);
        domainOfInfluence1.setId(null);
        assertThat(domainOfInfluence1).isNotEqualTo(domainOfInfluence2);
    }
}
