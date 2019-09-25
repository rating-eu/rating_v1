package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.GDPRQuestion;
import eu.hermeneut.repository.GDPRQuestionRepository;
import eu.hermeneut.service.GDPRQuestionService;
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

import eu.hermeneut.domain.enumeration.Language;
import eu.hermeneut.domain.enumeration.GDPRAnswerType;
import eu.hermeneut.domain.enumeration.DataOperationField;
import eu.hermeneut.domain.enumeration.SecurityPillar;
import eu.hermeneut.domain.enumeration.ThreatArea;
/**
 * Test class for the GDPRQuestionResource REST controller.
 *
 * @see GDPRQuestionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class GDPRQuestionResourceIntTest {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Language DEFAULT_LANGUAGE = Language.IT;
    private static final Language UPDATED_LANGUAGE = Language.EN;

    private static final GDPRAnswerType DEFAULT_ANSWER_TYPE = GDPRAnswerType.OPEN;
    private static final GDPRAnswerType UPDATED_ANSWER_TYPE = GDPRAnswerType.MULTIPLE_CHOICE;

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final DataOperationField DEFAULT_DATA_OPERATION_FIELD = DataOperationField.NAME;
    private static final DataOperationField UPDATED_DATA_OPERATION_FIELD = DataOperationField.PROCESSED_DATA;

    private static final SecurityPillar DEFAULT_SECURITY_PILLAR = SecurityPillar.CONFIDENTIALITY;
    private static final SecurityPillar UPDATED_SECURITY_PILLAR = SecurityPillar.INTEGRITY;

    private static final ThreatArea DEFAULT_THREAT_AREA = ThreatArea.NETWORK_AND_TECHNICAL_RESOURCES;
    private static final ThreatArea UPDATED_THREAT_AREA = ThreatArea.PROCEDURES_RELATED_TO_THE_PROCESSING_OF_PERSONAL_DATA;

    @Autowired
    private GDPRQuestionRepository gDPRQuestionRepository;

    @Autowired
    private GDPRQuestionService gDPRQuestionService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restGDPRQuestionMockMvc;

    private GDPRQuestion gDPRQuestion;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GDPRQuestionResource gDPRQuestionResource = new GDPRQuestionResource(gDPRQuestionService);
        this.restGDPRQuestionMockMvc = MockMvcBuilders.standaloneSetup(gDPRQuestionResource)
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
    public static GDPRQuestion createEntity(EntityManager em) {
        GDPRQuestion gDPRQuestion = new GDPRQuestion()
            .text(DEFAULT_TEXT)
            .description(DEFAULT_DESCRIPTION)
            .language(DEFAULT_LANGUAGE)
            .answerType(DEFAULT_ANSWER_TYPE)
            .order(DEFAULT_ORDER)
            .dataOperationField(DEFAULT_DATA_OPERATION_FIELD)
            .securityPillar(DEFAULT_SECURITY_PILLAR)
            .threatArea(DEFAULT_THREAT_AREA);
        return gDPRQuestion;
    }

    @Before
    public void initTest() {
        gDPRQuestion = createEntity(em);
    }

    @Test
    @Transactional
    public void createGDPRQuestion() throws Exception {
        int databaseSizeBeforeCreate = gDPRQuestionRepository.findAll().size();

        // Create the GDPRQuestion
        restGDPRQuestionMockMvc.perform(post("/api/gdpr-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestion)))
            .andExpect(status().isCreated());

        // Validate the GDPRQuestion in the database
        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeCreate + 1);
        GDPRQuestion testGDPRQuestion = gDPRQuestionList.get(gDPRQuestionList.size() - 1);
        assertThat(testGDPRQuestion.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testGDPRQuestion.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testGDPRQuestion.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testGDPRQuestion.getAnswerType()).isEqualTo(DEFAULT_ANSWER_TYPE);
        assertThat(testGDPRQuestion.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testGDPRQuestion.getDataOperationField()).isEqualTo(DEFAULT_DATA_OPERATION_FIELD);
        assertThat(testGDPRQuestion.getSecurityPillar()).isEqualTo(DEFAULT_SECURITY_PILLAR);
        assertThat(testGDPRQuestion.getThreatArea()).isEqualTo(DEFAULT_THREAT_AREA);
    }

    @Test
    @Transactional
    public void createGDPRQuestionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = gDPRQuestionRepository.findAll().size();

        // Create the GDPRQuestion with an existing ID
        gDPRQuestion.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGDPRQuestionMockMvc.perform(post("/api/gdpr-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestion)))
            .andExpect(status().isBadRequest());

        // Validate the GDPRQuestion in the database
        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRQuestionRepository.findAll().size();
        // set the field null
        gDPRQuestion.setText(null);

        // Create the GDPRQuestion, which fails.

        restGDPRQuestionMockMvc.perform(post("/api/gdpr-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestion)))
            .andExpect(status().isBadRequest());

        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLanguageIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRQuestionRepository.findAll().size();
        // set the field null
        gDPRQuestion.setLanguage(null);

        // Create the GDPRQuestion, which fails.

        restGDPRQuestionMockMvc.perform(post("/api/gdpr-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestion)))
            .andExpect(status().isBadRequest());

        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAnswerTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRQuestionRepository.findAll().size();
        // set the field null
        gDPRQuestion.setAnswerType(null);

        // Create the GDPRQuestion, which fails.

        restGDPRQuestionMockMvc.perform(post("/api/gdpr-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestion)))
            .andExpect(status().isBadRequest());

        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRQuestionRepository.findAll().size();
        // set the field null
        gDPRQuestion.setOrder(null);

        // Create the GDPRQuestion, which fails.

        restGDPRQuestionMockMvc.perform(post("/api/gdpr-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestion)))
            .andExpect(status().isBadRequest());

        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllGDPRQuestions() throws Exception {
        // Initialize the database
        gDPRQuestionRepository.saveAndFlush(gDPRQuestion);

        // Get all the gDPRQuestionList
        restGDPRQuestionMockMvc.perform(get("/api/gdpr-questions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gDPRQuestion.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())))
            .andExpect(jsonPath("$.[*].answerType").value(hasItem(DEFAULT_ANSWER_TYPE.toString())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].dataOperationField").value(hasItem(DEFAULT_DATA_OPERATION_FIELD.toString())))
            .andExpect(jsonPath("$.[*].securityPillar").value(hasItem(DEFAULT_SECURITY_PILLAR.toString())))
            .andExpect(jsonPath("$.[*].threatArea").value(hasItem(DEFAULT_THREAT_AREA.toString())));
    }

    @Test
    @Transactional
    public void getGDPRQuestion() throws Exception {
        // Initialize the database
        gDPRQuestionRepository.saveAndFlush(gDPRQuestion);

        // Get the gDPRQuestion
        restGDPRQuestionMockMvc.perform(get("/api/gdpr-questions/{id}", gDPRQuestion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(gDPRQuestion.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE.toString()))
            .andExpect(jsonPath("$.answerType").value(DEFAULT_ANSWER_TYPE.toString()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.dataOperationField").value(DEFAULT_DATA_OPERATION_FIELD.toString()))
            .andExpect(jsonPath("$.securityPillar").value(DEFAULT_SECURITY_PILLAR.toString()))
            .andExpect(jsonPath("$.threatArea").value(DEFAULT_THREAT_AREA.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGDPRQuestion() throws Exception {
        // Get the gDPRQuestion
        restGDPRQuestionMockMvc.perform(get("/api/gdpr-questions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGDPRQuestion() throws Exception {
        // Initialize the database
        gDPRQuestionService.save(gDPRQuestion);

        int databaseSizeBeforeUpdate = gDPRQuestionRepository.findAll().size();

        // Update the gDPRQuestion
        GDPRQuestion updatedGDPRQuestion = gDPRQuestionRepository.findOne(gDPRQuestion.getId());
        // Disconnect from session so that the updates on updatedGDPRQuestion are not directly saved in db
        em.detach(updatedGDPRQuestion);
        updatedGDPRQuestion
            .text(UPDATED_TEXT)
            .description(UPDATED_DESCRIPTION)
            .language(UPDATED_LANGUAGE)
            .answerType(UPDATED_ANSWER_TYPE)
            .order(UPDATED_ORDER)
            .dataOperationField(UPDATED_DATA_OPERATION_FIELD)
            .securityPillar(UPDATED_SECURITY_PILLAR)
            .threatArea(UPDATED_THREAT_AREA);

        restGDPRQuestionMockMvc.perform(put("/api/gdpr-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGDPRQuestion)))
            .andExpect(status().isOk());

        // Validate the GDPRQuestion in the database
        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeUpdate);
        GDPRQuestion testGDPRQuestion = gDPRQuestionList.get(gDPRQuestionList.size() - 1);
        assertThat(testGDPRQuestion.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testGDPRQuestion.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGDPRQuestion.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testGDPRQuestion.getAnswerType()).isEqualTo(UPDATED_ANSWER_TYPE);
        assertThat(testGDPRQuestion.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testGDPRQuestion.getDataOperationField()).isEqualTo(UPDATED_DATA_OPERATION_FIELD);
        assertThat(testGDPRQuestion.getSecurityPillar()).isEqualTo(UPDATED_SECURITY_PILLAR);
        assertThat(testGDPRQuestion.getThreatArea()).isEqualTo(UPDATED_THREAT_AREA);
    }

    @Test
    @Transactional
    public void updateNonExistingGDPRQuestion() throws Exception {
        int databaseSizeBeforeUpdate = gDPRQuestionRepository.findAll().size();

        // Create the GDPRQuestion

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restGDPRQuestionMockMvc.perform(put("/api/gdpr-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestion)))
            .andExpect(status().isCreated());

        // Validate the GDPRQuestion in the database
        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteGDPRQuestion() throws Exception {
        // Initialize the database
        gDPRQuestionService.save(gDPRQuestion);

        int databaseSizeBeforeDelete = gDPRQuestionRepository.findAll().size();

        // Get the gDPRQuestion
        restGDPRQuestionMockMvc.perform(delete("/api/gdpr-questions/{id}", gDPRQuestion.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<GDPRQuestion> gDPRQuestionList = gDPRQuestionRepository.findAll();
        assertThat(gDPRQuestionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GDPRQuestion.class);
        GDPRQuestion gDPRQuestion1 = new GDPRQuestion();
        gDPRQuestion1.setId(1L);
        GDPRQuestion gDPRQuestion2 = new GDPRQuestion();
        gDPRQuestion2.setId(gDPRQuestion1.getId());
        assertThat(gDPRQuestion1).isEqualTo(gDPRQuestion2);
        gDPRQuestion2.setId(2L);
        assertThat(gDPRQuestion1).isNotEqualTo(gDPRQuestion2);
        gDPRQuestion1.setId(null);
        assertThat(gDPRQuestion1).isNotEqualTo(gDPRQuestion2);
    }
}
