package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.repository.QuestionnaireStatusRepository;
import eu.hermeneut.service.QuestionnaireStatusService;
import eu.hermeneut.repository.search.QuestionnaireStatusSearchRepository;
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

import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.domain.enumeration.Role;
/**
 * Test class for the QuestionnaireStatusResource REST controller.
 *
 * @see QuestionnaireStatusResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class QuestionnaireStatusResourceIntTest {

    private static final Status DEFAULT_STATUS = Status.EMPTY;
    private static final Status UPDATED_STATUS = Status.PENDING;

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Role DEFAULT_ROLE = Role.ROLE_ADMIN;
    private static final Role UPDATED_ROLE = Role.ROLE_USER;

    @Autowired
    private QuestionnaireStatusRepository questionnaireStatusRepository;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private QuestionnaireStatusSearchRepository questionnaireStatusSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionnaireStatusMockMvc;

    private QuestionnaireStatus questionnaireStatus;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionnaireStatusResource questionnaireStatusResource = new QuestionnaireStatusResource(questionnaireStatusService);
        this.restQuestionnaireStatusMockMvc = MockMvcBuilders.standaloneSetup(questionnaireStatusResource)
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
    public static QuestionnaireStatus createEntity(EntityManager em) {
        QuestionnaireStatus questionnaireStatus = new QuestionnaireStatus()
            .status(DEFAULT_STATUS)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED)
            .role(DEFAULT_ROLE);
        return questionnaireStatus;
    }

    @Before
    public void initTest() {
        questionnaireStatusSearchRepository.deleteAll();
        questionnaireStatus = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionnaireStatus() throws Exception {
        int databaseSizeBeforeCreate = questionnaireStatusRepository.findAll().size();

        // Create the QuestionnaireStatus
        restQuestionnaireStatusMockMvc.perform(post("/api/questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaireStatus)))
            .andExpect(status().isCreated());

        // Validate the QuestionnaireStatus in the database
        List<QuestionnaireStatus> questionnaireStatusList = questionnaireStatusRepository.findAll();
        assertThat(questionnaireStatusList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionnaireStatus testQuestionnaireStatus = questionnaireStatusList.get(questionnaireStatusList.size() - 1);
        assertThat(testQuestionnaireStatus.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testQuestionnaireStatus.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testQuestionnaireStatus.getModified()).isEqualTo(DEFAULT_MODIFIED);
        assertThat(testQuestionnaireStatus.getRole()).isEqualTo(DEFAULT_ROLE);

        // Validate the QuestionnaireStatus in Elasticsearch
        QuestionnaireStatus questionnaireStatusEs = questionnaireStatusSearchRepository.findOne(testQuestionnaireStatus.getId());
        assertThat(testQuestionnaireStatus.getCreated()).isEqualTo(testQuestionnaireStatus.getCreated());
        assertThat(testQuestionnaireStatus.getModified()).isEqualTo(testQuestionnaireStatus.getModified());
        assertThat(questionnaireStatusEs).isEqualToIgnoringGivenFields(testQuestionnaireStatus, "created", "modified");
    }

    @Test
    @Transactional
    public void createQuestionnaireStatusWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionnaireStatusRepository.findAll().size();

        // Create the QuestionnaireStatus with an existing ID
        questionnaireStatus.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionnaireStatusMockMvc.perform(post("/api/questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaireStatus)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionnaireStatus in the database
        List<QuestionnaireStatus> questionnaireStatusList = questionnaireStatusRepository.findAll();
        assertThat(questionnaireStatusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionnaireStatusRepository.findAll().size();
        // set the field null
        questionnaireStatus.setStatus(null);

        // Create the QuestionnaireStatus, which fails.

        restQuestionnaireStatusMockMvc.perform(post("/api/questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaireStatus)))
            .andExpect(status().isBadRequest());

        List<QuestionnaireStatus> questionnaireStatusList = questionnaireStatusRepository.findAll();
        assertThat(questionnaireStatusList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRoleIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionnaireStatusRepository.findAll().size();
        // set the field null
        questionnaireStatus.setRole(null);

        // Create the QuestionnaireStatus, which fails.

        restQuestionnaireStatusMockMvc.perform(post("/api/questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaireStatus)))
            .andExpect(status().isBadRequest());

        List<QuestionnaireStatus> questionnaireStatusList = questionnaireStatusRepository.findAll();
        assertThat(questionnaireStatusList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionnaireStatuses() throws Exception {
        // Initialize the database
        questionnaireStatusRepository.saveAndFlush(questionnaireStatus);

        // Get all the questionnaireStatusList
        restQuestionnaireStatusMockMvc.perform(get("/api/questionnaire-statuses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionnaireStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE.toString())));
    }

    @Test
    @Transactional
    public void getQuestionnaireStatus() throws Exception {
        // Initialize the database
        questionnaireStatusRepository.saveAndFlush(questionnaireStatus);

        // Get the questionnaireStatus
        restQuestionnaireStatusMockMvc.perform(get("/api/questionnaire-statuses/{id}", questionnaireStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionnaireStatus.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)))
            .andExpect(jsonPath("$.role").value(DEFAULT_ROLE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionnaireStatus() throws Exception {
        // Get the questionnaireStatus
        restQuestionnaireStatusMockMvc.perform(get("/api/questionnaire-statuses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionnaireStatus() throws Exception {
        // Initialize the database
        questionnaireStatusService.save(questionnaireStatus);

        int databaseSizeBeforeUpdate = questionnaireStatusRepository.findAll().size();

        // Update the questionnaireStatus
        QuestionnaireStatus updatedQuestionnaireStatus = questionnaireStatusRepository.findOne(questionnaireStatus.getId());
        // Disconnect from session so that the updates on updatedQuestionnaireStatus are not directly saved in db
        em.detach(updatedQuestionnaireStatus);
        updatedQuestionnaireStatus
            .status(UPDATED_STATUS)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .role(UPDATED_ROLE);

        restQuestionnaireStatusMockMvc.perform(put("/api/questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuestionnaireStatus)))
            .andExpect(status().isOk());

        // Validate the QuestionnaireStatus in the database
        List<QuestionnaireStatus> questionnaireStatusList = questionnaireStatusRepository.findAll();
        assertThat(questionnaireStatusList).hasSize(databaseSizeBeforeUpdate);
        QuestionnaireStatus testQuestionnaireStatus = questionnaireStatusList.get(questionnaireStatusList.size() - 1);
        assertThat(testQuestionnaireStatus.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testQuestionnaireStatus.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testQuestionnaireStatus.getModified()).isEqualTo(UPDATED_MODIFIED);
        assertThat(testQuestionnaireStatus.getRole()).isEqualTo(UPDATED_ROLE);

        // Validate the QuestionnaireStatus in Elasticsearch
        QuestionnaireStatus questionnaireStatusEs = questionnaireStatusSearchRepository.findOne(testQuestionnaireStatus.getId());
        assertThat(testQuestionnaireStatus.getCreated()).isEqualTo(testQuestionnaireStatus.getCreated());
        assertThat(testQuestionnaireStatus.getModified()).isEqualTo(testQuestionnaireStatus.getModified());
        assertThat(questionnaireStatusEs).isEqualToIgnoringGivenFields(testQuestionnaireStatus, "created", "modified");
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionnaireStatus() throws Exception {
        int databaseSizeBeforeUpdate = questionnaireStatusRepository.findAll().size();

        // Create the QuestionnaireStatus

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionnaireStatusMockMvc.perform(put("/api/questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaireStatus)))
            .andExpect(status().isCreated());

        // Validate the QuestionnaireStatus in the database
        List<QuestionnaireStatus> questionnaireStatusList = questionnaireStatusRepository.findAll();
        assertThat(questionnaireStatusList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionnaireStatus() throws Exception {
        // Initialize the database
        questionnaireStatusService.save(questionnaireStatus);

        int databaseSizeBeforeDelete = questionnaireStatusRepository.findAll().size();

        // Get the questionnaireStatus
        restQuestionnaireStatusMockMvc.perform(delete("/api/questionnaire-statuses/{id}", questionnaireStatus.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean questionnaireStatusExistsInEs = questionnaireStatusSearchRepository.exists(questionnaireStatus.getId());
        assertThat(questionnaireStatusExistsInEs).isFalse();

        // Validate the database is empty
        List<QuestionnaireStatus> questionnaireStatusList = questionnaireStatusRepository.findAll();
        assertThat(questionnaireStatusList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchQuestionnaireStatus() throws Exception {
        // Initialize the database
        questionnaireStatusService.save(questionnaireStatus);

        // Search the questionnaireStatus
        restQuestionnaireStatusMockMvc.perform(get("/api/_search/questionnaire-statuses?query=id:" + questionnaireStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionnaireStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionnaireStatus.class);
        QuestionnaireStatus questionnaireStatus1 = new QuestionnaireStatus();
        questionnaireStatus1.setId(1L);
        QuestionnaireStatus questionnaireStatus2 = new QuestionnaireStatus();
        questionnaireStatus2.setId(questionnaireStatus1.getId());
        assertThat(questionnaireStatus1).isEqualTo(questionnaireStatus2);
        questionnaireStatus2.setId(2L);
        assertThat(questionnaireStatus1).isNotEqualTo(questionnaireStatus2);
        questionnaireStatus1.setId(null);
        assertThat(questionnaireStatus1).isNotEqualTo(questionnaireStatus2);
    }
}
