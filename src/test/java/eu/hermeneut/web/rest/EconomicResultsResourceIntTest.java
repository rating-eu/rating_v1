package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.repository.EconomicResultsRepository;
import eu.hermeneut.service.EconomicResultsService;
import eu.hermeneut.repository.search.EconomicResultsSearchRepository;
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
 * Test class for the EconomicResultsResource REST controller.
 *
 * @see EconomicResultsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class EconomicResultsResourceIntTest {

    private static final Double DEFAULT_ECONOMIC_PERFORMANCE = 1D;
    private static final Double UPDATED_ECONOMIC_PERFORMANCE = 2D;

    private static final Double DEFAULT_INTANGIBLE_DRIVING_EARNINGS = 1D;
    private static final Double UPDATED_INTANGIBLE_DRIVING_EARNINGS = 2D;

    private static final Double DEFAULT_INTANGIBLE_CAPITAL = 1D;
    private static final Double UPDATED_INTANGIBLE_CAPITAL = 2D;

    private static final Double DEFAULT_INTANGIBLE_LOSS_BY_ATTACKS = 1D;
    private static final Double UPDATED_INTANGIBLE_LOSS_BY_ATTACKS = 2D;

    @Autowired
    private EconomicResultsRepository economicResultsRepository;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private EconomicResultsSearchRepository economicResultsSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEconomicResultsMockMvc;

    private EconomicResults economicResults;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EconomicResultsResource economicResultsResource = new EconomicResultsResource(economicResultsService);
        this.restEconomicResultsMockMvc = MockMvcBuilders.standaloneSetup(economicResultsResource)
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
    public static EconomicResults createEntity(EntityManager em) {
        EconomicResults economicResults = new EconomicResults()
            .economicPerformance(DEFAULT_ECONOMIC_PERFORMANCE)
            .intangibleDrivingEarnings(DEFAULT_INTANGIBLE_DRIVING_EARNINGS)
            .intangibleCapital(DEFAULT_INTANGIBLE_CAPITAL)
            .intangibleLossByAttacks(DEFAULT_INTANGIBLE_LOSS_BY_ATTACKS);
        return economicResults;
    }

    @Before
    public void initTest() {
        economicResultsSearchRepository.deleteAll();
        economicResults = createEntity(em);
    }

    @Test
    @Transactional
    public void createEconomicResults() throws Exception {
        int databaseSizeBeforeCreate = economicResultsRepository.findAll().size();

        // Create the EconomicResults
        restEconomicResultsMockMvc.perform(post("/api/economic-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(economicResults)))
            .andExpect(status().isCreated());

        // Validate the EconomicResults in the database
        List<EconomicResults> economicResultsList = economicResultsRepository.findAll();
        assertThat(economicResultsList).hasSize(databaseSizeBeforeCreate + 1);
        EconomicResults testEconomicResults = economicResultsList.get(economicResultsList.size() - 1);
        assertThat(testEconomicResults.getEconomicPerformance()).isEqualTo(DEFAULT_ECONOMIC_PERFORMANCE);
        assertThat(testEconomicResults.getIntangibleDrivingEarnings()).isEqualTo(DEFAULT_INTANGIBLE_DRIVING_EARNINGS);
        assertThat(testEconomicResults.getIntangibleCapital()).isEqualTo(DEFAULT_INTANGIBLE_CAPITAL);
        assertThat(testEconomicResults.getIntangibleLossByAttacks()).isEqualTo(DEFAULT_INTANGIBLE_LOSS_BY_ATTACKS);

        // Validate the EconomicResults in Elasticsearch
        EconomicResults economicResultsEs = economicResultsSearchRepository.findOne(testEconomicResults.getId());
        assertThat(economicResultsEs).isEqualToIgnoringGivenFields(testEconomicResults);
    }

    @Test
    @Transactional
    public void createEconomicResultsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = economicResultsRepository.findAll().size();

        // Create the EconomicResults with an existing ID
        economicResults.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEconomicResultsMockMvc.perform(post("/api/economic-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(economicResults)))
            .andExpect(status().isBadRequest());

        // Validate the EconomicResults in the database
        List<EconomicResults> economicResultsList = economicResultsRepository.findAll();
        assertThat(economicResultsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllEconomicResults() throws Exception {
        // Initialize the database
        economicResultsRepository.saveAndFlush(economicResults);

        // Get all the economicResultsList
        restEconomicResultsMockMvc.perform(get("/api/economic-results?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(economicResults.getId().intValue())))
            .andExpect(jsonPath("$.[*].economicPerformance").value(hasItem(DEFAULT_ECONOMIC_PERFORMANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].intangibleDrivingEarnings").value(hasItem(DEFAULT_INTANGIBLE_DRIVING_EARNINGS.doubleValue())))
            .andExpect(jsonPath("$.[*].intangibleCapital").value(hasItem(DEFAULT_INTANGIBLE_CAPITAL.doubleValue())))
            .andExpect(jsonPath("$.[*].intangibleLossByAttacks").value(hasItem(DEFAULT_INTANGIBLE_LOSS_BY_ATTACKS.doubleValue())));
    }

    @Test
    @Transactional
    public void getEconomicResults() throws Exception {
        // Initialize the database
        economicResultsRepository.saveAndFlush(economicResults);

        // Get the economicResults
        restEconomicResultsMockMvc.perform(get("/api/economic-results/{id}", economicResults.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(economicResults.getId().intValue()))
            .andExpect(jsonPath("$.economicPerformance").value(DEFAULT_ECONOMIC_PERFORMANCE.doubleValue()))
            .andExpect(jsonPath("$.intangibleDrivingEarnings").value(DEFAULT_INTANGIBLE_DRIVING_EARNINGS.doubleValue()))
            .andExpect(jsonPath("$.intangibleCapital").value(DEFAULT_INTANGIBLE_CAPITAL.doubleValue()))
            .andExpect(jsonPath("$.intangibleLossByAttacks").value(DEFAULT_INTANGIBLE_LOSS_BY_ATTACKS.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingEconomicResults() throws Exception {
        // Get the economicResults
        restEconomicResultsMockMvc.perform(get("/api/economic-results/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEconomicResults() throws Exception {
        // Initialize the database
        economicResultsService.save(economicResults);

        int databaseSizeBeforeUpdate = economicResultsRepository.findAll().size();

        // Update the economicResults
        EconomicResults updatedEconomicResults = economicResultsRepository.findOne(economicResults.getId());
        // Disconnect from session so that the updates on updatedEconomicResults are not directly saved in db
        em.detach(updatedEconomicResults);
        updatedEconomicResults
            .economicPerformance(UPDATED_ECONOMIC_PERFORMANCE)
            .intangibleDrivingEarnings(UPDATED_INTANGIBLE_DRIVING_EARNINGS)
            .intangibleCapital(UPDATED_INTANGIBLE_CAPITAL)
            .intangibleLossByAttacks(UPDATED_INTANGIBLE_LOSS_BY_ATTACKS);

        restEconomicResultsMockMvc.perform(put("/api/economic-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEconomicResults)))
            .andExpect(status().isOk());

        // Validate the EconomicResults in the database
        List<EconomicResults> economicResultsList = economicResultsRepository.findAll();
        assertThat(economicResultsList).hasSize(databaseSizeBeforeUpdate);
        EconomicResults testEconomicResults = economicResultsList.get(economicResultsList.size() - 1);
        assertThat(testEconomicResults.getEconomicPerformance()).isEqualTo(UPDATED_ECONOMIC_PERFORMANCE);
        assertThat(testEconomicResults.getIntangibleDrivingEarnings()).isEqualTo(UPDATED_INTANGIBLE_DRIVING_EARNINGS);
        assertThat(testEconomicResults.getIntangibleCapital()).isEqualTo(UPDATED_INTANGIBLE_CAPITAL);
        assertThat(testEconomicResults.getIntangibleLossByAttacks()).isEqualTo(UPDATED_INTANGIBLE_LOSS_BY_ATTACKS);

        // Validate the EconomicResults in Elasticsearch
        EconomicResults economicResultsEs = economicResultsSearchRepository.findOne(testEconomicResults.getId());
        assertThat(economicResultsEs).isEqualToIgnoringGivenFields(testEconomicResults);
    }

    @Test
    @Transactional
    public void updateNonExistingEconomicResults() throws Exception {
        int databaseSizeBeforeUpdate = economicResultsRepository.findAll().size();

        // Create the EconomicResults

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEconomicResultsMockMvc.perform(put("/api/economic-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(economicResults)))
            .andExpect(status().isCreated());

        // Validate the EconomicResults in the database
        List<EconomicResults> economicResultsList = economicResultsRepository.findAll();
        assertThat(economicResultsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEconomicResults() throws Exception {
        // Initialize the database
        economicResultsService.save(economicResults);

        int databaseSizeBeforeDelete = economicResultsRepository.findAll().size();

        // Get the economicResults
        restEconomicResultsMockMvc.perform(delete("/api/economic-results/{id}", economicResults.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean economicResultsExistsInEs = economicResultsSearchRepository.exists(economicResults.getId());
        assertThat(economicResultsExistsInEs).isFalse();

        // Validate the database is empty
        List<EconomicResults> economicResultsList = economicResultsRepository.findAll();
        assertThat(economicResultsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchEconomicResults() throws Exception {
        // Initialize the database
        economicResultsService.save(economicResults);

        // Search the economicResults
        restEconomicResultsMockMvc.perform(get("/api/_search/economic-results?query=id:" + economicResults.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(economicResults.getId().intValue())))
            .andExpect(jsonPath("$.[*].economicPerformance").value(hasItem(DEFAULT_ECONOMIC_PERFORMANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].intangibleDrivingEarnings").value(hasItem(DEFAULT_INTANGIBLE_DRIVING_EARNINGS.doubleValue())))
            .andExpect(jsonPath("$.[*].intangibleCapital").value(hasItem(DEFAULT_INTANGIBLE_CAPITAL.doubleValue())))
            .andExpect(jsonPath("$.[*].intangibleLossByAttacks").value(hasItem(DEFAULT_INTANGIBLE_LOSS_BY_ATTACKS.doubleValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EconomicResults.class);
        EconomicResults economicResults1 = new EconomicResults();
        economicResults1.setId(1L);
        EconomicResults economicResults2 = new EconomicResults();
        economicResults2.setId(economicResults1.getId());
        assertThat(economicResults1).isEqualTo(economicResults2);
        economicResults2.setId(2L);
        assertThat(economicResults1).isNotEqualTo(economicResults2);
        economicResults1.setId(null);
        assertThat(economicResults1).isNotEqualTo(economicResults2);
    }
}
