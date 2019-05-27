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

import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.repository.EconomicCoefficientsRepository;
import eu.hermeneut.service.EconomicCoefficientsService;
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

/**
 * Test class for the EconomicCoefficientsResource REST controller.
 *
 * @see EconomicCoefficientsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class EconomicCoefficientsResourceIntTest {

    private static final BigDecimal DEFAULT_DISCOUNTING_RATE = new BigDecimal(0);
    private static final BigDecimal UPDATED_DISCOUNTING_RATE = new BigDecimal(1);

    private static final BigDecimal DEFAULT_PHYSICAL_ASSETS_RETURN = new BigDecimal(1);
    private static final BigDecimal UPDATED_PHYSICAL_ASSETS_RETURN = new BigDecimal(2);

    private static final BigDecimal DEFAULT_FINANCIAL_ASSETS_RETURN = new BigDecimal(1);
    private static final BigDecimal UPDATED_FINANCIAL_ASSETS_RETURN = new BigDecimal(2);

    private static final BigDecimal DEFAULT_LOSS_OF_INTANGIBLE = new BigDecimal(1);
    private static final BigDecimal UPDATED_LOSS_OF_INTANGIBLE = new BigDecimal(2);

    @Autowired
    private EconomicCoefficientsRepository economicCoefficientsRepository;

    @Autowired
    private EconomicCoefficientsService economicCoefficientsService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEconomicCoefficientsMockMvc;

    private EconomicCoefficients economicCoefficients;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EconomicCoefficientsResource economicCoefficientsResource = new EconomicCoefficientsResource(economicCoefficientsService);
        this.restEconomicCoefficientsMockMvc = MockMvcBuilders.standaloneSetup(economicCoefficientsResource)
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
    public static EconomicCoefficients createEntity(EntityManager em) {
        EconomicCoefficients economicCoefficients = new EconomicCoefficients()
            .discountingRate(DEFAULT_DISCOUNTING_RATE)
            .physicalAssetsReturn(DEFAULT_PHYSICAL_ASSETS_RETURN)
            .financialAssetsReturn(DEFAULT_FINANCIAL_ASSETS_RETURN)
            .lossOfIntangible(DEFAULT_LOSS_OF_INTANGIBLE);
        return economicCoefficients;
    }

    @Before
    public void initTest() {
        economicCoefficients = createEntity(em);
    }

    @Test
    @Transactional
    public void createEconomicCoefficients() throws Exception {
        int databaseSizeBeforeCreate = economicCoefficientsRepository.findAll().size();

        // Create the EconomicCoefficients
        restEconomicCoefficientsMockMvc.perform(post("/api/economic-coefficients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(economicCoefficients)))
            .andExpect(status().isCreated());

        // Validate the EconomicCoefficients in the database
        List<EconomicCoefficients> economicCoefficientsList = economicCoefficientsRepository.findAll();
        assertThat(economicCoefficientsList).hasSize(databaseSizeBeforeCreate + 1);
        EconomicCoefficients testEconomicCoefficients = economicCoefficientsList.get(economicCoefficientsList.size() - 1);
        assertThat(testEconomicCoefficients.getDiscountingRate()).isEqualTo(DEFAULT_DISCOUNTING_RATE);
        assertThat(testEconomicCoefficients.getPhysicalAssetsReturn()).isEqualTo(DEFAULT_PHYSICAL_ASSETS_RETURN);
        assertThat(testEconomicCoefficients.getFinancialAssetsReturn()).isEqualTo(DEFAULT_FINANCIAL_ASSETS_RETURN);
        assertThat(testEconomicCoefficients.getLossOfIntangible()).isEqualTo(DEFAULT_LOSS_OF_INTANGIBLE);
    }

    @Test
    @Transactional
    public void createEconomicCoefficientsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = economicCoefficientsRepository.findAll().size();

        // Create the EconomicCoefficients with an existing ID
        economicCoefficients.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEconomicCoefficientsMockMvc.perform(post("/api/economic-coefficients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(economicCoefficients)))
            .andExpect(status().isBadRequest());

        // Validate the EconomicCoefficients in the database
        List<EconomicCoefficients> economicCoefficientsList = economicCoefficientsRepository.findAll();
        assertThat(economicCoefficientsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllEconomicCoefficients() throws Exception {
        // Initialize the database
        economicCoefficientsRepository.saveAndFlush(economicCoefficients);

        // Get all the economicCoefficientsList
        restEconomicCoefficientsMockMvc.perform(get("/api/economic-coefficients?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(economicCoefficients.getId().intValue())))
            .andExpect(jsonPath("$.[*].discountingRate").value(hasItem(DEFAULT_DISCOUNTING_RATE.intValue())))
            .andExpect(jsonPath("$.[*].physicalAssetsReturn").value(hasItem(DEFAULT_PHYSICAL_ASSETS_RETURN.intValue())))
            .andExpect(jsonPath("$.[*].financialAssetsReturn").value(hasItem(DEFAULT_FINANCIAL_ASSETS_RETURN.intValue())))
            .andExpect(jsonPath("$.[*].lossOfIntangible").value(hasItem(DEFAULT_LOSS_OF_INTANGIBLE.intValue())));
    }

    @Test
    @Transactional
    public void getEconomicCoefficients() throws Exception {
        // Initialize the database
        economicCoefficientsRepository.saveAndFlush(economicCoefficients);

        // Get the economicCoefficients
        restEconomicCoefficientsMockMvc.perform(get("/api/economic-coefficients/{id}", economicCoefficients.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(economicCoefficients.getId().intValue()))
            .andExpect(jsonPath("$.discountingRate").value(DEFAULT_DISCOUNTING_RATE.intValue()))
            .andExpect(jsonPath("$.physicalAssetsReturn").value(DEFAULT_PHYSICAL_ASSETS_RETURN.intValue()))
            .andExpect(jsonPath("$.financialAssetsReturn").value(DEFAULT_FINANCIAL_ASSETS_RETURN.intValue()))
            .andExpect(jsonPath("$.lossOfIntangible").value(DEFAULT_LOSS_OF_INTANGIBLE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingEconomicCoefficients() throws Exception {
        // Get the economicCoefficients
        restEconomicCoefficientsMockMvc.perform(get("/api/economic-coefficients/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEconomicCoefficients() throws Exception {
        // Initialize the database
        economicCoefficientsService.save(economicCoefficients);

        int databaseSizeBeforeUpdate = economicCoefficientsRepository.findAll().size();

        // Update the economicCoefficients
        EconomicCoefficients updatedEconomicCoefficients = economicCoefficientsRepository.findOne(economicCoefficients.getId());
        // Disconnect from session so that the updates on updatedEconomicCoefficients are not directly saved in db
        em.detach(updatedEconomicCoefficients);
        updatedEconomicCoefficients
            .discountingRate(UPDATED_DISCOUNTING_RATE)
            .physicalAssetsReturn(UPDATED_PHYSICAL_ASSETS_RETURN)
            .financialAssetsReturn(UPDATED_FINANCIAL_ASSETS_RETURN)
            .lossOfIntangible(UPDATED_LOSS_OF_INTANGIBLE);

        restEconomicCoefficientsMockMvc.perform(put("/api/economic-coefficients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEconomicCoefficients)))
            .andExpect(status().isOk());

        // Validate the EconomicCoefficients in the database
        List<EconomicCoefficients> economicCoefficientsList = economicCoefficientsRepository.findAll();
        assertThat(economicCoefficientsList).hasSize(databaseSizeBeforeUpdate);
        EconomicCoefficients testEconomicCoefficients = economicCoefficientsList.get(economicCoefficientsList.size() - 1);
        assertThat(testEconomicCoefficients.getDiscountingRate()).isEqualTo(UPDATED_DISCOUNTING_RATE);
        assertThat(testEconomicCoefficients.getPhysicalAssetsReturn()).isEqualTo(UPDATED_PHYSICAL_ASSETS_RETURN);
        assertThat(testEconomicCoefficients.getFinancialAssetsReturn()).isEqualTo(UPDATED_FINANCIAL_ASSETS_RETURN);
        assertThat(testEconomicCoefficients.getLossOfIntangible()).isEqualTo(UPDATED_LOSS_OF_INTANGIBLE);
    }

    @Test
    @Transactional
    public void updateNonExistingEconomicCoefficients() throws Exception {
        int databaseSizeBeforeUpdate = economicCoefficientsRepository.findAll().size();

        // Create the EconomicCoefficients

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEconomicCoefficientsMockMvc.perform(put("/api/economic-coefficients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(economicCoefficients)))
            .andExpect(status().isCreated());

        // Validate the EconomicCoefficients in the database
        List<EconomicCoefficients> economicCoefficientsList = economicCoefficientsRepository.findAll();
        assertThat(economicCoefficientsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEconomicCoefficients() throws Exception {
        // Initialize the database
        economicCoefficientsService.save(economicCoefficients);

        int databaseSizeBeforeDelete = economicCoefficientsRepository.findAll().size();

        // Get the economicCoefficients
        restEconomicCoefficientsMockMvc.perform(delete("/api/economic-coefficients/{id}", economicCoefficients.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<EconomicCoefficients> economicCoefficientsList = economicCoefficientsRepository.findAll();
        assertThat(economicCoefficientsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EconomicCoefficients.class);
        EconomicCoefficients economicCoefficients1 = new EconomicCoefficients();
        economicCoefficients1.setId(1L);
        EconomicCoefficients economicCoefficients2 = new EconomicCoefficients();
        economicCoefficients2.setId(economicCoefficients1.getId());
        assertThat(economicCoefficients1).isEqualTo(economicCoefficients2);
        economicCoefficients2.setId(2L);
        assertThat(economicCoefficients1).isNotEqualTo(economicCoefficients2);
        economicCoefficients1.setId(null);
        assertThat(economicCoefficients1).isNotEqualTo(economicCoefficients2);
    }
}
