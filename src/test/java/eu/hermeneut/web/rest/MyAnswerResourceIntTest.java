package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.MyAnswer;
import eu.hermeneut.repository.MyAnswerRepository;
import eu.hermeneut.service.MyAnswerService;
import eu.hermeneut.repository.search.MyAnswerSearchRepository;
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
 * Test class for the MyAnswerResource REST controller.
 *
 * @see MyAnswerResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class MyAnswerResourceIntTest {

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final Integer DEFAULT_ANSWER_OFFSET = 1;
    private static final Integer UPDATED_ANSWER_OFFSET = 2;

    @Autowired
    private MyAnswerRepository myAnswerRepository;

    @Autowired
    private MyAnswerService myAnswerService;

    @Autowired
    private MyAnswerSearchRepository myAnswerSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMyAnswerMockMvc;

    private MyAnswer myAnswer;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MyAnswerResource myAnswerResource = new MyAnswerResource(myAnswerService);
        this.restMyAnswerMockMvc = MockMvcBuilders.standaloneSetup(myAnswerResource)
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
    public static MyAnswer createEntity(EntityManager em) {
        MyAnswer myAnswer = new MyAnswer()
            .note(DEFAULT_NOTE)
            .answerOffset(DEFAULT_ANSWER_OFFSET);
        return myAnswer;
    }

    @Before
    public void initTest() {
        myAnswerSearchRepository.deleteAll();
        myAnswer = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyAnswer() throws Exception {
        int databaseSizeBeforeCreate = myAnswerRepository.findAll().size();

        // Create the MyAnswer
        restMyAnswerMockMvc.perform(post("/api/my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAnswer)))
            .andExpect(status().isCreated());

        // Validate the MyAnswer in the database
        List<MyAnswer> myAnswerList = myAnswerRepository.findAll();
        assertThat(myAnswerList).hasSize(databaseSizeBeforeCreate + 1);
        MyAnswer testMyAnswer = myAnswerList.get(myAnswerList.size() - 1);
        assertThat(testMyAnswer.getNote()).isEqualTo(DEFAULT_NOTE);
        assertThat(testMyAnswer.getAnswerOffset()).isEqualTo(DEFAULT_ANSWER_OFFSET);

        // Validate the MyAnswer in Elasticsearch
        MyAnswer myAnswerEs = myAnswerSearchRepository.findOne(testMyAnswer.getId());
        assertThat(myAnswerEs).isEqualToIgnoringGivenFields(testMyAnswer);
    }

    @Test
    @Transactional
    public void createMyAnswerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = myAnswerRepository.findAll().size();

        // Create the MyAnswer with an existing ID
        myAnswer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyAnswerMockMvc.perform(post("/api/my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAnswer)))
            .andExpect(status().isBadRequest());

        // Validate the MyAnswer in the database
        List<MyAnswer> myAnswerList = myAnswerRepository.findAll();
        assertThat(myAnswerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkAnswerOffsetIsRequired() throws Exception {
        int databaseSizeBeforeTest = myAnswerRepository.findAll().size();
        // set the field null
        myAnswer.setAnswerOffset(null);

        // Create the MyAnswer, which fails.

        restMyAnswerMockMvc.perform(post("/api/my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAnswer)))
            .andExpect(status().isBadRequest());

        List<MyAnswer> myAnswerList = myAnswerRepository.findAll();
        assertThat(myAnswerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMyAnswers() throws Exception {
        // Initialize the database
        myAnswerRepository.saveAndFlush(myAnswer);

        // Get all the myAnswerList
        restMyAnswerMockMvc.perform(get("/api/my-answers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myAnswer.getId().intValue())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.toString())))
            .andExpect(jsonPath("$.[*].answerOffset").value(hasItem(DEFAULT_ANSWER_OFFSET)));
    }

    @Test
    @Transactional
    public void getMyAnswer() throws Exception {
        // Initialize the database
        myAnswerRepository.saveAndFlush(myAnswer);

        // Get the myAnswer
        restMyAnswerMockMvc.perform(get("/api/my-answers/{id}", myAnswer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(myAnswer.getId().intValue()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE.toString()))
            .andExpect(jsonPath("$.answerOffset").value(DEFAULT_ANSWER_OFFSET));
    }

    @Test
    @Transactional
    public void getNonExistingMyAnswer() throws Exception {
        // Get the myAnswer
        restMyAnswerMockMvc.perform(get("/api/my-answers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMyAnswer() throws Exception {
        // Initialize the database
        myAnswerService.save(myAnswer);

        int databaseSizeBeforeUpdate = myAnswerRepository.findAll().size();

        // Update the myAnswer
        MyAnswer updatedMyAnswer = myAnswerRepository.findOne(myAnswer.getId());
        // Disconnect from session so that the updates on updatedMyAnswer are not directly saved in db
        em.detach(updatedMyAnswer);
        updatedMyAnswer
            .note(UPDATED_NOTE)
            .answerOffset(UPDATED_ANSWER_OFFSET);

        restMyAnswerMockMvc.perform(put("/api/my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMyAnswer)))
            .andExpect(status().isOk());

        // Validate the MyAnswer in the database
        List<MyAnswer> myAnswerList = myAnswerRepository.findAll();
        assertThat(myAnswerList).hasSize(databaseSizeBeforeUpdate);
        MyAnswer testMyAnswer = myAnswerList.get(myAnswerList.size() - 1);
        assertThat(testMyAnswer.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testMyAnswer.getAnswerOffset()).isEqualTo(UPDATED_ANSWER_OFFSET);

        // Validate the MyAnswer in Elasticsearch
        MyAnswer myAnswerEs = myAnswerSearchRepository.findOne(testMyAnswer.getId());
        assertThat(myAnswerEs).isEqualToIgnoringGivenFields(testMyAnswer);
    }

    @Test
    @Transactional
    public void updateNonExistingMyAnswer() throws Exception {
        int databaseSizeBeforeUpdate = myAnswerRepository.findAll().size();

        // Create the MyAnswer

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMyAnswerMockMvc.perform(put("/api/my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAnswer)))
            .andExpect(status().isCreated());

        // Validate the MyAnswer in the database
        List<MyAnswer> myAnswerList = myAnswerRepository.findAll();
        assertThat(myAnswerList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMyAnswer() throws Exception {
        // Initialize the database
        myAnswerService.save(myAnswer);

        int databaseSizeBeforeDelete = myAnswerRepository.findAll().size();

        // Get the myAnswer
        restMyAnswerMockMvc.perform(delete("/api/my-answers/{id}", myAnswer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean myAnswerExistsInEs = myAnswerSearchRepository.exists(myAnswer.getId());
        assertThat(myAnswerExistsInEs).isFalse();

        // Validate the database is empty
        List<MyAnswer> myAnswerList = myAnswerRepository.findAll();
        assertThat(myAnswerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMyAnswer() throws Exception {
        // Initialize the database
        myAnswerService.save(myAnswer);

        // Search the myAnswer
        restMyAnswerMockMvc.perform(get("/api/_search/my-answers?query=id:" + myAnswer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myAnswer.getId().intValue())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.toString())))
            .andExpect(jsonPath("$.[*].answerOffset").value(hasItem(DEFAULT_ANSWER_OFFSET)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyAnswer.class);
        MyAnswer myAnswer1 = new MyAnswer();
        myAnswer1.setId(1L);
        MyAnswer myAnswer2 = new MyAnswer();
        myAnswer2.setId(myAnswer1.getId());
        assertThat(myAnswer1).isEqualTo(myAnswer2);
        myAnswer2.setId(2L);
        assertThat(myAnswer1).isNotEqualTo(myAnswer2);
        myAnswer1.setId(null);
        assertThat(myAnswer1).isNotEqualTo(myAnswer2);
    }
}
