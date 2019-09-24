package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.GDPRMyAnswer;
import eu.hermeneut.repository.GDPRMyAnswerRepository;
import eu.hermeneut.service.GDPRMyAnswerService;
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
 * Test class for the GDPRMyAnswerResource REST controller.
 *
 * @see GDPRMyAnswerResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class GDPRMyAnswerResourceIntTest {

    @Autowired
    private GDPRMyAnswerRepository gDPRMyAnswerRepository;

    @Autowired
    private GDPRMyAnswerService gDPRMyAnswerService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restGDPRMyAnswerMockMvc;

    private GDPRMyAnswer gDPRMyAnswer;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GDPRMyAnswerResource gDPRMyAnswerResource = new GDPRMyAnswerResource(gDPRMyAnswerService);
        this.restGDPRMyAnswerMockMvc = MockMvcBuilders.standaloneSetup(gDPRMyAnswerResource)
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
    public static GDPRMyAnswer createEntity(EntityManager em) {
        GDPRMyAnswer gDPRMyAnswer = new GDPRMyAnswer();
        return gDPRMyAnswer;
    }

    @Before
    public void initTest() {
        gDPRMyAnswer = createEntity(em);
    }

    @Test
    @Transactional
    public void createGDPRMyAnswer() throws Exception {
        int databaseSizeBeforeCreate = gDPRMyAnswerRepository.findAll().size();

        // Create the GDPRMyAnswer
        restGDPRMyAnswerMockMvc.perform(post("/api/gdpr-my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRMyAnswer)))
            .andExpect(status().isCreated());

        // Validate the GDPRMyAnswer in the database
        List<GDPRMyAnswer> gDPRMyAnswerList = gDPRMyAnswerRepository.findAll();
        assertThat(gDPRMyAnswerList).hasSize(databaseSizeBeforeCreate + 1);
        GDPRMyAnswer testGDPRMyAnswer = gDPRMyAnswerList.get(gDPRMyAnswerList.size() - 1);
    }

    @Test
    @Transactional
    public void createGDPRMyAnswerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = gDPRMyAnswerRepository.findAll().size();

        // Create the GDPRMyAnswer with an existing ID
        gDPRMyAnswer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGDPRMyAnswerMockMvc.perform(post("/api/gdpr-my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRMyAnswer)))
            .andExpect(status().isBadRequest());

        // Validate the GDPRMyAnswer in the database
        List<GDPRMyAnswer> gDPRMyAnswerList = gDPRMyAnswerRepository.findAll();
        assertThat(gDPRMyAnswerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllGDPRMyAnswers() throws Exception {
        // Initialize the database
        gDPRMyAnswerRepository.saveAndFlush(gDPRMyAnswer);

        // Get all the gDPRMyAnswerList
        restGDPRMyAnswerMockMvc.perform(get("/api/gdpr-my-answers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gDPRMyAnswer.getId().intValue())));
    }

    @Test
    @Transactional
    public void getGDPRMyAnswer() throws Exception {
        // Initialize the database
        gDPRMyAnswerRepository.saveAndFlush(gDPRMyAnswer);

        // Get the gDPRMyAnswer
        restGDPRMyAnswerMockMvc.perform(get("/api/gdpr-my-answers/{id}", gDPRMyAnswer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(gDPRMyAnswer.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingGDPRMyAnswer() throws Exception {
        // Get the gDPRMyAnswer
        restGDPRMyAnswerMockMvc.perform(get("/api/gdpr-my-answers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGDPRMyAnswer() throws Exception {
        // Initialize the database
        gDPRMyAnswerService.save(gDPRMyAnswer);

        int databaseSizeBeforeUpdate = gDPRMyAnswerRepository.findAll().size();

        // Update the gDPRMyAnswer
        GDPRMyAnswer updatedGDPRMyAnswer = gDPRMyAnswerRepository.findOne(gDPRMyAnswer.getId());
        // Disconnect from session so that the updates on updatedGDPRMyAnswer are not directly saved in db
        em.detach(updatedGDPRMyAnswer);

        restGDPRMyAnswerMockMvc.perform(put("/api/gdpr-my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGDPRMyAnswer)))
            .andExpect(status().isOk());

        // Validate the GDPRMyAnswer in the database
        List<GDPRMyAnswer> gDPRMyAnswerList = gDPRMyAnswerRepository.findAll();
        assertThat(gDPRMyAnswerList).hasSize(databaseSizeBeforeUpdate);
        GDPRMyAnswer testGDPRMyAnswer = gDPRMyAnswerList.get(gDPRMyAnswerList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingGDPRMyAnswer() throws Exception {
        int databaseSizeBeforeUpdate = gDPRMyAnswerRepository.findAll().size();

        // Create the GDPRMyAnswer

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restGDPRMyAnswerMockMvc.perform(put("/api/gdpr-my-answers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRMyAnswer)))
            .andExpect(status().isCreated());

        // Validate the GDPRMyAnswer in the database
        List<GDPRMyAnswer> gDPRMyAnswerList = gDPRMyAnswerRepository.findAll();
        assertThat(gDPRMyAnswerList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteGDPRMyAnswer() throws Exception {
        // Initialize the database
        gDPRMyAnswerService.save(gDPRMyAnswer);

        int databaseSizeBeforeDelete = gDPRMyAnswerRepository.findAll().size();

        // Get the gDPRMyAnswer
        restGDPRMyAnswerMockMvc.perform(delete("/api/gdpr-my-answers/{id}", gDPRMyAnswer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<GDPRMyAnswer> gDPRMyAnswerList = gDPRMyAnswerRepository.findAll();
        assertThat(gDPRMyAnswerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GDPRMyAnswer.class);
        GDPRMyAnswer gDPRMyAnswer1 = new GDPRMyAnswer();
        gDPRMyAnswer1.setId(1L);
        GDPRMyAnswer gDPRMyAnswer2 = new GDPRMyAnswer();
        gDPRMyAnswer2.setId(gDPRMyAnswer1.getId());
        assertThat(gDPRMyAnswer1).isEqualTo(gDPRMyAnswer2);
        gDPRMyAnswer2.setId(2L);
        assertThat(gDPRMyAnswer1).isNotEqualTo(gDPRMyAnswer2);
        gDPRMyAnswer1.setId(null);
        assertThat(gDPRMyAnswer1).isNotEqualTo(gDPRMyAnswer2);
    }
}
