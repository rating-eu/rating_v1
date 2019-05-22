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

import eu.hermeneut.domain.CriticalLevel;
import eu.hermeneut.repository.CriticalLevelRepository;
import eu.hermeneut.service.CriticalLevelService;
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
 * Test class for the CriticalLevelResource REST controller.
 *
 * @see CriticalLevelResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class CriticalLevelResourceIntTest {

    private static final Integer DEFAULT_SIDE = 3;
    private static final Integer UPDATED_SIDE = 4;

    private static final Integer DEFAULT_LOW_LIMIT = 1;
    private static final Integer UPDATED_LOW_LIMIT = 2;

    private static final Integer DEFAULT_MEDIUM_LIMIT = 1;
    private static final Integer UPDATED_MEDIUM_LIMIT = 2;

    private static final Integer DEFAULT_HIGH_LIMIT = 1;
    private static final Integer UPDATED_HIGH_LIMIT = 2;

    @Autowired
    private CriticalLevelRepository criticalLevelRepository;

    @Autowired
    private CriticalLevelService criticalLevelService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCriticalLevelMockMvc;

    private CriticalLevel criticalLevel;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CriticalLevelResource criticalLevelResource = new CriticalLevelResource(criticalLevelService);
        this.restCriticalLevelMockMvc = MockMvcBuilders.standaloneSetup(criticalLevelResource)
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
    public static CriticalLevel createEntity(EntityManager em) {
        CriticalLevel criticalLevel = new CriticalLevel()
            .side(DEFAULT_SIDE)
            .lowLimit(DEFAULT_LOW_LIMIT)
            .mediumLimit(DEFAULT_MEDIUM_LIMIT)
            .highLimit(DEFAULT_HIGH_LIMIT);
        return criticalLevel;
    }

    @Before
    public void initTest() {
        criticalLevel = createEntity(em);
    }

    @Test
    @Transactional
    public void createCriticalLevel() throws Exception {
        int databaseSizeBeforeCreate = criticalLevelRepository.findAll().size();

        // Create the CriticalLevel
        restCriticalLevelMockMvc.perform(post("/api/critical-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(criticalLevel)))
            .andExpect(status().isCreated());

        // Validate the CriticalLevel in the database
        List<CriticalLevel> criticalLevelList = criticalLevelRepository.findAll();
        assertThat(criticalLevelList).hasSize(databaseSizeBeforeCreate + 1);
        CriticalLevel testCriticalLevel = criticalLevelList.get(criticalLevelList.size() - 1);
        assertThat(testCriticalLevel.getSide()).isEqualTo(DEFAULT_SIDE);
        assertThat(testCriticalLevel.getLowLimit()).isEqualTo(DEFAULT_LOW_LIMIT);
        assertThat(testCriticalLevel.getMediumLimit()).isEqualTo(DEFAULT_MEDIUM_LIMIT);
        assertThat(testCriticalLevel.getHighLimit()).isEqualTo(DEFAULT_HIGH_LIMIT);
    }

    @Test
    @Transactional
    public void createCriticalLevelWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = criticalLevelRepository.findAll().size();

        // Create the CriticalLevel with an existing ID
        criticalLevel.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCriticalLevelMockMvc.perform(post("/api/critical-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(criticalLevel)))
            .andExpect(status().isBadRequest());

        // Validate the CriticalLevel in the database
        List<CriticalLevel> criticalLevelList = criticalLevelRepository.findAll();
        assertThat(criticalLevelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCriticalLevels() throws Exception {
        // Initialize the database
        criticalLevelRepository.saveAndFlush(criticalLevel);

        // Get all the criticalLevelList
        restCriticalLevelMockMvc.perform(get("/api/critical-levels?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(criticalLevel.getId().intValue())))
            .andExpect(jsonPath("$.[*].side").value(hasItem(DEFAULT_SIDE)))
            .andExpect(jsonPath("$.[*].lowLimit").value(hasItem(DEFAULT_LOW_LIMIT)))
            .andExpect(jsonPath("$.[*].mediumLimit").value(hasItem(DEFAULT_MEDIUM_LIMIT)))
            .andExpect(jsonPath("$.[*].highLimit").value(hasItem(DEFAULT_HIGH_LIMIT)));
    }

    @Test
    @Transactional
    public void getCriticalLevel() throws Exception {
        // Initialize the database
        criticalLevelRepository.saveAndFlush(criticalLevel);

        // Get the criticalLevel
        restCriticalLevelMockMvc.perform(get("/api/critical-levels/{id}", criticalLevel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(criticalLevel.getId().intValue()))
            .andExpect(jsonPath("$.side").value(DEFAULT_SIDE))
            .andExpect(jsonPath("$.lowLimit").value(DEFAULT_LOW_LIMIT))
            .andExpect(jsonPath("$.mediumLimit").value(DEFAULT_MEDIUM_LIMIT))
            .andExpect(jsonPath("$.highLimit").value(DEFAULT_HIGH_LIMIT));
    }

    @Test
    @Transactional
    public void getNonExistingCriticalLevel() throws Exception {
        // Get the criticalLevel
        restCriticalLevelMockMvc.perform(get("/api/critical-levels/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCriticalLevel() throws Exception {
        // Initialize the database
        criticalLevelService.save(criticalLevel);

        int databaseSizeBeforeUpdate = criticalLevelRepository.findAll().size();

        // Update the criticalLevel
        CriticalLevel updatedCriticalLevel = criticalLevelRepository.findOne(criticalLevel.getId());
        // Disconnect from session so that the updates on updatedCriticalLevel are not directly saved in db
        em.detach(updatedCriticalLevel);
        updatedCriticalLevel
            .side(UPDATED_SIDE)
            .lowLimit(UPDATED_LOW_LIMIT)
            .mediumLimit(UPDATED_MEDIUM_LIMIT)
            .highLimit(UPDATED_HIGH_LIMIT);

        restCriticalLevelMockMvc.perform(put("/api/critical-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCriticalLevel)))
            .andExpect(status().isOk());

        // Validate the CriticalLevel in the database
        List<CriticalLevel> criticalLevelList = criticalLevelRepository.findAll();
        assertThat(criticalLevelList).hasSize(databaseSizeBeforeUpdate);
        CriticalLevel testCriticalLevel = criticalLevelList.get(criticalLevelList.size() - 1);
        assertThat(testCriticalLevel.getSide()).isEqualTo(UPDATED_SIDE);
        assertThat(testCriticalLevel.getLowLimit()).isEqualTo(UPDATED_LOW_LIMIT);
        assertThat(testCriticalLevel.getMediumLimit()).isEqualTo(UPDATED_MEDIUM_LIMIT);
        assertThat(testCriticalLevel.getHighLimit()).isEqualTo(UPDATED_HIGH_LIMIT);
    }

    @Test
    @Transactional
    public void updateNonExistingCriticalLevel() throws Exception {
        int databaseSizeBeforeUpdate = criticalLevelRepository.findAll().size();

        // Create the CriticalLevel

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCriticalLevelMockMvc.perform(put("/api/critical-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(criticalLevel)))
            .andExpect(status().isCreated());

        // Validate the CriticalLevel in the database
        List<CriticalLevel> criticalLevelList = criticalLevelRepository.findAll();
        assertThat(criticalLevelList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCriticalLevel() throws Exception {
        // Initialize the database
        criticalLevelService.save(criticalLevel);

        int databaseSizeBeforeDelete = criticalLevelRepository.findAll().size();

        // Get the criticalLevel
        restCriticalLevelMockMvc.perform(delete("/api/critical-levels/{id}", criticalLevel.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CriticalLevel> criticalLevelList = criticalLevelRepository.findAll();
        assertThat(criticalLevelList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CriticalLevel.class);
        CriticalLevel criticalLevel1 = new CriticalLevel();
        criticalLevel1.setId(1L);
        CriticalLevel criticalLevel2 = new CriticalLevel();
        criticalLevel2.setId(criticalLevel1.getId());
        assertThat(criticalLevel1).isEqualTo(criticalLevel2);
        criticalLevel2.setId(2L);
        assertThat(criticalLevel1).isNotEqualTo(criticalLevel2);
        criticalLevel1.setId(null);
        assertThat(criticalLevel1).isNotEqualTo(criticalLevel2);
    }
}
