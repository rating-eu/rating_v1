package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.ImpactLevel;
import eu.hermeneut.repository.ImpactLevelRepository;
import eu.hermeneut.service.ImpactLevelService;
import eu.hermeneut.repository.search.ImpactLevelSearchRepository;
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
 * Test class for the ImpactLevelResource REST controller.
 *
 * @see ImpactLevelResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class ImpactLevelResourceIntTest {

    private static final Long DEFAULT_SELF_ASSESSMENT_ID = 1L;
    private static final Long UPDATED_SELF_ASSESSMENT_ID = 2L;

    private static final Integer DEFAULT_IMPACT = 1;
    private static final Integer UPDATED_IMPACT = 2;

    private static final BigDecimal DEFAULT_MIN_LOSS = BigDecimal.ZERO;
    private static final BigDecimal UPDATED_MIN_LOSS = BigDecimal.ONE;

    private static final BigDecimal DEFAULT_MAX_LOSS = BigDecimal.ZERO;
    private static final BigDecimal UPDATED_MAX_LOSS = BigDecimal.ONE;

    @Autowired
    private ImpactLevelRepository impactLevelRepository;

    @Autowired
    private ImpactLevelService impactLevelService;

    @Autowired
    private ImpactLevelSearchRepository impactLevelSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restImpactLevelMockMvc;

    private ImpactLevel impactLevel;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ImpactLevelResource impactLevelResource = new ImpactLevelResource(impactLevelService);
        this.restImpactLevelMockMvc = MockMvcBuilders.standaloneSetup(impactLevelResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ImpactLevel createEntity(EntityManager em) {
        ImpactLevel impactLevel = new ImpactLevel()
            .selfAssessmentID(DEFAULT_SELF_ASSESSMENT_ID)
            .impact(DEFAULT_IMPACT)
            .minLoss(DEFAULT_MIN_LOSS)
            .maxLoss(DEFAULT_MAX_LOSS);
        return impactLevel;
    }

    @Before
    public void initTest() {
        impactLevelSearchRepository.deleteAll();
        impactLevel = createEntity(em);
    }

    @Test
    @Transactional
    public void createImpactLevel() throws Exception {
        int databaseSizeBeforeCreate = impactLevelRepository.findAll().size();

        // Create the ImpactLevel
        restImpactLevelMockMvc.perform(post("/api/impact-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevel)))
            .andExpect(status().isCreated());

        // Validate the ImpactLevel in the database
        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeCreate + 1);
        ImpactLevel testImpactLevel = impactLevelList.get(impactLevelList.size() - 1);
        assertThat(testImpactLevel.getSelfAssessmentID()).isEqualTo(DEFAULT_SELF_ASSESSMENT_ID);
        assertThat(testImpactLevel.getImpact()).isEqualTo(DEFAULT_IMPACT);
        assertThat(testImpactLevel.getMinLoss()).isEqualTo(DEFAULT_MIN_LOSS);
        assertThat(testImpactLevel.getMaxLoss()).isEqualTo(DEFAULT_MAX_LOSS);

        // Validate the ImpactLevel in Elasticsearch
        ImpactLevel impactLevelEs = impactLevelSearchRepository.findOne(testImpactLevel.getId());
        assertThat(impactLevelEs).isEqualToIgnoringGivenFields(testImpactLevel);
    }

    @Test
    @Transactional
    public void createImpactLevelWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = impactLevelRepository.findAll().size();

        // Create the ImpactLevel with an existing ID
        impactLevel.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restImpactLevelMockMvc.perform(post("/api/impact-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevel)))
            .andExpect(status().isBadRequest());

        // Validate the ImpactLevel in the database
        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkSelfAssessmentIDIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelRepository.findAll().size();
        // set the field null
        impactLevel.setSelfAssessmentID(null);

        // Create the ImpactLevel, which fails.

        restImpactLevelMockMvc.perform(post("/api/impact-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevel)))
            .andExpect(status().isBadRequest());

        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkImpactIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelRepository.findAll().size();
        // set the field null
        impactLevel.setImpact(null);

        // Create the ImpactLevel, which fails.

        restImpactLevelMockMvc.perform(post("/api/impact-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevel)))
            .andExpect(status().isBadRequest());

        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkMinLossIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelRepository.findAll().size();
        // set the field null
        impactLevel.setMinLoss(null);

        // Create the ImpactLevel, which fails.

        restImpactLevelMockMvc.perform(post("/api/impact-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevel)))
            .andExpect(status().isBadRequest());

        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkMaxLossIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelRepository.findAll().size();
        // set the field null
        impactLevel.setMaxLoss(null);

        // Create the ImpactLevel, which fails.

        restImpactLevelMockMvc.perform(post("/api/impact-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevel)))
            .andExpect(status().isBadRequest());

        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllImpactLevels() throws Exception {
        // Initialize the database
        impactLevelRepository.saveAndFlush(impactLevel);

        // Get all the impactLevelList
        restImpactLevelMockMvc.perform(get("/api/impact-levels?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(impactLevel.getId().intValue())))
            .andExpect(jsonPath("$.[*].selfAssessmentID").value(hasItem(DEFAULT_SELF_ASSESSMENT_ID.intValue())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT)))
            .andExpect(jsonPath("$.[*].minLoss").value(hasItem(DEFAULT_MIN_LOSS.intValue())))
            .andExpect(jsonPath("$.[*].maxLoss").value(hasItem(DEFAULT_MAX_LOSS.intValue())));
    }

    @Test
    @Transactional
    public void getImpactLevel() throws Exception {
        // Initialize the database
        impactLevelRepository.saveAndFlush(impactLevel);

        // Get the impactLevel
        restImpactLevelMockMvc.perform(get("/api/impact-levels/{id}", impactLevel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(impactLevel.getId().intValue()))
            .andExpect(jsonPath("$.selfAssessmentID").value(DEFAULT_SELF_ASSESSMENT_ID.intValue()))
            .andExpect(jsonPath("$.impact").value(DEFAULT_IMPACT))
            .andExpect(jsonPath("$.minLoss").value(DEFAULT_MIN_LOSS.intValue()))
            .andExpect(jsonPath("$.maxLoss").value(DEFAULT_MAX_LOSS.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingImpactLevel() throws Exception {
        // Get the impactLevel
        restImpactLevelMockMvc.perform(get("/api/impact-levels/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateImpactLevel() throws Exception {
        // Initialize the database
        impactLevelService.save(impactLevel);

        int databaseSizeBeforeUpdate = impactLevelRepository.findAll().size();

        // Update the impactLevel
        ImpactLevel updatedImpactLevel = impactLevelRepository.findOne(impactLevel.getId());
        // Disconnect from session so that the updates on updatedImpactLevel are not directly saved in db
        em.detach(updatedImpactLevel);
        updatedImpactLevel
            .selfAssessmentID(UPDATED_SELF_ASSESSMENT_ID)
            .impact(UPDATED_IMPACT)
            .minLoss(UPDATED_MIN_LOSS)
            .maxLoss(UPDATED_MAX_LOSS);

        restImpactLevelMockMvc.perform(put("/api/impact-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedImpactLevel)))
            .andExpect(status().isOk());

        // Validate the ImpactLevel in the database
        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeUpdate);
        ImpactLevel testImpactLevel = impactLevelList.get(impactLevelList.size() - 1);
        assertThat(testImpactLevel.getSelfAssessmentID()).isEqualTo(UPDATED_SELF_ASSESSMENT_ID);
        assertThat(testImpactLevel.getImpact()).isEqualTo(UPDATED_IMPACT);
        assertThat(testImpactLevel.getMinLoss()).isEqualTo(UPDATED_MIN_LOSS);
        assertThat(testImpactLevel.getMaxLoss()).isEqualTo(UPDATED_MAX_LOSS);

        // Validate the ImpactLevel in Elasticsearch
        ImpactLevel impactLevelEs = impactLevelSearchRepository.findOne(testImpactLevel.getId());
        assertThat(impactLevelEs).isEqualToIgnoringGivenFields(testImpactLevel);
    }

    @Test
    @Transactional
    public void updateNonExistingImpactLevel() throws Exception {
        int databaseSizeBeforeUpdate = impactLevelRepository.findAll().size();

        // Create the ImpactLevel

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restImpactLevelMockMvc.perform(put("/api/impact-levels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevel)))
            .andExpect(status().isCreated());

        // Validate the ImpactLevel in the database
        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteImpactLevel() throws Exception {
        // Initialize the database
        impactLevelService.save(impactLevel);

        int databaseSizeBeforeDelete = impactLevelRepository.findAll().size();

        // Get the impactLevel
        restImpactLevelMockMvc.perform(delete("/api/impact-levels/{id}", impactLevel.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean impactLevelExistsInEs = impactLevelSearchRepository.exists(impactLevel.getId());
        assertThat(impactLevelExistsInEs).isFalse();

        // Validate the database is empty
        List<ImpactLevel> impactLevelList = impactLevelRepository.findAll();
        assertThat(impactLevelList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchImpactLevel() throws Exception {
        // Initialize the database
        impactLevelService.save(impactLevel);

        // Search the impactLevel
        restImpactLevelMockMvc.perform(get("/api/_search/impact-levels?query=id:" + impactLevel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(impactLevel.getId().intValue())))
            .andExpect(jsonPath("$.[*].selfAssessmentID").value(hasItem(DEFAULT_SELF_ASSESSMENT_ID.intValue())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT)))
            .andExpect(jsonPath("$.[*].minLoss").value(hasItem(DEFAULT_MIN_LOSS.intValue())))
            .andExpect(jsonPath("$.[*].maxLoss").value(hasItem(DEFAULT_MAX_LOSS.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ImpactLevel.class);
        ImpactLevel impactLevel1 = new ImpactLevel();
        impactLevel1.setId(1L);
        ImpactLevel impactLevel2 = new ImpactLevel();
        impactLevel2.setId(impactLevel1.getId());
        assertThat(impactLevel1).isEqualTo(impactLevel2);
        impactLevel2.setId(2L);
        assertThat(impactLevel1).isNotEqualTo(impactLevel2);
        impactLevel1.setId(null);
        assertThat(impactLevel1).isNotEqualTo(impactLevel2);
    }
}
