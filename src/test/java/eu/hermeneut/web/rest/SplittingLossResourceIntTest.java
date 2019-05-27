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

import eu.hermeneut.domain.SplittingLoss;
import eu.hermeneut.repository.SplittingLossRepository;
import eu.hermeneut.service.SplittingLossService;
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
import java.util.List;

import static eu.hermeneut.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.domain.enumeration.CategoryType;
/**
 * Test class for the SplittingLossResource REST controller.
 *
 * @see SplittingLossResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class SplittingLossResourceIntTest {

    private static final SectorType DEFAULT_SECTOR_TYPE = SectorType.GLOBAL;
    private static final SectorType UPDATED_SECTOR_TYPE = SectorType.FINANCE_AND_INSURANCE;

    private static final CategoryType DEFAULT_CATEGORY_TYPE = CategoryType.IP;
    private static final CategoryType UPDATED_CATEGORY_TYPE = CategoryType.KEY_COMP;

    private static final BigDecimal DEFAULT_LOSS_PERCENTAGE = new BigDecimal(1);
    private static final BigDecimal UPDATED_LOSS_PERCENTAGE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_LOSS = new BigDecimal(1);
    private static final BigDecimal UPDATED_LOSS = new BigDecimal(2);

    @Autowired
    private SplittingLossRepository splittingLossRepository;

    @Autowired
    private SplittingLossService splittingLossService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSplittingLossMockMvc;

    private SplittingLoss splittingLoss;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SplittingLossResource splittingLossResource = new SplittingLossResource(splittingLossService);
        this.restSplittingLossMockMvc = MockMvcBuilders.standaloneSetup(splittingLossResource)
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
    public static SplittingLoss createEntity(EntityManager em) {
        SplittingLoss splittingLoss = new SplittingLoss()
            .sectorType(DEFAULT_SECTOR_TYPE)
            .categoryType(DEFAULT_CATEGORY_TYPE)
            .lossPercentage(DEFAULT_LOSS_PERCENTAGE)
            .loss(DEFAULT_LOSS);
        return splittingLoss;
    }

    @Before
    public void initTest() {
        splittingLoss = createEntity(em);
    }

    @Test
    @Transactional
    public void createSplittingLoss() throws Exception {
        int databaseSizeBeforeCreate = splittingLossRepository.findAll().size();

        // Create the SplittingLoss
        restSplittingLossMockMvc.perform(post("/api/splitting-losses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(splittingLoss)))
            .andExpect(status().isCreated());

        // Validate the SplittingLoss in the database
        List<SplittingLoss> splittingLossList = splittingLossRepository.findAll();
        assertThat(splittingLossList).hasSize(databaseSizeBeforeCreate + 1);
        SplittingLoss testSplittingLoss = splittingLossList.get(splittingLossList.size() - 1);
        assertThat(testSplittingLoss.getSectorType()).isEqualTo(DEFAULT_SECTOR_TYPE);
        assertThat(testSplittingLoss.getCategoryType()).isEqualTo(DEFAULT_CATEGORY_TYPE);
        assertThat(testSplittingLoss.getLossPercentage()).isEqualTo(DEFAULT_LOSS_PERCENTAGE);
        assertThat(testSplittingLoss.getLoss()).isEqualTo(DEFAULT_LOSS);
    }

    @Test
    @Transactional
    public void createSplittingLossWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = splittingLossRepository.findAll().size();

        // Create the SplittingLoss with an existing ID
        splittingLoss.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSplittingLossMockMvc.perform(post("/api/splitting-losses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(splittingLoss)))
            .andExpect(status().isBadRequest());

        // Validate the SplittingLoss in the database
        List<SplittingLoss> splittingLossList = splittingLossRepository.findAll();
        assertThat(splittingLossList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSplittingLosses() throws Exception {
        // Initialize the database
        splittingLossRepository.saveAndFlush(splittingLoss);

        // Get all the splittingLossList
        restSplittingLossMockMvc.perform(get("/api/splitting-losses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(splittingLoss.getId().intValue())))
            .andExpect(jsonPath("$.[*].sectorType").value(hasItem(DEFAULT_SECTOR_TYPE.toString())))
            .andExpect(jsonPath("$.[*].categoryType").value(hasItem(DEFAULT_CATEGORY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].lossPercentage").value(hasItem(DEFAULT_LOSS_PERCENTAGE.intValue())))
            .andExpect(jsonPath("$.[*].loss").value(hasItem(DEFAULT_LOSS.intValue())));
    }

    @Test
    @Transactional
    public void getSplittingLoss() throws Exception {
        // Initialize the database
        splittingLossRepository.saveAndFlush(splittingLoss);

        // Get the splittingLoss
        restSplittingLossMockMvc.perform(get("/api/splitting-losses/{id}", splittingLoss.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(splittingLoss.getId().intValue()))
            .andExpect(jsonPath("$.sectorType").value(DEFAULT_SECTOR_TYPE.toString()))
            .andExpect(jsonPath("$.categoryType").value(DEFAULT_CATEGORY_TYPE.toString()))
            .andExpect(jsonPath("$.lossPercentage").value(DEFAULT_LOSS_PERCENTAGE.intValue()))
            .andExpect(jsonPath("$.loss").value(DEFAULT_LOSS.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSplittingLoss() throws Exception {
        // Get the splittingLoss
        restSplittingLossMockMvc.perform(get("/api/splitting-losses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSplittingLoss() throws Exception {
        // Initialize the database
        splittingLossService.save(splittingLoss);

        int databaseSizeBeforeUpdate = splittingLossRepository.findAll().size();

        // Update the splittingLoss
        SplittingLoss updatedSplittingLoss = splittingLossRepository.findOne(splittingLoss.getId());
        // Disconnect from session so that the updates on updatedSplittingLoss are not directly saved in db
        em.detach(updatedSplittingLoss);
        updatedSplittingLoss
            .sectorType(UPDATED_SECTOR_TYPE)
            .categoryType(UPDATED_CATEGORY_TYPE)
            .lossPercentage(UPDATED_LOSS_PERCENTAGE)
            .loss(UPDATED_LOSS);

        restSplittingLossMockMvc.perform(put("/api/splitting-losses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSplittingLoss)))
            .andExpect(status().isOk());

        // Validate the SplittingLoss in the database
        List<SplittingLoss> splittingLossList = splittingLossRepository.findAll();
        assertThat(splittingLossList).hasSize(databaseSizeBeforeUpdate);
        SplittingLoss testSplittingLoss = splittingLossList.get(splittingLossList.size() - 1);
        assertThat(testSplittingLoss.getSectorType()).isEqualTo(UPDATED_SECTOR_TYPE);
        assertThat(testSplittingLoss.getCategoryType()).isEqualTo(UPDATED_CATEGORY_TYPE);
        assertThat(testSplittingLoss.getLossPercentage()).isEqualTo(UPDATED_LOSS_PERCENTAGE);
        assertThat(testSplittingLoss.getLoss()).isEqualTo(UPDATED_LOSS);
    }

    @Test
    @Transactional
    public void updateNonExistingSplittingLoss() throws Exception {
        int databaseSizeBeforeUpdate = splittingLossRepository.findAll().size();

        // Create the SplittingLoss

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSplittingLossMockMvc.perform(put("/api/splitting-losses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(splittingLoss)))
            .andExpect(status().isCreated());

        // Validate the SplittingLoss in the database
        List<SplittingLoss> splittingLossList = splittingLossRepository.findAll();
        assertThat(splittingLossList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSplittingLoss() throws Exception {
        // Initialize the database
        splittingLossService.save(splittingLoss);

        int databaseSizeBeforeDelete = splittingLossRepository.findAll().size();

        // Get the splittingLoss
        restSplittingLossMockMvc.perform(delete("/api/splitting-losses/{id}", splittingLoss.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SplittingLoss> splittingLossList = splittingLossRepository.findAll();
        assertThat(splittingLossList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SplittingLoss.class);
        SplittingLoss splittingLoss1 = new SplittingLoss();
        splittingLoss1.setId(1L);
        SplittingLoss splittingLoss2 = new SplittingLoss();
        splittingLoss2.setId(splittingLoss1.getId());
        assertThat(splittingLoss1).isEqualTo(splittingLoss2);
        splittingLoss2.setId(2L);
        assertThat(splittingLoss1).isNotEqualTo(splittingLoss2);
        splittingLoss1.setId(null);
        assertThat(splittingLoss1).isNotEqualTo(splittingLoss2);
    }
}
