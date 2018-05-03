package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.LikelihoodPosition;
import eu.hermeneut.repository.LikelihoodPositionRepository;
import eu.hermeneut.service.LikelihoodPositionService;
import eu.hermeneut.repository.search.LikelihoodPositionSearchRepository;
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

import eu.hermeneut.domain.enumeration.Likelihood;
/**
 * Test class for the LikelihoodPositionResource REST controller.
 *
 * @see LikelihoodPositionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class LikelihoodPositionResourceIntTest {

    private static final Likelihood DEFAULT_LIKELIHOOD = Likelihood.LOW;
    private static final Likelihood UPDATED_LIKELIHOOD = Likelihood.LOW_MEDIUM;

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    @Autowired
    private LikelihoodPositionRepository likelihoodPositionRepository;

    @Autowired
    private LikelihoodPositionService likelihoodPositionService;

    @Autowired
    private LikelihoodPositionSearchRepository likelihoodPositionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLikelihoodPositionMockMvc;

    private LikelihoodPosition likelihoodPosition;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LikelihoodPositionResource likelihoodPositionResource = new LikelihoodPositionResource(likelihoodPositionService);
        this.restLikelihoodPositionMockMvc = MockMvcBuilders.standaloneSetup(likelihoodPositionResource)
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
    public static LikelihoodPosition createEntity(EntityManager em) {
        LikelihoodPosition likelihoodPosition = new LikelihoodPosition()
            .likelihood(DEFAULT_LIKELIHOOD)
            .position(DEFAULT_POSITION);
        return likelihoodPosition;
    }

    @Before
    public void initTest() {
        likelihoodPositionSearchRepository.deleteAll();
        likelihoodPosition = createEntity(em);
    }

    @Test
    @Transactional
    public void createLikelihoodPosition() throws Exception {
        int databaseSizeBeforeCreate = likelihoodPositionRepository.findAll().size();

        // Create the LikelihoodPosition
        restLikelihoodPositionMockMvc.perform(post("/api/likelihood-positions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodPosition)))
            .andExpect(status().isCreated());

        // Validate the LikelihoodPosition in the database
        List<LikelihoodPosition> likelihoodPositionList = likelihoodPositionRepository.findAll();
        assertThat(likelihoodPositionList).hasSize(databaseSizeBeforeCreate + 1);
        LikelihoodPosition testLikelihoodPosition = likelihoodPositionList.get(likelihoodPositionList.size() - 1);
        assertThat(testLikelihoodPosition.getLikelihood()).isEqualTo(DEFAULT_LIKELIHOOD);
        assertThat(testLikelihoodPosition.getPosition()).isEqualTo(DEFAULT_POSITION);

        // Validate the LikelihoodPosition in Elasticsearch
        LikelihoodPosition likelihoodPositionEs = likelihoodPositionSearchRepository.findOne(testLikelihoodPosition.getId());
        assertThat(likelihoodPositionEs).isEqualToIgnoringGivenFields(testLikelihoodPosition);
    }

    @Test
    @Transactional
    public void createLikelihoodPositionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = likelihoodPositionRepository.findAll().size();

        // Create the LikelihoodPosition with an existing ID
        likelihoodPosition.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLikelihoodPositionMockMvc.perform(post("/api/likelihood-positions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodPosition)))
            .andExpect(status().isBadRequest());

        // Validate the LikelihoodPosition in the database
        List<LikelihoodPosition> likelihoodPositionList = likelihoodPositionRepository.findAll();
        assertThat(likelihoodPositionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllLikelihoodPositions() throws Exception {
        // Initialize the database
        likelihoodPositionRepository.saveAndFlush(likelihoodPosition);

        // Get all the likelihoodPositionList
        restLikelihoodPositionMockMvc.perform(get("/api/likelihood-positions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(likelihoodPosition.getId().intValue())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_LIKELIHOOD.toString())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)));
    }

    @Test
    @Transactional
    public void getLikelihoodPosition() throws Exception {
        // Initialize the database
        likelihoodPositionRepository.saveAndFlush(likelihoodPosition);

        // Get the likelihoodPosition
        restLikelihoodPositionMockMvc.perform(get("/api/likelihood-positions/{id}", likelihoodPosition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(likelihoodPosition.getId().intValue()))
            .andExpect(jsonPath("$.likelihood").value(DEFAULT_LIKELIHOOD.toString()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION));
    }

    @Test
    @Transactional
    public void getNonExistingLikelihoodPosition() throws Exception {
        // Get the likelihoodPosition
        restLikelihoodPositionMockMvc.perform(get("/api/likelihood-positions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLikelihoodPosition() throws Exception {
        // Initialize the database
        likelihoodPositionService.save(likelihoodPosition);

        int databaseSizeBeforeUpdate = likelihoodPositionRepository.findAll().size();

        // Update the likelihoodPosition
        LikelihoodPosition updatedLikelihoodPosition = likelihoodPositionRepository.findOne(likelihoodPosition.getId());
        // Disconnect from session so that the updates on updatedLikelihoodPosition are not directly saved in db
        em.detach(updatedLikelihoodPosition);
        updatedLikelihoodPosition
            .likelihood(UPDATED_LIKELIHOOD)
            .position(UPDATED_POSITION);

        restLikelihoodPositionMockMvc.perform(put("/api/likelihood-positions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLikelihoodPosition)))
            .andExpect(status().isOk());

        // Validate the LikelihoodPosition in the database
        List<LikelihoodPosition> likelihoodPositionList = likelihoodPositionRepository.findAll();
        assertThat(likelihoodPositionList).hasSize(databaseSizeBeforeUpdate);
        LikelihoodPosition testLikelihoodPosition = likelihoodPositionList.get(likelihoodPositionList.size() - 1);
        assertThat(testLikelihoodPosition.getLikelihood()).isEqualTo(UPDATED_LIKELIHOOD);
        assertThat(testLikelihoodPosition.getPosition()).isEqualTo(UPDATED_POSITION);

        // Validate the LikelihoodPosition in Elasticsearch
        LikelihoodPosition likelihoodPositionEs = likelihoodPositionSearchRepository.findOne(testLikelihoodPosition.getId());
        assertThat(likelihoodPositionEs).isEqualToIgnoringGivenFields(testLikelihoodPosition);
    }

    @Test
    @Transactional
    public void updateNonExistingLikelihoodPosition() throws Exception {
        int databaseSizeBeforeUpdate = likelihoodPositionRepository.findAll().size();

        // Create the LikelihoodPosition

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLikelihoodPositionMockMvc.perform(put("/api/likelihood-positions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodPosition)))
            .andExpect(status().isCreated());

        // Validate the LikelihoodPosition in the database
        List<LikelihoodPosition> likelihoodPositionList = likelihoodPositionRepository.findAll();
        assertThat(likelihoodPositionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLikelihoodPosition() throws Exception {
        // Initialize the database
        likelihoodPositionService.save(likelihoodPosition);

        int databaseSizeBeforeDelete = likelihoodPositionRepository.findAll().size();

        // Get the likelihoodPosition
        restLikelihoodPositionMockMvc.perform(delete("/api/likelihood-positions/{id}", likelihoodPosition.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean likelihoodPositionExistsInEs = likelihoodPositionSearchRepository.exists(likelihoodPosition.getId());
        assertThat(likelihoodPositionExistsInEs).isFalse();

        // Validate the database is empty
        List<LikelihoodPosition> likelihoodPositionList = likelihoodPositionRepository.findAll();
        assertThat(likelihoodPositionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchLikelihoodPosition() throws Exception {
        // Initialize the database
        likelihoodPositionService.save(likelihoodPosition);

        // Search the likelihoodPosition
        restLikelihoodPositionMockMvc.perform(get("/api/_search/likelihood-positions?query=id:" + likelihoodPosition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(likelihoodPosition.getId().intValue())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_LIKELIHOOD.toString())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LikelihoodPosition.class);
        LikelihoodPosition likelihoodPosition1 = new LikelihoodPosition();
        likelihoodPosition1.setId(1L);
        LikelihoodPosition likelihoodPosition2 = new LikelihoodPosition();
        likelihoodPosition2.setId(likelihoodPosition1.getId());
        assertThat(likelihoodPosition1).isEqualTo(likelihoodPosition2);
        likelihoodPosition2.setId(2L);
        assertThat(likelihoodPosition1).isNotEqualTo(likelihoodPosition2);
        likelihoodPosition1.setId(null);
        assertThat(likelihoodPosition1).isNotEqualTo(likelihoodPosition2);
    }
}
