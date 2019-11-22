package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.QuestionRelevance;
import eu.hermeneut.repository.QuestionRelevanceRepository;
import eu.hermeneut.service.QuestionRelevanceService;
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

/**
 * Test class for the QuestionRelevanceResource REST controller.
 *
 * @see QuestionRelevanceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class QuestionRelevanceResourceIntTest {

    private static final Integer DEFAULT_RELEVANCE = 0;
    private static final Integer UPDATED_RELEVANCE = 1;

    @Autowired
    private QuestionRelevanceRepository questionRelevanceRepository;

    @Autowired
    private QuestionRelevanceService questionRelevanceService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionRelevanceMockMvc;

    private QuestionRelevance questionRelevance;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionRelevanceResource questionRelevanceResource = new QuestionRelevanceResource(questionRelevanceService);
        this.restQuestionRelevanceMockMvc = MockMvcBuilders.standaloneSetup(questionRelevanceResource)
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
    public static QuestionRelevance createEntity(EntityManager em) {
        QuestionRelevance questionRelevance = new QuestionRelevance()
            .relevance(DEFAULT_RELEVANCE);
        return questionRelevance;
    }

    @Before
    public void initTest() {
        questionRelevance = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionRelevance() throws Exception {
        int databaseSizeBeforeCreate = questionRelevanceRepository.findAll().size();

        // Create the QuestionRelevance
        restQuestionRelevanceMockMvc.perform(post("/api/question-relevances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionRelevance)))
            .andExpect(status().isCreated());

        // Validate the QuestionRelevance in the database
        List<QuestionRelevance> questionRelevanceList = questionRelevanceRepository.findAll();
        assertThat(questionRelevanceList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionRelevance testQuestionRelevance = questionRelevanceList.get(questionRelevanceList.size() - 1);
        assertThat(testQuestionRelevance.getRelevance()).isEqualTo(DEFAULT_RELEVANCE);
    }

    @Test
    @Transactional
    public void createQuestionRelevanceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionRelevanceRepository.findAll().size();

        // Create the QuestionRelevance with an existing ID
        questionRelevance.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionRelevanceMockMvc.perform(post("/api/question-relevances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionRelevance)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionRelevance in the database
        List<QuestionRelevance> questionRelevanceList = questionRelevanceRepository.findAll();
        assertThat(questionRelevanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllQuestionRelevances() throws Exception {
        // Initialize the database
        questionRelevanceRepository.saveAndFlush(questionRelevance);

        // Get all the questionRelevanceList
        restQuestionRelevanceMockMvc.perform(get("/api/question-relevances?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionRelevance.getId().intValue())))
            .andExpect(jsonPath("$.[*].relevance").value(hasItem(DEFAULT_RELEVANCE)));
    }

    @Test
    @Transactional
    public void getQuestionRelevance() throws Exception {
        // Initialize the database
        questionRelevanceRepository.saveAndFlush(questionRelevance);

        // Get the questionRelevance
        restQuestionRelevanceMockMvc.perform(get("/api/question-relevances/{id}", questionRelevance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionRelevance.getId().intValue()))
            .andExpect(jsonPath("$.relevance").value(DEFAULT_RELEVANCE));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionRelevance() throws Exception {
        // Get the questionRelevance
        restQuestionRelevanceMockMvc.perform(get("/api/question-relevances/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionRelevance() throws Exception {
        // Initialize the database
        questionRelevanceService.save(questionRelevance);

        int databaseSizeBeforeUpdate = questionRelevanceRepository.findAll().size();

        // Update the questionRelevance
        QuestionRelevance updatedQuestionRelevance = questionRelevanceRepository.findOne(questionRelevance.getId());
        // Disconnect from session so that the updates on updatedQuestionRelevance are not directly saved in db
        em.detach(updatedQuestionRelevance);
        updatedQuestionRelevance
            .relevance(UPDATED_RELEVANCE);

        restQuestionRelevanceMockMvc.perform(put("/api/question-relevances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuestionRelevance)))
            .andExpect(status().isOk());

        // Validate the QuestionRelevance in the database
        List<QuestionRelevance> questionRelevanceList = questionRelevanceRepository.findAll();
        assertThat(questionRelevanceList).hasSize(databaseSizeBeforeUpdate);
        QuestionRelevance testQuestionRelevance = questionRelevanceList.get(questionRelevanceList.size() - 1);
        assertThat(testQuestionRelevance.getRelevance()).isEqualTo(UPDATED_RELEVANCE);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionRelevance() throws Exception {
        int databaseSizeBeforeUpdate = questionRelevanceRepository.findAll().size();

        // Create the QuestionRelevance

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionRelevanceMockMvc.perform(put("/api/question-relevances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionRelevance)))
            .andExpect(status().isCreated());

        // Validate the QuestionRelevance in the database
        List<QuestionRelevance> questionRelevanceList = questionRelevanceRepository.findAll();
        assertThat(questionRelevanceList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionRelevance() throws Exception {
        // Initialize the database
        questionRelevanceService.save(questionRelevance);

        int databaseSizeBeforeDelete = questionRelevanceRepository.findAll().size();

        // Get the questionRelevance
        restQuestionRelevanceMockMvc.perform(delete("/api/question-relevances/{id}", questionRelevance.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<QuestionRelevance> questionRelevanceList = questionRelevanceRepository.findAll();
        assertThat(questionRelevanceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionRelevance.class);
        QuestionRelevance questionRelevance1 = new QuestionRelevance();
        questionRelevance1.setId(1L);
        QuestionRelevance questionRelevance2 = new QuestionRelevance();
        questionRelevance2.setId(questionRelevance1.getId());
        assertThat(questionRelevance1).isEqualTo(questionRelevance2);
        questionRelevance2.setId(2L);
        assertThat(questionRelevance1).isNotEqualTo(questionRelevance2);
        questionRelevance1.setId(null);
        assertThat(questionRelevance1).isNotEqualTo(questionRelevance2);
    }
}
