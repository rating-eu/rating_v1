package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.repository.QuestionnaireRepository;
import eu.hermeneut.service.QuestionnaireService;
import eu.hermeneut.repository.search.QuestionnaireSearchRepository;
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

import eu.hermeneut.domain.enumeration.Q_Scope;
/**
 * Test class for the QuestionnaireResource REST controller.
 *
 * @see QuestionnaireResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class QuestionnaireResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Q_Scope DEFAULT_PURPOSE = Q_Scope.ID_THREAT_AGENT;
    private static final Q_Scope UPDATED_PURPOSE = Q_Scope.SELFASSESSMENT;

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private QuestionnaireService questionnaireService;

    @Autowired
    private QuestionnaireSearchRepository questionnaireSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jackson2HttpMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionnaireMockMvc;

    private Questionnaire questionnaire;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionnaireResource questionnaireResource = new QuestionnaireResource(questionnaireService);
        this.restQuestionnaireMockMvc = MockMvcBuilders.standaloneSetup(questionnaireResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jackson2HttpMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Questionnaire createEntity(EntityManager em) {
        Questionnaire questionnaire = new Questionnaire()
            .name(DEFAULT_NAME)
            .purpose(DEFAULT_PURPOSE)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED);
        return questionnaire;
    }

    @Before
    public void initTest() {
        questionnaireSearchRepository.deleteAll();
        questionnaire = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionnaire() throws Exception {
        int databaseSizeBeforeCreate = questionnaireRepository.findAll().size();

        // Create the Questionnaire
        restQuestionnaireMockMvc.perform(post("/api/questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaire)))
            .andExpect(status().isCreated());

        // Validate the Questionnaire in the database
        List<Questionnaire> questionnaireList = questionnaireRepository.findAll();
        assertThat(questionnaireList).hasSize(databaseSizeBeforeCreate + 1);
        Questionnaire testQuestionnaire = questionnaireList.get(questionnaireList.size() - 1);
        assertThat(testQuestionnaire.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testQuestionnaire.getPurpose()).isEqualTo(DEFAULT_PURPOSE);
        assertThat(testQuestionnaire.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testQuestionnaire.getModified()).isEqualTo(DEFAULT_MODIFIED);

        // Validate the Questionnaire in Elasticsearch
        Questionnaire questionnaireEs = questionnaireSearchRepository.findOne(testQuestionnaire.getId());
        assertThat(testQuestionnaire.getCreated()).isEqualTo(testQuestionnaire.getCreated());
        assertThat(testQuestionnaire.getModified()).isEqualTo(testQuestionnaire.getModified());
        assertThat(questionnaireEs).isEqualToIgnoringGivenFields(testQuestionnaire, "created", "modified");
    }

    @Test
    @Transactional
    public void createQuestionnaireWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionnaireRepository.findAll().size();

        // Create the Questionnaire with an existing ID
        questionnaire.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionnaireMockMvc.perform(post("/api/questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaire)))
            .andExpect(status().isBadRequest());

        // Validate the Questionnaire in the database
        List<Questionnaire> questionnaireList = questionnaireRepository.findAll();
        assertThat(questionnaireList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionnaireRepository.findAll().size();
        // set the field null
        questionnaire.setName(null);

        // Create the Questionnaire, which fails.

        restQuestionnaireMockMvc.perform(post("/api/questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaire)))
            .andExpect(status().isBadRequest());

        List<Questionnaire> questionnaireList = questionnaireRepository.findAll();
        assertThat(questionnaireList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPurposeIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionnaireRepository.findAll().size();
        // set the field null
        questionnaire.setPurpose(null);

        // Create the Questionnaire, which fails.

        restQuestionnaireMockMvc.perform(post("/api/questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaire)))
            .andExpect(status().isBadRequest());

        List<Questionnaire> questionnaireList = questionnaireRepository.findAll();
        assertThat(questionnaireList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionnaires() throws Exception {
        // Initialize the database
        questionnaireRepository.saveAndFlush(questionnaire);

        // Get all the questionnaireList
        restQuestionnaireMockMvc.perform(get("/api/questionnaires?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionnaire.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].purpose").value(hasItem(DEFAULT_PURPOSE.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void getQuestionnaire() throws Exception {
        // Initialize the database
        questionnaireRepository.saveAndFlush(questionnaire);

        // Get the questionnaire
        restQuestionnaireMockMvc.perform(get("/api/questionnaires/{id}", questionnaire.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionnaire.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.purpose").value(DEFAULT_PURPOSE.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionnaire() throws Exception {
        // Get the questionnaire
        restQuestionnaireMockMvc.perform(get("/api/questionnaires/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionnaire() throws Exception {
        // Initialize the database
        questionnaireService.save(questionnaire);

        int databaseSizeBeforeUpdate = questionnaireRepository.findAll().size();

        // Update the questionnaire
        Questionnaire updatedQuestionnaire = questionnaireRepository.findOne(questionnaire.getId());
        // Disconnect from session so that the updates on updatedQuestionnaire are not directly saved in db
        em.detach(updatedQuestionnaire);
        updatedQuestionnaire
            .name(UPDATED_NAME)
            .purpose(UPDATED_PURPOSE)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED);

        restQuestionnaireMockMvc.perform(put("/api/questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuestionnaire)))
            .andExpect(status().isOk());

        // Validate the Questionnaire in the database
        List<Questionnaire> questionnaireList = questionnaireRepository.findAll();
        assertThat(questionnaireList).hasSize(databaseSizeBeforeUpdate);
        Questionnaire testQuestionnaire = questionnaireList.get(questionnaireList.size() - 1);
        assertThat(testQuestionnaire.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testQuestionnaire.getPurpose()).isEqualTo(UPDATED_PURPOSE);
        assertThat(testQuestionnaire.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testQuestionnaire.getModified()).isEqualTo(UPDATED_MODIFIED);

        // Validate the Questionnaire in Elasticsearch
        Questionnaire questionnaireEs = questionnaireSearchRepository.findOne(testQuestionnaire.getId());
        assertThat(testQuestionnaire.getCreated()).isEqualTo(testQuestionnaire.getCreated());
        assertThat(testQuestionnaire.getModified()).isEqualTo(testQuestionnaire.getModified());
        assertThat(questionnaireEs).isEqualToIgnoringGivenFields(testQuestionnaire, "created", "modified");
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionnaire() throws Exception {
        int databaseSizeBeforeUpdate = questionnaireRepository.findAll().size();

        // Create the Questionnaire

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionnaireMockMvc.perform(put("/api/questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionnaire)))
            .andExpect(status().isCreated());

        // Validate the Questionnaire in the database
        List<Questionnaire> questionnaireList = questionnaireRepository.findAll();
        assertThat(questionnaireList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionnaire() throws Exception {
        // Initialize the database
        questionnaireService.save(questionnaire);

        int databaseSizeBeforeDelete = questionnaireRepository.findAll().size();

        // Get the questionnaire
        restQuestionnaireMockMvc.perform(delete("/api/questionnaires/{id}", questionnaire.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean questionnaireExistsInEs = questionnaireSearchRepository.exists(questionnaire.getId());
        assertThat(questionnaireExistsInEs).isFalse();

        // Validate the database is empty
        List<Questionnaire> questionnaireList = questionnaireRepository.findAll();
        assertThat(questionnaireList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchQuestionnaire() throws Exception {
        // Initialize the database
        questionnaireService.save(questionnaire);

        // Search the questionnaire
        restQuestionnaireMockMvc.perform(get("/api/_search/questionnaires?query=id:" + questionnaire.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionnaire.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].purpose").value(hasItem(DEFAULT_PURPOSE.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Questionnaire.class);
        Questionnaire questionnaire1 = new Questionnaire();
        questionnaire1.setId(1L);
        Questionnaire questionnaire2 = new Questionnaire();
        questionnaire2.setId(questionnaire1.getId());
        assertThat(questionnaire1).isEqualTo(questionnaire2);
        questionnaire2.setId(2L);
        assertThat(questionnaire1).isNotEqualTo(questionnaire2);
        questionnaire1.setId(null);
        assertThat(questionnaire1).isNotEqualTo(questionnaire2);
    }
}
