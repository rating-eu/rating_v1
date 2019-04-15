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

import eu.hermeneut.domain.CompanyGroup;
import eu.hermeneut.repository.CompanyGroupRepository;
import eu.hermeneut.service.CompanyGroupService;
import eu.hermeneut.repository.search.CompanyGroupSearchRepository;
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
 * Test class for the CompanyGroupResource REST controller.
 *
 * @see CompanyGroupResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class CompanyGroupResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private CompanyGroupRepository companyGroupRepository;

    @Autowired
    private CompanyGroupService companyGroupService;

    @Autowired
    private CompanyGroupSearchRepository companyGroupSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCompanyGroupMockMvc;

    private CompanyGroup companyGroup;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CompanyGroupResource companyGroupResource = new CompanyGroupResource(companyGroupService);
        this.restCompanyGroupMockMvc = MockMvcBuilders.standaloneSetup(companyGroupResource)
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
    public static CompanyGroup createEntity(EntityManager em) {
        CompanyGroup companyGroup = new CompanyGroup()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED);
        return companyGroup;
    }

    @Before
    public void initTest() {
        companyGroupSearchRepository.deleteAll();
        companyGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createCompanyGroup() throws Exception {
        int databaseSizeBeforeCreate = companyGroupRepository.findAll().size();

        // Create the CompanyGroup
        restCompanyGroupMockMvc.perform(post("/api/company-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companyGroup)))
            .andExpect(status().isCreated());

        // Validate the CompanyGroup in the database
        List<CompanyGroup> companyGroupList = companyGroupRepository.findAll();
        assertThat(companyGroupList).hasSize(databaseSizeBeforeCreate + 1);
        CompanyGroup testCompanyGroup = companyGroupList.get(companyGroupList.size() - 1);
        assertThat(testCompanyGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCompanyGroup.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCompanyGroup.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testCompanyGroup.getModified()).isEqualTo(DEFAULT_MODIFIED);

        // Validate the CompanyGroup in Elasticsearch
        CompanyGroup companyGroupEs = companyGroupSearchRepository.findOne(testCompanyGroup.getId());
        assertThat(testCompanyGroup.getCreated()).isEqualTo(testCompanyGroup.getCreated());
        assertThat(testCompanyGroup.getModified()).isEqualTo(testCompanyGroup.getModified());
        assertThat(companyGroupEs).isEqualToIgnoringGivenFields(testCompanyGroup, "created", "modified");
    }

    @Test
    @Transactional
    public void createCompanyGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = companyGroupRepository.findAll().size();

        // Create the CompanyGroup with an existing ID
        companyGroup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompanyGroupMockMvc.perform(post("/api/company-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companyGroup)))
            .andExpect(status().isBadRequest());

        // Validate the CompanyGroup in the database
        List<CompanyGroup> companyGroupList = companyGroupRepository.findAll();
        assertThat(companyGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyGroupRepository.findAll().size();
        // set the field null
        companyGroup.setName(null);

        // Create the CompanyGroup, which fails.

        restCompanyGroupMockMvc.perform(post("/api/company-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companyGroup)))
            .andExpect(status().isBadRequest());

        List<CompanyGroup> companyGroupList = companyGroupRepository.findAll();
        assertThat(companyGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCompanyGroups() throws Exception {
        // Initialize the database
        companyGroupRepository.saveAndFlush(companyGroup);

        // Get all the companyGroupList
        restCompanyGroupMockMvc.perform(get("/api/company-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companyGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void getCompanyGroup() throws Exception {
        // Initialize the database
        companyGroupRepository.saveAndFlush(companyGroup);

        // Get the companyGroup
        restCompanyGroupMockMvc.perform(get("/api/company-groups/{id}", companyGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(companyGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    @Transactional
    public void getNonExistingCompanyGroup() throws Exception {
        // Get the companyGroup
        restCompanyGroupMockMvc.perform(get("/api/company-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCompanyGroup() throws Exception {
        // Initialize the database
        companyGroupService.save(companyGroup);

        int databaseSizeBeforeUpdate = companyGroupRepository.findAll().size();

        // Update the companyGroup
        CompanyGroup updatedCompanyGroup = companyGroupRepository.findOne(companyGroup.getId());
        // Disconnect from session so that the updates on updatedCompanyGroup are not directly saved in db
        em.detach(updatedCompanyGroup);
        updatedCompanyGroup
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED);

        restCompanyGroupMockMvc.perform(put("/api/company-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCompanyGroup)))
            .andExpect(status().isOk());

        // Validate the CompanyGroup in the database
        List<CompanyGroup> companyGroupList = companyGroupRepository.findAll();
        assertThat(companyGroupList).hasSize(databaseSizeBeforeUpdate);
        CompanyGroup testCompanyGroup = companyGroupList.get(companyGroupList.size() - 1);
        assertThat(testCompanyGroup.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCompanyGroup.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCompanyGroup.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testCompanyGroup.getModified()).isEqualTo(UPDATED_MODIFIED);

        // Validate the CompanyGroup in Elasticsearch
        CompanyGroup companyGroupEs = companyGroupSearchRepository.findOne(testCompanyGroup.getId());
        assertThat(testCompanyGroup.getCreated()).isEqualTo(testCompanyGroup.getCreated());
        assertThat(testCompanyGroup.getModified()).isEqualTo(testCompanyGroup.getModified());
        assertThat(companyGroupEs).isEqualToIgnoringGivenFields(testCompanyGroup, "created", "modified");
    }

    @Test
    @Transactional
    public void updateNonExistingCompanyGroup() throws Exception {
        int databaseSizeBeforeUpdate = companyGroupRepository.findAll().size();

        // Create the CompanyGroup

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCompanyGroupMockMvc.perform(put("/api/company-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companyGroup)))
            .andExpect(status().isCreated());

        // Validate the CompanyGroup in the database
        List<CompanyGroup> companyGroupList = companyGroupRepository.findAll();
        assertThat(companyGroupList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCompanyGroup() throws Exception {
        // Initialize the database
        companyGroupService.save(companyGroup);

        int databaseSizeBeforeDelete = companyGroupRepository.findAll().size();

        // Get the companyGroup
        restCompanyGroupMockMvc.perform(delete("/api/company-groups/{id}", companyGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean companyGroupExistsInEs = companyGroupSearchRepository.exists(companyGroup.getId());
        assertThat(companyGroupExistsInEs).isFalse();

        // Validate the database is empty
        List<CompanyGroup> companyGroupList = companyGroupRepository.findAll();
        assertThat(companyGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCompanyGroup() throws Exception {
        // Initialize the database
        companyGroupService.save(companyGroup);

        // Search the companyGroup
        restCompanyGroupMockMvc.perform(get("/api/_search/company-groups?query=id:" + companyGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companyGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompanyGroup.class);
        CompanyGroup companyGroup1 = new CompanyGroup();
        companyGroup1.setId(1L);
        CompanyGroup companyGroup2 = new CompanyGroup();
        companyGroup2.setId(companyGroup1.getId());
        assertThat(companyGroup1).isEqualTo(companyGroup2);
        companyGroup2.setId(2L);
        assertThat(companyGroup1).isNotEqualTo(companyGroup2);
        companyGroup1.setId(null);
        assertThat(companyGroup1).isNotEqualTo(companyGroup2);
    }
}
