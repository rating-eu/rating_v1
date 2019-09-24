package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.OverallDataThreat;
import eu.hermeneut.repository.OverallDataThreatRepository;
import eu.hermeneut.service.OverallDataThreatService;
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
/**
 * Test class for the OverallDataThreatResource REST controller.
 *
 * @see OverallDataThreatResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class OverallDataThreatResourceIntTest {

    private static final DataThreatLikelihood DEFAULT_LIKELIHOOD = DataThreatLikelihood.LOW;
    private static final DataThreatLikelihood UPDATED_LIKELIHOOD = DataThreatLikelihood.MEDIUM;

    @Autowired
    private OverallDataThreatRepository overallDataThreatRepository;

    @Autowired
    private OverallDataThreatService overallDataThreatService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restOverallDataThreatMockMvc;

    private OverallDataThreat overallDataThreat;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OverallDataThreatResource overallDataThreatResource = new OverallDataThreatResource(overallDataThreatService);
        this.restOverallDataThreatMockMvc = MockMvcBuilders.standaloneSetup(overallDataThreatResource)
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
    public static OverallDataThreat createEntity(EntityManager em) {
        OverallDataThreat overallDataThreat = new OverallDataThreat()
            .likelihood(DEFAULT_LIKELIHOOD);
        return overallDataThreat;
    }

    @Before
    public void initTest() {
        overallDataThreat = createEntity(em);
    }

    @Test
    @Transactional
    public void createOverallDataThreat() throws Exception {
        int databaseSizeBeforeCreate = overallDataThreatRepository.findAll().size();

        // Create the OverallDataThreat
        restOverallDataThreatMockMvc.perform(post("/api/overall-data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallDataThreat)))
            .andExpect(status().isCreated());

        // Validate the OverallDataThreat in the database
        List<OverallDataThreat> overallDataThreatList = overallDataThreatRepository.findAll();
        assertThat(overallDataThreatList).hasSize(databaseSizeBeforeCreate + 1);
        OverallDataThreat testOverallDataThreat = overallDataThreatList.get(overallDataThreatList.size() - 1);
        assertThat(testOverallDataThreat.getLikelihood()).isEqualTo(DEFAULT_LIKELIHOOD);
    }

    @Test
    @Transactional
    public void createOverallDataThreatWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = overallDataThreatRepository.findAll().size();

        // Create the OverallDataThreat with an existing ID
        overallDataThreat.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOverallDataThreatMockMvc.perform(post("/api/overall-data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallDataThreat)))
            .andExpect(status().isBadRequest());

        // Validate the OverallDataThreat in the database
        List<OverallDataThreat> overallDataThreatList = overallDataThreatRepository.findAll();
        assertThat(overallDataThreatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkLikelihoodIsRequired() throws Exception {
        int databaseSizeBeforeTest = overallDataThreatRepository.findAll().size();
        // set the field null
        overallDataThreat.setLikelihood(null);

        // Create the OverallDataThreat, which fails.

        restOverallDataThreatMockMvc.perform(post("/api/overall-data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallDataThreat)))
            .andExpect(status().isBadRequest());

        List<OverallDataThreat> overallDataThreatList = overallDataThreatRepository.findAll();
        assertThat(overallDataThreatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOverallDataThreats() throws Exception {
        // Initialize the database
        overallDataThreatRepository.saveAndFlush(overallDataThreat);

        // Get all the overallDataThreatList
        restOverallDataThreatMockMvc.perform(get("/api/overall-data-threats?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(overallDataThreat.getId().intValue())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_LIKELIHOOD.toString())));
    }

    @Test
    @Transactional
    public void getOverallDataThreat() throws Exception {
        // Initialize the database
        overallDataThreatRepository.saveAndFlush(overallDataThreat);

        // Get the overallDataThreat
        restOverallDataThreatMockMvc.perform(get("/api/overall-data-threats/{id}", overallDataThreat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(overallDataThreat.getId().intValue()))
            .andExpect(jsonPath("$.likelihood").value(DEFAULT_LIKELIHOOD.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOverallDataThreat() throws Exception {
        // Get the overallDataThreat
        restOverallDataThreatMockMvc.perform(get("/api/overall-data-threats/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOverallDataThreat() throws Exception {
        // Initialize the database
        overallDataThreatService.save(overallDataThreat);

        int databaseSizeBeforeUpdate = overallDataThreatRepository.findAll().size();

        // Update the overallDataThreat
        OverallDataThreat updatedOverallDataThreat = overallDataThreatRepository.findOne(overallDataThreat.getId());
        // Disconnect from session so that the updates on updatedOverallDataThreat are not directly saved in db
        em.detach(updatedOverallDataThreat);
        updatedOverallDataThreat
            .likelihood(UPDATED_LIKELIHOOD);

        restOverallDataThreatMockMvc.perform(put("/api/overall-data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOverallDataThreat)))
            .andExpect(status().isOk());

        // Validate the OverallDataThreat in the database
        List<OverallDataThreat> overallDataThreatList = overallDataThreatRepository.findAll();
        assertThat(overallDataThreatList).hasSize(databaseSizeBeforeUpdate);
        OverallDataThreat testOverallDataThreat = overallDataThreatList.get(overallDataThreatList.size() - 1);
        assertThat(testOverallDataThreat.getLikelihood()).isEqualTo(UPDATED_LIKELIHOOD);
    }

    @Test
    @Transactional
    public void updateNonExistingOverallDataThreat() throws Exception {
        int databaseSizeBeforeUpdate = overallDataThreatRepository.findAll().size();

        // Create the OverallDataThreat

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restOverallDataThreatMockMvc.perform(put("/api/overall-data-threats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallDataThreat)))
            .andExpect(status().isCreated());

        // Validate the OverallDataThreat in the database
        List<OverallDataThreat> overallDataThreatList = overallDataThreatRepository.findAll();
        assertThat(overallDataThreatList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteOverallDataThreat() throws Exception {
        // Initialize the database
        overallDataThreatService.save(overallDataThreat);

        int databaseSizeBeforeDelete = overallDataThreatRepository.findAll().size();

        // Get the overallDataThreat
        restOverallDataThreatMockMvc.perform(delete("/api/overall-data-threats/{id}", overallDataThreat.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<OverallDataThreat> overallDataThreatList = overallDataThreatRepository.findAll();
        assertThat(overallDataThreatList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OverallDataThreat.class);
        OverallDataThreat overallDataThreat1 = new OverallDataThreat();
        overallDataThreat1.setId(1L);
        OverallDataThreat overallDataThreat2 = new OverallDataThreat();
        overallDataThreat2.setId(overallDataThreat1.getId());
        assertThat(overallDataThreat1).isEqualTo(overallDataThreat2);
        overallDataThreat2.setId(2L);
        assertThat(overallDataThreat1).isNotEqualTo(overallDataThreat2);
        overallDataThreat1.setId(null);
        assertThat(overallDataThreat1).isNotEqualTo(overallDataThreat2);
    }
}
