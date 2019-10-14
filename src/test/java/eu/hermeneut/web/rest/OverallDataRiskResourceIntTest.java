package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.OverallDataRisk;
import eu.hermeneut.repository.OverallDataRiskRepository;
import eu.hermeneut.service.OverallDataRiskService;
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

import eu.hermeneut.domain.enumeration.DataRiskLevel;
/**
 * Test class for the OverallDataRiskResource REST controller.
 *
 * @see OverallDataRiskResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class OverallDataRiskResourceIntTest {

    private static final DataRiskLevel DEFAULT_RISK_LEVEL = DataRiskLevel.LOW;
    private static final DataRiskLevel UPDATED_RISK_LEVEL = DataRiskLevel.MEDIUM;

    @Autowired
    private OverallDataRiskRepository overallDataRiskRepository;

    @Autowired
    private OverallDataRiskService overallDataRiskService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restOverallDataRiskMockMvc;

    private OverallDataRisk overallDataRisk;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OverallDataRiskResource overallDataRiskResource = new OverallDataRiskResource(overallDataRiskService);
        this.restOverallDataRiskMockMvc = MockMvcBuilders.standaloneSetup(overallDataRiskResource)
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
    public static OverallDataRisk createEntity(EntityManager em) {
        OverallDataRisk overallDataRisk = new OverallDataRisk()
            .riskLevel(DEFAULT_RISK_LEVEL);
        return overallDataRisk;
    }

    @Before
    public void initTest() {
        overallDataRisk = createEntity(em);
    }

    @Test
    @Transactional
    public void createOverallDataRisk() throws Exception {
        int databaseSizeBeforeCreate = overallDataRiskRepository.findAll().size();

        // Create the OverallDataRisk
        restOverallDataRiskMockMvc.perform(post("/api/overall-data-risks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallDataRisk)))
            .andExpect(status().isCreated());

        // Validate the OverallDataRisk in the database
        List<OverallDataRisk> overallDataRiskList = overallDataRiskRepository.findAll();
        assertThat(overallDataRiskList).hasSize(databaseSizeBeforeCreate + 1);
        OverallDataRisk testOverallDataRisk = overallDataRiskList.get(overallDataRiskList.size() - 1);
        assertThat(testOverallDataRisk.getRiskLevel()).isEqualTo(DEFAULT_RISK_LEVEL);
    }

    @Test
    @Transactional
    public void createOverallDataRiskWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = overallDataRiskRepository.findAll().size();

        // Create the OverallDataRisk with an existing ID
        overallDataRisk.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOverallDataRiskMockMvc.perform(post("/api/overall-data-risks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallDataRisk)))
            .andExpect(status().isBadRequest());

        // Validate the OverallDataRisk in the database
        List<OverallDataRisk> overallDataRiskList = overallDataRiskRepository.findAll();
        assertThat(overallDataRiskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkRiskLevelIsRequired() throws Exception {
        int databaseSizeBeforeTest = overallDataRiskRepository.findAll().size();
        // set the field null
        overallDataRisk.setRiskLevel(null);

        // Create the OverallDataRisk, which fails.

        restOverallDataRiskMockMvc.perform(post("/api/overall-data-risks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallDataRisk)))
            .andExpect(status().isBadRequest());

        List<OverallDataRisk> overallDataRiskList = overallDataRiskRepository.findAll();
        assertThat(overallDataRiskList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOverallDataRisks() throws Exception {
        // Initialize the database
        overallDataRiskRepository.saveAndFlush(overallDataRisk);

        // Get all the overallDataRiskList
        restOverallDataRiskMockMvc.perform(get("/api/overall-data-risks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(overallDataRisk.getId().intValue())))
            .andExpect(jsonPath("$.[*].riskLevel").value(hasItem(DEFAULT_RISK_LEVEL.toString())));
    }

    @Test
    @Transactional
    public void getOverallDataRisk() throws Exception {
        // Initialize the database
        overallDataRiskRepository.saveAndFlush(overallDataRisk);

        // Get the overallDataRisk
        restOverallDataRiskMockMvc.perform(get("/api/overall-data-risks/{id}", overallDataRisk.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(overallDataRisk.getId().intValue()))
            .andExpect(jsonPath("$.riskLevel").value(DEFAULT_RISK_LEVEL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOverallDataRisk() throws Exception {
        // Get the overallDataRisk
        restOverallDataRiskMockMvc.perform(get("/api/overall-data-risks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOverallDataRisk() throws Exception {
        // Initialize the database
        overallDataRiskService.save(overallDataRisk);

        int databaseSizeBeforeUpdate = overallDataRiskRepository.findAll().size();

        // Update the overallDataRisk
        OverallDataRisk updatedOverallDataRisk = overallDataRiskRepository.findOne(overallDataRisk.getId());
        // Disconnect from session so that the updates on updatedOverallDataRisk are not directly saved in db
        em.detach(updatedOverallDataRisk);
        updatedOverallDataRisk
            .riskLevel(UPDATED_RISK_LEVEL);

        restOverallDataRiskMockMvc.perform(put("/api/overall-data-risks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOverallDataRisk)))
            .andExpect(status().isOk());

        // Validate the OverallDataRisk in the database
        List<OverallDataRisk> overallDataRiskList = overallDataRiskRepository.findAll();
        assertThat(overallDataRiskList).hasSize(databaseSizeBeforeUpdate);
        OverallDataRisk testOverallDataRisk = overallDataRiskList.get(overallDataRiskList.size() - 1);
        assertThat(testOverallDataRisk.getRiskLevel()).isEqualTo(UPDATED_RISK_LEVEL);
    }

    @Test
    @Transactional
    public void updateNonExistingOverallDataRisk() throws Exception {
        int databaseSizeBeforeUpdate = overallDataRiskRepository.findAll().size();

        // Create the OverallDataRisk

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restOverallDataRiskMockMvc.perform(put("/api/overall-data-risks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallDataRisk)))
            .andExpect(status().isCreated());

        // Validate the OverallDataRisk in the database
        List<OverallDataRisk> overallDataRiskList = overallDataRiskRepository.findAll();
        assertThat(overallDataRiskList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteOverallDataRisk() throws Exception {
        // Initialize the database
        overallDataRiskService.save(overallDataRisk);

        int databaseSizeBeforeDelete = overallDataRiskRepository.findAll().size();

        // Get the overallDataRisk
        restOverallDataRiskMockMvc.perform(delete("/api/overall-data-risks/{id}", overallDataRisk.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<OverallDataRisk> overallDataRiskList = overallDataRiskRepository.findAll();
        assertThat(overallDataRiskList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OverallDataRisk.class);
        OverallDataRisk overallDataRisk1 = new OverallDataRisk();
        overallDataRisk1.setId(1L);
        OverallDataRisk overallDataRisk2 = new OverallDataRisk();
        overallDataRisk2.setId(overallDataRisk1.getId());
        assertThat(overallDataRisk1).isEqualTo(overallDataRisk2);
        overallDataRisk2.setId(2L);
        assertThat(overallDataRisk1).isNotEqualTo(overallDataRisk2);
        overallDataRisk1.setId(null);
        assertThat(overallDataRisk1).isNotEqualTo(overallDataRisk2);
    }
}
