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

import eu.hermeneut.domain.EBIT;
import eu.hermeneut.repository.EBITRepository;
import eu.hermeneut.service.EBITService;
import eu.hermeneut.repository.search.EBITSearchRepository;
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
import java.math.BigDecimal;
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
 * Test class for the EBITResource REST controller.
 *
 * @see EBITResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class EBITResourceIntTest {

    private static final Integer DEFAULT_YEAR = 1;
    private static final Integer UPDATED_YEAR = 2;

    private static final BigDecimal DEFAULT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE = new BigDecimal(2);

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private EBITRepository eBITRepository;

    @Autowired
    private EBITService eBITService;

    @Autowired
    private EBITSearchRepository eBITSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEBITMockMvc;

    private EBIT eBIT;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EBITResource eBITResource = new EBITResource(eBITService);
        this.restEBITMockMvc = MockMvcBuilders.standaloneSetup(eBITResource)
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
    public static EBIT createEntity(EntityManager em) {
        EBIT eBIT = new EBIT()
            .year(DEFAULT_YEAR)
            .value(DEFAULT_VALUE)
            .created(DEFAULT_CREATED);
        return eBIT;
    }

    @Before
    public void initTest() {
        eBITSearchRepository.deleteAll();
        eBIT = createEntity(em);
    }

    @Test
    @Transactional
    public void createEBIT() throws Exception {
        int databaseSizeBeforeCreate = eBITRepository.findAll().size();

        // Create the EBIT
        restEBITMockMvc.perform(post("/api/ebits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eBIT)))
            .andExpect(status().isCreated());

        // Validate the EBIT in the database
        List<EBIT> eBITList = eBITRepository.findAll();
        assertThat(eBITList).hasSize(databaseSizeBeforeCreate + 1);
        EBIT testEBIT = eBITList.get(eBITList.size() - 1);
        assertThat(testEBIT.getYear()).isEqualTo(DEFAULT_YEAR);
        assertThat(testEBIT.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testEBIT.getCreated()).isEqualTo(DEFAULT_CREATED);

        // Validate the EBIT in Elasticsearch
        EBIT eBITEs = eBITSearchRepository.findOne(testEBIT.getId());
        assertThat(testEBIT.getCreated()).isEqualTo(testEBIT.getCreated());
        assertThat(eBITEs).isEqualToIgnoringGivenFields(testEBIT, "created");
    }

    @Test
    @Transactional
    public void createEBITWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eBITRepository.findAll().size();

        // Create the EBIT with an existing ID
        eBIT.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEBITMockMvc.perform(post("/api/ebits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eBIT)))
            .andExpect(status().isBadRequest());

        // Validate the EBIT in the database
        List<EBIT> eBITList = eBITRepository.findAll();
        assertThat(eBITList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllEBITS() throws Exception {
        // Initialize the database
        eBITRepository.saveAndFlush(eBIT);

        // Get all the eBITList
        restEBITMockMvc.perform(get("/api/ebits?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eBIT.getId().intValue())))
            .andExpect(jsonPath("$.[*].year").value(hasItem(DEFAULT_YEAR)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))));
    }

    @Test
    @Transactional
    public void getEBIT() throws Exception {
        // Initialize the database
        eBITRepository.saveAndFlush(eBIT);

        // Get the eBIT
        restEBITMockMvc.perform(get("/api/ebits/{id}", eBIT.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eBIT.getId().intValue()))
            .andExpect(jsonPath("$.year").value(DEFAULT_YEAR))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.intValue()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)));
    }

    @Test
    @Transactional
    public void getNonExistingEBIT() throws Exception {
        // Get the eBIT
        restEBITMockMvc.perform(get("/api/ebits/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEBIT() throws Exception {
        // Initialize the database
        eBITService.save(eBIT);

        int databaseSizeBeforeUpdate = eBITRepository.findAll().size();

        // Update the eBIT
        EBIT updatedEBIT = eBITRepository.findOne(eBIT.getId());
        // Disconnect from session so that the updates on updatedEBIT are not directly saved in db
        em.detach(updatedEBIT);
        updatedEBIT
            .year(UPDATED_YEAR)
            .value(UPDATED_VALUE)
            .created(UPDATED_CREATED);

        restEBITMockMvc.perform(put("/api/ebits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEBIT)))
            .andExpect(status().isOk());

        // Validate the EBIT in the database
        List<EBIT> eBITList = eBITRepository.findAll();
        assertThat(eBITList).hasSize(databaseSizeBeforeUpdate);
        EBIT testEBIT = eBITList.get(eBITList.size() - 1);
        assertThat(testEBIT.getYear()).isEqualTo(UPDATED_YEAR);
        assertThat(testEBIT.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testEBIT.getCreated()).isEqualTo(UPDATED_CREATED);

        // Validate the EBIT in Elasticsearch
        EBIT eBITEs = eBITSearchRepository.findOne(testEBIT.getId());
        assertThat(testEBIT.getCreated()).isEqualTo(testEBIT.getCreated());
        assertThat(eBITEs).isEqualToIgnoringGivenFields(testEBIT, "created");
    }

    @Test
    @Transactional
    public void updateNonExistingEBIT() throws Exception {
        int databaseSizeBeforeUpdate = eBITRepository.findAll().size();

        // Create the EBIT

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEBITMockMvc.perform(put("/api/ebits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eBIT)))
            .andExpect(status().isCreated());

        // Validate the EBIT in the database
        List<EBIT> eBITList = eBITRepository.findAll();
        assertThat(eBITList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEBIT() throws Exception {
        // Initialize the database
        eBITService.save(eBIT);

        int databaseSizeBeforeDelete = eBITRepository.findAll().size();

        // Get the eBIT
        restEBITMockMvc.perform(delete("/api/ebits/{id}", eBIT.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean eBITExistsInEs = eBITSearchRepository.exists(eBIT.getId());
        assertThat(eBITExistsInEs).isFalse();

        // Validate the database is empty
        List<EBIT> eBITList = eBITRepository.findAll();
        assertThat(eBITList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchEBIT() throws Exception {
        // Initialize the database
        eBITService.save(eBIT);

        // Search the eBIT
        restEBITMockMvc.perform(get("/api/_search/ebits?query=id:" + eBIT.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eBIT.getId().intValue())))
            .andExpect(jsonPath("$.[*].year").value(hasItem(DEFAULT_YEAR)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EBIT.class);
        EBIT eBIT1 = new EBIT();
        eBIT1.setId(1L);
        EBIT eBIT2 = new EBIT();
        eBIT2.setId(eBIT1.getId());
        assertThat(eBIT1).isEqualTo(eBIT2);
        eBIT2.setId(2L);
        assertThat(eBIT1).isNotEqualTo(eBIT2);
        eBIT1.setId(null);
        assertThat(eBIT1).isNotEqualTo(eBIT2);
    }
}
