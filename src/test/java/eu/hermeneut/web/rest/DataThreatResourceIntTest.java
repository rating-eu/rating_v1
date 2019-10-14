package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.DataThreat;
import eu.hermeneut.repository.DataThreatRepository;
import eu.hermeneut.service.DataThreatService;
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

import eu.hermeneut.domain.enumeration.ThreatArea;
import eu.hermeneut.domain.enumeration.DataThreatLikelihood;
/**
 * Test class for the DataThreatResource REST controller.
 *
 * @see DataThreatResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class DataThreatResourceIntTest {

    private static final ThreatArea DEFAULT_THREAT_AREA = ThreatArea.NETWORK_AND_TECHNICAL_RESOURCES;
    private static final ThreatArea UPDATED_THREAT_AREA = ThreatArea.PROCEDURES_RELATED_TO_THE_PROCESSING_OF_PERSONAL_DATA;

    private static final DataThreatLikelihood DEFAULT_LIKELIHOOD = DataThreatLikelihood.LOW;
    private static final DataThreatLikelihood UPDATED_LIKELIHOOD = DataThreatLikelihood.MEDIUM;

    @Autowired
    private DataThreatRepository dataThreatRepository;

    @Autowired
    private DataThreatService dataThreatService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDataThreatMockMvc;

    private DataThreat dataThreat;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DataThreatResource dataThreatResource = new DataThreatResource(dataThreatService);
        this.restDataThreatMockMvc = MockMvcBuilders.standaloneSetup(dataThreatResource)
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
    public static DataThreat createEntity(EntityManager em) {
        DataThreat dataThreat = new DataThreat()
            .threatArea(DEFAULT_THREAT_AREA)
            .likelihood(DEFAULT_LIKELIHOOD);
        return dataThreat;
    }

    @Before
    public void initTest() {
        dataThreat = createEntity(em);
    }

    @Test
    @Transactional
    public void createDataThreat() throws Exception {
        int databaseSizeBeforeCreate = dataThreatRepository.findAll().size();

        // Create the DataThreat
        restDataThreatMockMvc.perform(post("/api/data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataThreat)))
            .andExpect(status().isCreated());

        // Validate the DataThreat in the database
        List<DataThreat> dataThreatList = dataThreatRepository.findAll();
        assertThat(dataThreatList).hasSize(databaseSizeBeforeCreate + 1);
        DataThreat testDataThreat = dataThreatList.get(dataThreatList.size() - 1);
        assertThat(testDataThreat.getThreatArea()).isEqualTo(DEFAULT_THREAT_AREA);
        assertThat(testDataThreat.getLikelihood()).isEqualTo(DEFAULT_LIKELIHOOD);
    }

    @Test
    @Transactional
    public void createDataThreatWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dataThreatRepository.findAll().size();

        // Create the DataThreat with an existing ID
        dataThreat.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataThreatMockMvc.perform(post("/api/data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataThreat)))
            .andExpect(status().isBadRequest());

        // Validate the DataThreat in the database
        List<DataThreat> dataThreatList = dataThreatRepository.findAll();
        assertThat(dataThreatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkThreatAreaIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataThreatRepository.findAll().size();
        // set the field null
        dataThreat.setThreatArea(null);

        // Create the DataThreat, which fails.

        restDataThreatMockMvc.perform(post("/api/data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataThreat)))
            .andExpect(status().isBadRequest());

        List<DataThreat> dataThreatList = dataThreatRepository.findAll();
        assertThat(dataThreatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLikelihoodIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataThreatRepository.findAll().size();
        // set the field null
        dataThreat.setLikelihood(null);

        // Create the DataThreat, which fails.

        restDataThreatMockMvc.perform(post("/api/data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataThreat)))
            .andExpect(status().isBadRequest());

        List<DataThreat> dataThreatList = dataThreatRepository.findAll();
        assertThat(dataThreatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDataThreats() throws Exception {
        // Initialize the database
        dataThreatRepository.saveAndFlush(dataThreat);

        // Get all the dataThreatList
        restDataThreatMockMvc.perform(get("/api/data-threats?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataThreat.getId().intValue())))
            .andExpect(jsonPath("$.[*].threatArea").value(hasItem(DEFAULT_THREAT_AREA.toString())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_LIKELIHOOD.toString())));
    }

    @Test
    @Transactional
    public void getDataThreat() throws Exception {
        // Initialize the database
        dataThreatRepository.saveAndFlush(dataThreat);

        // Get the dataThreat
        restDataThreatMockMvc.perform(get("/api/data-threats/{id}", dataThreat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dataThreat.getId().intValue()))
            .andExpect(jsonPath("$.threatArea").value(DEFAULT_THREAT_AREA.toString()))
            .andExpect(jsonPath("$.likelihood").value(DEFAULT_LIKELIHOOD.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDataThreat() throws Exception {
        // Get the dataThreat
        restDataThreatMockMvc.perform(get("/api/data-threats/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDataThreat() throws Exception {
        // Initialize the database
        dataThreatService.save(dataThreat);

        int databaseSizeBeforeUpdate = dataThreatRepository.findAll().size();

        // Update the dataThreat
        DataThreat updatedDataThreat = dataThreatRepository.findOne(dataThreat.getId());
        // Disconnect from session so that the updates on updatedDataThreat are not directly saved in db
        em.detach(updatedDataThreat);
        updatedDataThreat
            .threatArea(UPDATED_THREAT_AREA)
            .likelihood(UPDATED_LIKELIHOOD);

        restDataThreatMockMvc.perform(put("/api/data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDataThreat)))
            .andExpect(status().isOk());

        // Validate the DataThreat in the database
        List<DataThreat> dataThreatList = dataThreatRepository.findAll();
        assertThat(dataThreatList).hasSize(databaseSizeBeforeUpdate);
        DataThreat testDataThreat = dataThreatList.get(dataThreatList.size() - 1);
        assertThat(testDataThreat.getThreatArea()).isEqualTo(UPDATED_THREAT_AREA);
        assertThat(testDataThreat.getLikelihood()).isEqualTo(UPDATED_LIKELIHOOD);
    }

    @Test
    @Transactional
    public void updateNonExistingDataThreat() throws Exception {
        int databaseSizeBeforeUpdate = dataThreatRepository.findAll().size();

        // Create the DataThreat

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDataThreatMockMvc.perform(put("/api/data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataThreat)))
            .andExpect(status().isCreated());

        // Validate the DataThreat in the database
        List<DataThreat> dataThreatList = dataThreatRepository.findAll();
        assertThat(dataThreatList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDataThreat() throws Exception {
        // Initialize the database
        dataThreatService.save(dataThreat);

        int databaseSizeBeforeDelete = dataThreatRepository.findAll().size();

        // Get the dataThreat
        restDataThreatMockMvc.perform(delete("/api/data-threats/{id}", dataThreat.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DataThreat> dataThreatList = dataThreatRepository.findAll();
        assertThat(dataThreatList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataThreat.class);
        DataThreat dataThreat1 = new DataThreat();
        dataThreat1.setId(1L);
        DataThreat dataThreat2 = new DataThreat();
        dataThreat2.setId(dataThreat1.getId());
        assertThat(dataThreat1).isEqualTo(dataThreat2);
        dataThreat2.setId(2L);
        assertThat(dataThreat1).isNotEqualTo(dataThreat2);
        dataThreat1.setId(null);
        assertThat(dataThreat1).isNotEqualTo(dataThreat2);
    }
}
