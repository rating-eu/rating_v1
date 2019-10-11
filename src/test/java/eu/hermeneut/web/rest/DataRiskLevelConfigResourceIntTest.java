package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.DataRiskLevelConfig;
import eu.hermeneut.repository.DataRiskLevelConfigRepository;
import eu.hermeneut.service.DataRiskLevelConfigService;
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

import eu.hermeneut.domain.enumeration.DataThreatLikelihood;
import eu.hermeneut.domain.enumeration.DataImpact;
import eu.hermeneut.domain.enumeration.DataRiskLevel;
/**
 * Test class for the DataRiskLevelConfigResource REST controller.
 *
 * @see DataRiskLevelConfigResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class DataRiskLevelConfigResourceIntTest {

    private static final String DEFAULT_RATIONALE = "AAAAAAAAAA";
    private static final String UPDATED_RATIONALE = "BBBBBBBBBB";

    private static final DataThreatLikelihood DEFAULT_LIKELIHOOD = DataThreatLikelihood.LOW;
    private static final DataThreatLikelihood UPDATED_LIKELIHOOD = DataThreatLikelihood.MEDIUM;

    private static final DataImpact DEFAULT_IMPACT = DataImpact.LOW;
    private static final DataImpact UPDATED_IMPACT = DataImpact.MEDIUM;

    private static final DataRiskLevel DEFAULT_RISK = DataRiskLevel.LOW;
    private static final DataRiskLevel UPDATED_RISK = DataRiskLevel.MEDIUM;

    @Autowired
    private DataRiskLevelConfigRepository dataRiskLevelConfigRepository;

    @Autowired
    private DataRiskLevelConfigService dataRiskLevelConfigService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDataRiskLevelConfigMockMvc;

    private DataRiskLevelConfig dataRiskLevelConfig;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DataRiskLevelConfigResource dataRiskLevelConfigResource = new DataRiskLevelConfigResource(dataRiskLevelConfigService);
        this.restDataRiskLevelConfigMockMvc = MockMvcBuilders.standaloneSetup(dataRiskLevelConfigResource)
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
    public static DataRiskLevelConfig createEntity(EntityManager em) {
        DataRiskLevelConfig dataRiskLevelConfig = new DataRiskLevelConfig()
            .rationale(DEFAULT_RATIONALE)
            .likelihood(DEFAULT_LIKELIHOOD)
            .impact(DEFAULT_IMPACT)
            .risk(DEFAULT_RISK);
        return dataRiskLevelConfig;
    }

    @Before
    public void initTest() {
        dataRiskLevelConfig = createEntity(em);
    }

    @Test
    @Transactional
    public void createDataRiskLevelConfig() throws Exception {
        int databaseSizeBeforeCreate = dataRiskLevelConfigRepository.findAll().size();

        // Create the DataRiskLevelConfig
        restDataRiskLevelConfigMockMvc.perform(post("/api/data-risk-level-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRiskLevelConfig)))
            .andExpect(status().isCreated());

        // Validate the DataRiskLevelConfig in the database
        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeCreate + 1);
        DataRiskLevelConfig testDataRiskLevelConfig = dataRiskLevelConfigList.get(dataRiskLevelConfigList.size() - 1);
        assertThat(testDataRiskLevelConfig.getRationale()).isEqualTo(DEFAULT_RATIONALE);
        assertThat(testDataRiskLevelConfig.getLikelihood()).isEqualTo(DEFAULT_LIKELIHOOD);
        assertThat(testDataRiskLevelConfig.getImpact()).isEqualTo(DEFAULT_IMPACT);
        assertThat(testDataRiskLevelConfig.getRisk()).isEqualTo(DEFAULT_RISK);
    }

    @Test
    @Transactional
    public void createDataRiskLevelConfigWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dataRiskLevelConfigRepository.findAll().size();

        // Create the DataRiskLevelConfig with an existing ID
        dataRiskLevelConfig.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataRiskLevelConfigMockMvc.perform(post("/api/data-risk-level-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRiskLevelConfig)))
            .andExpect(status().isBadRequest());

        // Validate the DataRiskLevelConfig in the database
        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkRationaleIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataRiskLevelConfigRepository.findAll().size();
        // set the field null
        dataRiskLevelConfig.setRationale(null);

        // Create the DataRiskLevelConfig, which fails.

        restDataRiskLevelConfigMockMvc.perform(post("/api/data-risk-level-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRiskLevelConfig)))
            .andExpect(status().isBadRequest());

        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLikelihoodIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataRiskLevelConfigRepository.findAll().size();
        // set the field null
        dataRiskLevelConfig.setLikelihood(null);

        // Create the DataRiskLevelConfig, which fails.

        restDataRiskLevelConfigMockMvc.perform(post("/api/data-risk-level-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRiskLevelConfig)))
            .andExpect(status().isBadRequest());

        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkImpactIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataRiskLevelConfigRepository.findAll().size();
        // set the field null
        dataRiskLevelConfig.setImpact(null);

        // Create the DataRiskLevelConfig, which fails.

        restDataRiskLevelConfigMockMvc.perform(post("/api/data-risk-level-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRiskLevelConfig)))
            .andExpect(status().isBadRequest());

        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRiskIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataRiskLevelConfigRepository.findAll().size();
        // set the field null
        dataRiskLevelConfig.setRisk(null);

        // Create the DataRiskLevelConfig, which fails.

        restDataRiskLevelConfigMockMvc.perform(post("/api/data-risk-level-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRiskLevelConfig)))
            .andExpect(status().isBadRequest());

        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDataRiskLevelConfigs() throws Exception {
        // Initialize the database
        dataRiskLevelConfigRepository.saveAndFlush(dataRiskLevelConfig);

        // Get all the dataRiskLevelConfigList
        restDataRiskLevelConfigMockMvc.perform(get("/api/data-risk-level-configs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataRiskLevelConfig.getId().intValue())))
            .andExpect(jsonPath("$.[*].rationale").value(hasItem(DEFAULT_RATIONALE.toString())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_LIKELIHOOD.toString())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT.toString())))
            .andExpect(jsonPath("$.[*].risk").value(hasItem(DEFAULT_RISK.toString())));
    }

    @Test
    @Transactional
    public void getDataRiskLevelConfig() throws Exception {
        // Initialize the database
        dataRiskLevelConfigRepository.saveAndFlush(dataRiskLevelConfig);

        // Get the dataRiskLevelConfig
        restDataRiskLevelConfigMockMvc.perform(get("/api/data-risk-level-configs/{id}", dataRiskLevelConfig.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dataRiskLevelConfig.getId().intValue()))
            .andExpect(jsonPath("$.rationale").value(DEFAULT_RATIONALE.toString()))
            .andExpect(jsonPath("$.likelihood").value(DEFAULT_LIKELIHOOD.toString()))
            .andExpect(jsonPath("$.impact").value(DEFAULT_IMPACT.toString()))
            .andExpect(jsonPath("$.risk").value(DEFAULT_RISK.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDataRiskLevelConfig() throws Exception {
        // Get the dataRiskLevelConfig
        restDataRiskLevelConfigMockMvc.perform(get("/api/data-risk-level-configs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDataRiskLevelConfig() throws Exception {
        // Initialize the database
        dataRiskLevelConfigService.save(dataRiskLevelConfig);

        int databaseSizeBeforeUpdate = dataRiskLevelConfigRepository.findAll().size();

        // Update the dataRiskLevelConfig
        DataRiskLevelConfig updatedDataRiskLevelConfig = dataRiskLevelConfigRepository.findOne(dataRiskLevelConfig.getId());
        // Disconnect from session so that the updates on updatedDataRiskLevelConfig are not directly saved in db
        em.detach(updatedDataRiskLevelConfig);
        updatedDataRiskLevelConfig
            .rationale(UPDATED_RATIONALE)
            .likelihood(UPDATED_LIKELIHOOD)
            .impact(UPDATED_IMPACT)
            .risk(UPDATED_RISK);

        restDataRiskLevelConfigMockMvc.perform(put("/api/data-risk-level-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDataRiskLevelConfig)))
            .andExpect(status().isOk());

        // Validate the DataRiskLevelConfig in the database
        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeUpdate);
        DataRiskLevelConfig testDataRiskLevelConfig = dataRiskLevelConfigList.get(dataRiskLevelConfigList.size() - 1);
        assertThat(testDataRiskLevelConfig.getRationale()).isEqualTo(UPDATED_RATIONALE);
        assertThat(testDataRiskLevelConfig.getLikelihood()).isEqualTo(UPDATED_LIKELIHOOD);
        assertThat(testDataRiskLevelConfig.getImpact()).isEqualTo(UPDATED_IMPACT);
        assertThat(testDataRiskLevelConfig.getRisk()).isEqualTo(UPDATED_RISK);
    }

    @Test
    @Transactional
    public void updateNonExistingDataRiskLevelConfig() throws Exception {
        int databaseSizeBeforeUpdate = dataRiskLevelConfigRepository.findAll().size();

        // Create the DataRiskLevelConfig

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDataRiskLevelConfigMockMvc.perform(put("/api/data-risk-level-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRiskLevelConfig)))
            .andExpect(status().isCreated());

        // Validate the DataRiskLevelConfig in the database
        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDataRiskLevelConfig() throws Exception {
        // Initialize the database
        dataRiskLevelConfigService.save(dataRiskLevelConfig);

        int databaseSizeBeforeDelete = dataRiskLevelConfigRepository.findAll().size();

        // Get the dataRiskLevelConfig
        restDataRiskLevelConfigMockMvc.perform(delete("/api/data-risk-level-configs/{id}", dataRiskLevelConfig.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DataRiskLevelConfig> dataRiskLevelConfigList = dataRiskLevelConfigRepository.findAll();
        assertThat(dataRiskLevelConfigList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataRiskLevelConfig.class);
        DataRiskLevelConfig dataRiskLevelConfig1 = new DataRiskLevelConfig();
        dataRiskLevelConfig1.setId(1L);
        DataRiskLevelConfig dataRiskLevelConfig2 = new DataRiskLevelConfig();
        dataRiskLevelConfig2.setId(dataRiskLevelConfig1.getId());
        assertThat(dataRiskLevelConfig1).isEqualTo(dataRiskLevelConfig2);
        dataRiskLevelConfig2.setId(2L);
        assertThat(dataRiskLevelConfig1).isNotEqualTo(dataRiskLevelConfig2);
        dataRiskLevelConfig1.setId(null);
        assertThat(dataRiskLevelConfig1).isNotEqualTo(dataRiskLevelConfig2);
    }
}
