package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.GDPRAnswer;
import eu.hermeneut.repository.GDPRAnswerRepository;
import eu.hermeneut.service.GDPRAnswerService;
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
import eu.hermeneut.domain.enumeration.AnswerValue;
/**
 * Test class for the GDPRAnswerResource REST controller.
 *
 * @see GDPRAnswerResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class GDPRAnswerResourceIntTest {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final Language DEFAULT_LANGUAGE = Language.IT;
    private static final Language UPDATED_LANGUAGE = Language.EN;

    private static final AnswerValue DEFAULT_ANSWER_VALUE = AnswerValue.YES;
    private static final AnswerValue UPDATED_ANSWER_VALUE = AnswerValue.NO;

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    @Autowired
    private GDPRAnswerRepository gDPRAnswerRepository;

    @Autowired
    private GDPRAnswerService gDPRAnswerService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restGDPRAnswerMockMvc;

    private GDPRAnswer gDPRAnswer;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GDPRAnswerResource gDPRAnswerResource = new GDPRAnswerResource(gDPRAnswerService);
        this.restGDPRAnswerMockMvc = MockMvcBuilders.standaloneSetup(gDPRAnswerResource)
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
    public static GDPRAnswer createEntity(EntityManager em) {
        GDPRAnswer gDPRAnswer = new GDPRAnswer()
            .text(DEFAULT_TEXT)
            .language(DEFAULT_LANGUAGE)
            .answerValue(DEFAULT_ANSWER_VALUE)
            .order(DEFAULT_ORDER);
        return gDPRAnswer;
    }

    @Before
    public void initTest() {
        gDPRAnswer = createEntity(em);
    }

    @Test
    @Transactional
    public void createGDPRAnswer() throws Exception {
        int databaseSizeBeforeCreate = gDPRAnswerRepository.findAll().size();

        // Create the GDPRAnswer
        restGDPRAnswerMockMvc.perform(post("/api/gdpr-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRAnswer)))
            .andExpect(status().isCreated());

        // Validate the GDPRAnswer in the database
        List<GDPRAnswer> gDPRAnswerList = gDPRAnswerRepository.findAll();
        assertThat(gDPRAnswerList).hasSize(databaseSizeBeforeCreate + 1);
        GDPRAnswer testGDPRAnswer = gDPRAnswerList.get(gDPRAnswerList.size() - 1);
        assertThat(testGDPRAnswer.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testGDPRAnswer.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testGDPRAnswer.getAnswerValue()).isEqualTo(DEFAULT_ANSWER_VALUE);
        assertThat(testGDPRAnswer.getOrder()).isEqualTo(DEFAULT_ORDER);
    }

    @Test
    @Transactional
    public void createGDPRAnswerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = gDPRAnswerRepository.findAll().size();

        // Create the GDPRAnswer with an existing ID
        gDPRAnswer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGDPRAnswerMockMvc.perform(post("/api/gdpr-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRAnswer)))
            .andExpect(status().isBadRequest());

        // Validate the GDPRAnswer in the database
        List<GDPRAnswer> gDPRAnswerList = gDPRAnswerRepository.findAll();
        assertThat(gDPRAnswerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkLanguageIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRAnswerRepository.findAll().size();
        // set the field null
        gDPRAnswer.setLanguage(null);

        // Create the GDPRAnswer, which fails.

        restGDPRAnswerMockMvc.perform(post("/api/gdpr-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRAnswer)))
            .andExpect(status().isBadRequest());

        List<GDPRAnswer> gDPRAnswerList = gDPRAnswerRepository.findAll();
        assertThat(gDPRAnswerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllGDPRAnswers() throws Exception {
        // Initialize the database
        gDPRAnswerRepository.saveAndFlush(gDPRAnswer);

        // Get all the gDPRAnswerList
        restGDPRAnswerMockMvc.perform(get("/api/gdpr-answers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gDPRAnswer.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())))
            .andExpect(jsonPath("$.[*].answerValue").value(hasItem(DEFAULT_ANSWER_VALUE.toString())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)));
    }

    @Test
    @Transactional
    public void getGDPRAnswer() throws Exception {
        // Initialize the database
        gDPRAnswerRepository.saveAndFlush(gDPRAnswer);

        // Get the gDPRAnswer
        restGDPRAnswerMockMvc.perform(get("/api/gdpr-answers/{id}", gDPRAnswer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(gDPRAnswer.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE.toString()))
            .andExpect(jsonPath("$.answerValue").value(DEFAULT_ANSWER_VALUE.toString()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER));
    }

    @Test
    @Transactional
    public void getNonExistingGDPRAnswer() throws Exception {
        // Get the gDPRAnswer
        restGDPRAnswerMockMvc.perform(get("/api/gdpr-answers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGDPRAnswer() throws Exception {
        // Initialize the database
        gDPRAnswerService.save(gDPRAnswer);

        int databaseSizeBeforeUpdate = gDPRAnswerRepository.findAll().size();

        // Update the gDPRAnswer
        GDPRAnswer updatedGDPRAnswer = gDPRAnswerRepository.findOne(gDPRAnswer.getId());
        // Disconnect from session so that the updates on updatedGDPRAnswer are not directly saved in db
        em.detach(updatedGDPRAnswer);
        updatedGDPRAnswer
            .text(UPDATED_TEXT)
            .language(UPDATED_LANGUAGE)
            .answerValue(UPDATED_ANSWER_VALUE)
            .order(UPDATED_ORDER);

        restGDPRAnswerMockMvc.perform(put("/api/gdpr-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGDPRAnswer)))
            .andExpect(status().isOk());

        // Validate the GDPRAnswer in the database
        List<GDPRAnswer> gDPRAnswerList = gDPRAnswerRepository.findAll();
        assertThat(gDPRAnswerList).hasSize(databaseSizeBeforeUpdate);
        GDPRAnswer testGDPRAnswer = gDPRAnswerList.get(gDPRAnswerList.size() - 1);
        assertThat(testGDPRAnswer.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testGDPRAnswer.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testGDPRAnswer.getAnswerValue()).isEqualTo(UPDATED_ANSWER_VALUE);
        assertThat(testGDPRAnswer.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    public void updateNonExistingGDPRAnswer() throws Exception {
        int databaseSizeBeforeUpdate = gDPRAnswerRepository.findAll().size();

        // Create the GDPRAnswer

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restGDPRAnswerMockMvc.perform(put("/api/gdpr-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRAnswer)))
            .andExpect(status().isCreated());

        // Validate the GDPRAnswer in the database
        List<GDPRAnswer> gDPRAnswerList = gDPRAnswerRepository.findAll();
        assertThat(gDPRAnswerList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteGDPRAnswer() throws Exception {
        // Initialize the database
        gDPRAnswerService.save(gDPRAnswer);

        int databaseSizeBeforeDelete = gDPRAnswerRepository.findAll().size();

        // Get the gDPRAnswer
        restGDPRAnswerMockMvc.perform(delete("/api/gdpr-answers/{id}", gDPRAnswer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<GDPRAnswer> gDPRAnswerList = gDPRAnswerRepository.findAll();
        assertThat(gDPRAnswerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GDPRAnswer.class);
        GDPRAnswer gDPRAnswer1 = new GDPRAnswer();
        gDPRAnswer1.setId(1L);
        GDPRAnswer gDPRAnswer2 = new GDPRAnswer();
        gDPRAnswer2.setId(gDPRAnswer1.getId());
        assertThat(gDPRAnswer1).isEqualTo(gDPRAnswer2);
        gDPRAnswer2.setId(2L);
        assertThat(gDPRAnswer1).isNotEqualTo(gDPRAnswer2);
        gDPRAnswer1.setId(null);
        assertThat(gDPRAnswer1).isNotEqualTo(gDPRAnswer2);
    }
}
