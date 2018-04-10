package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.repository.SelfAssessmentRepository;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.repository.search.SelfAssessmentSearchRepository;
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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static eu.hermeneut.web.rest.TestUtil.sameInstant;
import static eu.hermeneut.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SelfAssessmentResource REST controller.
 *
 * @see SelfAssessmentResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class SelfAssessmentResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private SelfAssessmentRepository selfAssessmentRepository;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private SelfAssessmentSearchRepository selfAssessmentSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSelfAssessmentMockMvc;

    private SelfAssessment selfAssessment;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SelfAssessmentResource selfAssessmentResource = new SelfAssessmentResource(selfAssessmentService);
        this.restSelfAssessmentMockMvc = MockMvcBuilders.standaloneSetup(selfAssessmentResource)
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
    public static SelfAssessment createEntity(EntityManager em) {
        SelfAssessment selfAssessment = new SelfAssessment()
            .name(DEFAULT_NAME)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED);
        return selfAssessment;
    }

    @Before
    public void initTest() {
        selfAssessmentSearchRepository.deleteAll();
        selfAssessment = createEntity(em);
    }

    @Test
    @Transactional
    public void createSelfAssessment() throws Exception {
        int databaseSizeBeforeCreate = selfAssessmentRepository.findAll().size();

        // Create the SelfAssessment
        restSelfAssessmentMockMvc.perform(post("/api/self-assessments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(selfAssessment)))
            .andExpect(status().isCreated());

        // Validate the SelfAssessment in the database
        List<SelfAssessment> selfAssessmentList = selfAssessmentRepository.findAll();
        assertThat(selfAssessmentList).hasSize(databaseSizeBeforeCreate + 1);
        SelfAssessment testSelfAssessment = selfAssessmentList.get(selfAssessmentList.size() - 1);
        assertThat(testSelfAssessment.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSelfAssessment.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testSelfAssessment.getModified()).isEqualTo(DEFAULT_MODIFIED);

        // Validate the SelfAssessment in Elasticsearch
        SelfAssessment selfAssessmentEs = selfAssessmentSearchRepository.findOne(testSelfAssessment.getId());
        assertThat(testSelfAssessment.getCreated()).isEqualTo(testSelfAssessment.getCreated());
        assertThat(testSelfAssessment.getModified()).isEqualTo(testSelfAssessment.getModified());
        assertThat(selfAssessmentEs).isEqualToIgnoringGivenFields(testSelfAssessment, "created", "modified");
    }

    @Test
    @Transactional
    public void createSelfAssessmentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = selfAssessmentRepository.findAll().size();

        // Create the SelfAssessment with an existing ID
        selfAssessment.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSelfAssessmentMockMvc.perform(post("/api/self-assessments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(selfAssessment)))
            .andExpect(status().isBadRequest());

        // Validate the SelfAssessment in the database
        List<SelfAssessment> selfAssessmentList = selfAssessmentRepository.findAll();
        assertThat(selfAssessmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = selfAssessmentRepository.findAll().size();
        // set the field null
        selfAssessment.setName(null);

        // Create the SelfAssessment, which fails.

        restSelfAssessmentMockMvc.perform(post("/api/self-assessments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(selfAssessment)))
            .andExpect(status().isBadRequest());

        List<SelfAssessment> selfAssessmentList = selfAssessmentRepository.findAll();
        assertThat(selfAssessmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSelfAssessments() throws Exception {
        // Initialize the database
        selfAssessmentRepository.saveAndFlush(selfAssessment);

        // Get all the selfAssessmentList
        restSelfAssessmentMockMvc.perform(get("/api/self-assessments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(selfAssessment.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void getSelfAssessment() throws Exception {
        // Initialize the database
        selfAssessmentRepository.saveAndFlush(selfAssessment);

        // Get the selfAssessment
        restSelfAssessmentMockMvc.perform(get("/api/self-assessments/{id}", selfAssessment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(selfAssessment.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    @Transactional
    public void getNonExistingSelfAssessment() throws Exception {
        // Get the selfAssessment
        restSelfAssessmentMockMvc.perform(get("/api/self-assessments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSelfAssessment() throws Exception {
        // Initialize the database
        selfAssessmentService.save(selfAssessment);

        int databaseSizeBeforeUpdate = selfAssessmentRepository.findAll().size();

        // Update the selfAssessment
        SelfAssessment updatedSelfAssessment = selfAssessmentRepository.findOne(selfAssessment.getId());
        // Disconnect from session so that the updates on updatedSelfAssessment are not directly saved in db
        em.detach(updatedSelfAssessment);
        updatedSelfAssessment
            .name(UPDATED_NAME)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED);

        restSelfAssessmentMockMvc.perform(put("/api/self-assessments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSelfAssessment)))
            .andExpect(status().isOk());

        // Validate the SelfAssessment in the database
        List<SelfAssessment> selfAssessmentList = selfAssessmentRepository.findAll();
        assertThat(selfAssessmentList).hasSize(databaseSizeBeforeUpdate);
        SelfAssessment testSelfAssessment = selfAssessmentList.get(selfAssessmentList.size() - 1);
        assertThat(testSelfAssessment.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSelfAssessment.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testSelfAssessment.getModified()).isEqualTo(UPDATED_MODIFIED);

        // Validate the SelfAssessment in Elasticsearch
        SelfAssessment selfAssessmentEs = selfAssessmentSearchRepository.findOne(testSelfAssessment.getId());
        assertThat(testSelfAssessment.getCreated()).isEqualTo(testSelfAssessment.getCreated());
        assertThat(testSelfAssessment.getModified()).isEqualTo(testSelfAssessment.getModified());
        assertThat(selfAssessmentEs).isEqualToIgnoringGivenFields(testSelfAssessment, "created", "modified");
    }

    @Test
    @Transactional
    public void updateNonExistingSelfAssessment() throws Exception {
        int databaseSizeBeforeUpdate = selfAssessmentRepository.findAll().size();

        // Create the SelfAssessment

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSelfAssessmentMockMvc.perform(put("/api/self-assessments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(selfAssessment)))
            .andExpect(status().isCreated());

        // Validate the SelfAssessment in the database
        List<SelfAssessment> selfAssessmentList = selfAssessmentRepository.findAll();
        assertThat(selfAssessmentList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSelfAssessment() throws Exception {
        // Initialize the database
        selfAssessmentService.save(selfAssessment);

        int databaseSizeBeforeDelete = selfAssessmentRepository.findAll().size();

        // Get the selfAssessment
        restSelfAssessmentMockMvc.perform(delete("/api/self-assessments/{id}", selfAssessment.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean selfAssessmentExistsInEs = selfAssessmentSearchRepository.exists(selfAssessment.getId());
        assertThat(selfAssessmentExistsInEs).isFalse();

        // Validate the database is empty
        List<SelfAssessment> selfAssessmentList = selfAssessmentRepository.findAll();
        assertThat(selfAssessmentList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSelfAssessment() throws Exception {
        // Initialize the database
        selfAssessmentService.save(selfAssessment);

        // Search the selfAssessment
        restSelfAssessmentMockMvc.perform(get("/api/_search/self-assessments?query=id:" + selfAssessment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(selfAssessment.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SelfAssessment.class);
        SelfAssessment selfAssessment1 = new SelfAssessment();
        selfAssessment1.setId(1L);
        SelfAssessment selfAssessment2 = new SelfAssessment();
        selfAssessment2.setId(selfAssessment1.getId());
        assertThat(selfAssessment1).isEqualTo(selfAssessment2);
        selfAssessment2.setId(2L);
        assertThat(selfAssessment1).isNotEqualTo(selfAssessment2);
        selfAssessment1.setId(null);
        assertThat(selfAssessment1).isNotEqualTo(selfAssessment2);
    }
}
