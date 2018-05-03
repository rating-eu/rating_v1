package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.PhaseWrapper;
import eu.hermeneut.repository.PhaseWrapperRepository;
import eu.hermeneut.service.PhaseWrapperService;
import eu.hermeneut.repository.search.PhaseWrapperSearchRepository;
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

import eu.hermeneut.domain.enumeration.Phase;
/**
 * Test class for the PhaseWrapperResource REST controller.
 *
 * @see PhaseWrapperResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class PhaseWrapperResourceIntTest {

    private static final Phase DEFAULT_PHASE = Phase.RECONNAISSANCE;
    private static final Phase UPDATED_PHASE = Phase.WEAPONIZATION;

    @Autowired
    private PhaseWrapperRepository phaseWrapperRepository;

    @Autowired
    private PhaseWrapperService phaseWrapperService;

    @Autowired
    private PhaseWrapperSearchRepository phaseWrapperSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPhaseWrapperMockMvc;

    private PhaseWrapper phaseWrapper;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PhaseWrapperResource phaseWrapperResource = new PhaseWrapperResource(phaseWrapperService);
        this.restPhaseWrapperMockMvc = MockMvcBuilders.standaloneSetup(phaseWrapperResource)
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
    public static PhaseWrapper createEntity(EntityManager em) {
        PhaseWrapper phaseWrapper = new PhaseWrapper()
            .phase(DEFAULT_PHASE);
        return phaseWrapper;
    }

    @Before
    public void initTest() {
        phaseWrapperSearchRepository.deleteAll();
        phaseWrapper = createEntity(em);
    }

    @Test
    @Transactional
    public void createPhaseWrapper() throws Exception {
        int databaseSizeBeforeCreate = phaseWrapperRepository.findAll().size();

        // Create the PhaseWrapper
        restPhaseWrapperMockMvc.perform(post("/api/phase-wrappers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phaseWrapper)))
            .andExpect(status().isCreated());

        // Validate the PhaseWrapper in the database
        List<PhaseWrapper> phaseWrapperList = phaseWrapperRepository.findAll();
        assertThat(phaseWrapperList).hasSize(databaseSizeBeforeCreate + 1);
        PhaseWrapper testPhaseWrapper = phaseWrapperList.get(phaseWrapperList.size() - 1);
        assertThat(testPhaseWrapper.getPhase()).isEqualTo(DEFAULT_PHASE);

        // Validate the PhaseWrapper in Elasticsearch
        PhaseWrapper phaseWrapperEs = phaseWrapperSearchRepository.findOne(testPhaseWrapper.getId());
        assertThat(phaseWrapperEs).isEqualToIgnoringGivenFields(testPhaseWrapper);
    }

    @Test
    @Transactional
    public void createPhaseWrapperWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = phaseWrapperRepository.findAll().size();

        // Create the PhaseWrapper with an existing ID
        phaseWrapper.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPhaseWrapperMockMvc.perform(post("/api/phase-wrappers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phaseWrapper)))
            .andExpect(status().isBadRequest());

        // Validate the PhaseWrapper in the database
        List<PhaseWrapper> phaseWrapperList = phaseWrapperRepository.findAll();
        assertThat(phaseWrapperList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPhaseWrappers() throws Exception {
        // Initialize the database
        phaseWrapperRepository.saveAndFlush(phaseWrapper);

        // Get all the phaseWrapperList
        restPhaseWrapperMockMvc.perform(get("/api/phase-wrappers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phaseWrapper.getId().intValue())))
            .andExpect(jsonPath("$.[*].phase").value(hasItem(DEFAULT_PHASE.toString())));
    }

    @Test
    @Transactional
    public void getPhaseWrapper() throws Exception {
        // Initialize the database
        phaseWrapperRepository.saveAndFlush(phaseWrapper);

        // Get the phaseWrapper
        restPhaseWrapperMockMvc.perform(get("/api/phase-wrappers/{id}", phaseWrapper.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(phaseWrapper.getId().intValue()))
            .andExpect(jsonPath("$.phase").value(DEFAULT_PHASE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPhaseWrapper() throws Exception {
        // Get the phaseWrapper
        restPhaseWrapperMockMvc.perform(get("/api/phase-wrappers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePhaseWrapper() throws Exception {
        // Initialize the database
        phaseWrapperService.save(phaseWrapper);

        int databaseSizeBeforeUpdate = phaseWrapperRepository.findAll().size();

        // Update the phaseWrapper
        PhaseWrapper updatedPhaseWrapper = phaseWrapperRepository.findOne(phaseWrapper.getId());
        // Disconnect from session so that the updates on updatedPhaseWrapper are not directly saved in db
        em.detach(updatedPhaseWrapper);
        updatedPhaseWrapper
            .phase(UPDATED_PHASE);

        restPhaseWrapperMockMvc.perform(put("/api/phase-wrappers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPhaseWrapper)))
            .andExpect(status().isOk());

        // Validate the PhaseWrapper in the database
        List<PhaseWrapper> phaseWrapperList = phaseWrapperRepository.findAll();
        assertThat(phaseWrapperList).hasSize(databaseSizeBeforeUpdate);
        PhaseWrapper testPhaseWrapper = phaseWrapperList.get(phaseWrapperList.size() - 1);
        assertThat(testPhaseWrapper.getPhase()).isEqualTo(UPDATED_PHASE);

        // Validate the PhaseWrapper in Elasticsearch
        PhaseWrapper phaseWrapperEs = phaseWrapperSearchRepository.findOne(testPhaseWrapper.getId());
        assertThat(phaseWrapperEs).isEqualToIgnoringGivenFields(testPhaseWrapper);
    }

    @Test
    @Transactional
    public void updateNonExistingPhaseWrapper() throws Exception {
        int databaseSizeBeforeUpdate = phaseWrapperRepository.findAll().size();

        // Create the PhaseWrapper

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPhaseWrapperMockMvc.perform(put("/api/phase-wrappers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phaseWrapper)))
            .andExpect(status().isCreated());

        // Validate the PhaseWrapper in the database
        List<PhaseWrapper> phaseWrapperList = phaseWrapperRepository.findAll();
        assertThat(phaseWrapperList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePhaseWrapper() throws Exception {
        // Initialize the database
        phaseWrapperService.save(phaseWrapper);

        int databaseSizeBeforeDelete = phaseWrapperRepository.findAll().size();

        // Get the phaseWrapper
        restPhaseWrapperMockMvc.perform(delete("/api/phase-wrappers/{id}", phaseWrapper.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean phaseWrapperExistsInEs = phaseWrapperSearchRepository.exists(phaseWrapper.getId());
        assertThat(phaseWrapperExistsInEs).isFalse();

        // Validate the database is empty
        List<PhaseWrapper> phaseWrapperList = phaseWrapperRepository.findAll();
        assertThat(phaseWrapperList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPhaseWrapper() throws Exception {
        // Initialize the database
        phaseWrapperService.save(phaseWrapper);

        // Search the phaseWrapper
        restPhaseWrapperMockMvc.perform(get("/api/_search/phase-wrappers?query=id:" + phaseWrapper.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phaseWrapper.getId().intValue())))
            .andExpect(jsonPath("$.[*].phase").value(hasItem(DEFAULT_PHASE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PhaseWrapper.class);
        PhaseWrapper phaseWrapper1 = new PhaseWrapper();
        phaseWrapper1.setId(1L);
        PhaseWrapper phaseWrapper2 = new PhaseWrapper();
        phaseWrapper2.setId(phaseWrapper1.getId());
        assertThat(phaseWrapper1).isEqualTo(phaseWrapper2);
        phaseWrapper2.setId(2L);
        assertThat(phaseWrapper1).isNotEqualTo(phaseWrapper2);
        phaseWrapper1.setId(null);
        assertThat(phaseWrapper1).isNotEqualTo(phaseWrapper2);
    }
}
