package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.repository.EconomicCoefficientsRepository;
import eu.hermeneut.service.EconomicCoefficientsService;
import eu.hermeneut.repository.search.EconomicCoefficientsSearchRepository;
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
 * Test class for the EconomicCoefficientsResource REST controller.
 *
 * @see EconomicCoefficientsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class EconomicCoefficientsResourceIntTest {

    private static final Double DEFAULT_DISCOUNTING_RATE = 1D;
    private static final Double UPDATED_DISCOUNTING_RATE = 2D;

    private static final Double DEFAULT_PHYSICAL_ASSETS_RETURN = 1D;
    private static final Double UPDATED_PHYSICAL_ASSETS_RETURN = 2D;

    private static final Double DEFAULT_FINANCIAL_ASSETS_RETURN = 1D;
    private static final Double UPDATED_FINANCIAL_ASSETS_RETURN = 2D;

    private static final Double DEFAULT_LOSS_OF_INTANGIBLE = 1D;
    private static final Double UPDATED_LOSS_OF_INTANGIBLE = 2D;

    @Autowired
    private EconomicCoefficientsRepository economicCoefficientsRepository;

    @Autowired
    private EconomicCoefficientsService economicCoefficientsService;

    @Autowired
    private EconomicCoefficientsSearchRepository economicCoefficientsSearchRepository;

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
        economicCoefficientsSearchRepository.deleteAll();
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

        // Validate the EconomicCoefficients in Elasticsearch
        EconomicCoefficients economicCoefficientsEs = economicCoefficientsSearchRepository.findOne(testEconomicCoefficients.getId());
        assertThat(economicCoefficientsEs).isEqualToIgnoringGivenFields(testEconomicCoefficients);
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
            .andExpect(jsonPath("$.[*].discountingRate").value(hasItem(DEFAULT_DISCOUNTING_RATE.doubleValue())))
            .andExpect(jsonPath("$.[*].physicalAssetsReturn").value(hasItem(DEFAULT_PHYSICAL_ASSETS_RETURN.doubleValue())))
            .andExpect(jsonPath("$.[*].financialAssetsReturn").value(hasItem(DEFAULT_FINANCIAL_ASSETS_RETURN.doubleValue())))
            .andExpect(jsonPath("$.[*].lossOfIntangible").value(hasItem(DEFAULT_LOSS_OF_INTANGIBLE.doubleValue())));
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
            .andExpect(jsonPath("$.discountingRate").value(DEFAULT_DISCOUNTING_RATE.doubleValue()))
            .andExpect(jsonPath("$.physicalAssetsReturn").value(DEFAULT_PHYSICAL_ASSETS_RETURN.doubleValue()))
            .andExpect(jsonPath("$.financialAssetsReturn").value(DEFAULT_FINANCIAL_ASSETS_RETURN.doubleValue()))
            .andExpect(jsonPath("$.lossOfIntangible").value(DEFAULT_LOSS_OF_INTANGIBLE.doubleValue()));
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

        // Validate the EconomicCoefficients in Elasticsearch
        EconomicCoefficients economicCoefficientsEs = economicCoefficientsSearchRepository.findOne(testEconomicCoefficients.getId());
        assertThat(economicCoefficientsEs).isEqualToIgnoringGivenFields(testEconomicCoefficients);
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

        // Validate Elasticsearch is empty
        boolean economicCoefficientsExistsInEs = economicCoefficientsSearchRepository.exists(economicCoefficients.getId());
        assertThat(economicCoefficientsExistsInEs).isFalse();

        // Validate the database is empty
        List<EconomicCoefficients> economicCoefficientsList = economicCoefficientsRepository.findAll();
        assertThat(economicCoefficientsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchEconomicCoefficients() throws Exception {
        // Initialize the database
        economicCoefficientsService.save(economicCoefficients);

        // Search the economicCoefficients
        restEconomicCoefficientsMockMvc.perform(get("/api/_search/economic-coefficients?query=id:" + economicCoefficients.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(economicCoefficients.getId().intValue())))
            .andExpect(jsonPath("$.[*].discountingRate").value(hasItem(DEFAULT_DISCOUNTING_RATE.doubleValue())))
            .andExpect(jsonPath("$.[*].physicalAssetsReturn").value(hasItem(DEFAULT_PHYSICAL_ASSETS_RETURN.doubleValue())))
            .andExpect(jsonPath("$.[*].financialAssetsReturn").value(hasItem(DEFAULT_FINANCIAL_ASSETS_RETURN.doubleValue())))
            .andExpect(jsonPath("$.[*].lossOfIntangible").value(hasItem(DEFAULT_LOSS_OF_INTANGIBLE.doubleValue())));
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
