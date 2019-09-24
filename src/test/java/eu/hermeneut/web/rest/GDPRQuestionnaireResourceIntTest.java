package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.GDPRQuestionnaire;
import eu.hermeneut.repository.GDPRQuestionnaireRepository;
import eu.hermeneut.service.GDPRQuestionnaireService;
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

import eu.hermeneut.domain.enumeration.GDPRQuestionnairePurpose;
/**
 * Test class for the GDPRQuestionnaireResource REST controller.
 *
 * @see GDPRQuestionnaireResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class GDPRQuestionnaireResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final GDPRQuestionnairePurpose DEFAULT_PURPOSE = GDPRQuestionnairePurpose.OPERATION_CONTEXT;
    private static final GDPRQuestionnairePurpose UPDATED_PURPOSE = GDPRQuestionnairePurpose.IMPACT_EVALUATION;

    @Autowired
    private GDPRQuestionnaireRepository gDPRQuestionnaireRepository;

    @Autowired
    private GDPRQuestionnaireService gDPRQuestionnaireService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restGDPRQuestionnaireMockMvc;

    private GDPRQuestionnaire gDPRQuestionnaire;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GDPRQuestionnaireResource gDPRQuestionnaireResource = new GDPRQuestionnaireResource(gDPRQuestionnaireService);
        this.restGDPRQuestionnaireMockMvc = MockMvcBuilders.standaloneSetup(gDPRQuestionnaireResource)
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
    public static GDPRQuestionnaire createEntity(EntityManager em) {
        GDPRQuestionnaire gDPRQuestionnaire = new GDPRQuestionnaire()
            .name(DEFAULT_NAME)
            .purpose(DEFAULT_PURPOSE);
        return gDPRQuestionnaire;
    }

    @Before
    public void initTest() {
        gDPRQuestionnaire = createEntity(em);
    }

    @Test
    @Transactional
    public void createGDPRQuestionnaire() throws Exception {
        int databaseSizeBeforeCreate = gDPRQuestionnaireRepository.findAll().size();

        // Create the GDPRQuestionnaire
        restGDPRQuestionnaireMockMvc.perform(post("/api/gdpr-questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaire)))
            .andExpect(status().isCreated());

        // Validate the GDPRQuestionnaire in the database
        List<GDPRQuestionnaire> gDPRQuestionnaireList = gDPRQuestionnaireRepository.findAll();
        assertThat(gDPRQuestionnaireList).hasSize(databaseSizeBeforeCreate + 1);
        GDPRQuestionnaire testGDPRQuestionnaire = gDPRQuestionnaireList.get(gDPRQuestionnaireList.size() - 1);
        assertThat(testGDPRQuestionnaire.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testGDPRQuestionnaire.getPurpose()).isEqualTo(DEFAULT_PURPOSE);
    }

    @Test
    @Transactional
    public void createGDPRQuestionnaireWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = gDPRQuestionnaireRepository.findAll().size();

        // Create the GDPRQuestionnaire with an existing ID
        gDPRQuestionnaire.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGDPRQuestionnaireMockMvc.perform(post("/api/gdpr-questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaire)))
            .andExpect(status().isBadRequest());

        // Validate the GDPRQuestionnaire in the database
        List<GDPRQuestionnaire> gDPRQuestionnaireList = gDPRQuestionnaireRepository.findAll();
        assertThat(gDPRQuestionnaireList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRQuestionnaireRepository.findAll().size();
        // set the field null
        gDPRQuestionnaire.setName(null);

        // Create the GDPRQuestionnaire, which fails.

        restGDPRQuestionnaireMockMvc.perform(post("/api/gdpr-questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaire)))
            .andExpect(status().isBadRequest());

        List<GDPRQuestionnaire> gDPRQuestionnaireList = gDPRQuestionnaireRepository.findAll();
        assertThat(gDPRQuestionnaireList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPurposeIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRQuestionnaireRepository.findAll().size();
        // set the field null
        gDPRQuestionnaire.setPurpose(null);

        // Create the GDPRQuestionnaire, which fails.

        restGDPRQuestionnaireMockMvc.perform(post("/api/gdpr-questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaire)))
            .andExpect(status().isBadRequest());

        List<GDPRQuestionnaire> gDPRQuestionnaireList = gDPRQuestionnaireRepository.findAll();
        assertThat(gDPRQuestionnaireList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllGDPRQuestionnaires() throws Exception {
        // Initialize the database
        gDPRQuestionnaireRepository.saveAndFlush(gDPRQuestionnaire);

        // Get all the gDPRQuestionnaireList
        restGDPRQuestionnaireMockMvc.perform(get("/api/gdpr-questionnaires?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gDPRQuestionnaire.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].purpose").value(hasItem(DEFAULT_PURPOSE.toString())));
    }

    @Test
    @Transactional
    public void getGDPRQuestionnaire() throws Exception {
        // Initialize the database
        gDPRQuestionnaireRepository.saveAndFlush(gDPRQuestionnaire);

        // Get the gDPRQuestionnaire
        restGDPRQuestionnaireMockMvc.perform(get("/api/gdpr-questionnaires/{id}", gDPRQuestionnaire.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(gDPRQuestionnaire.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.purpose").value(DEFAULT_PURPOSE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGDPRQuestionnaire() throws Exception {
        // Get the gDPRQuestionnaire
        restGDPRQuestionnaireMockMvc.perform(get("/api/gdpr-questionnaires/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGDPRQuestionnaire() throws Exception {
        // Initialize the database
        gDPRQuestionnaireService.save(gDPRQuestionnaire);

        int databaseSizeBeforeUpdate = gDPRQuestionnaireRepository.findAll().size();

        // Update the gDPRQuestionnaire
        GDPRQuestionnaire updatedGDPRQuestionnaire = gDPRQuestionnaireRepository.findOne(gDPRQuestionnaire.getId());
        // Disconnect from session so that the updates on updatedGDPRQuestionnaire are not directly saved in db
        em.detach(updatedGDPRQuestionnaire);
        updatedGDPRQuestionnaire
            .name(UPDATED_NAME)
            .purpose(UPDATED_PURPOSE);

        restGDPRQuestionnaireMockMvc.perform(put("/api/gdpr-questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGDPRQuestionnaire)))
            .andExpect(status().isOk());

        // Validate the GDPRQuestionnaire in the database
        List<GDPRQuestionnaire> gDPRQuestionnaireList = gDPRQuestionnaireRepository.findAll();
        assertThat(gDPRQuestionnaireList).hasSize(databaseSizeBeforeUpdate);
        GDPRQuestionnaire testGDPRQuestionnaire = gDPRQuestionnaireList.get(gDPRQuestionnaireList.size() - 1);
        assertThat(testGDPRQuestionnaire.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGDPRQuestionnaire.getPurpose()).isEqualTo(UPDATED_PURPOSE);
    }

    @Test
    @Transactional
    public void updateNonExistingGDPRQuestionnaire() throws Exception {
        int databaseSizeBeforeUpdate = gDPRQuestionnaireRepository.findAll().size();

        // Create the GDPRQuestionnaire

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restGDPRQuestionnaireMockMvc.perform(put("/api/gdpr-questionnaires")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaire)))
            .andExpect(status().isCreated());

        // Validate the GDPRQuestionnaire in the database
        List<GDPRQuestionnaire> gDPRQuestionnaireList = gDPRQuestionnaireRepository.findAll();
        assertThat(gDPRQuestionnaireList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteGDPRQuestionnaire() throws Exception {
        // Initialize the database
        gDPRQuestionnaireService.save(gDPRQuestionnaire);

        int databaseSizeBeforeDelete = gDPRQuestionnaireRepository.findAll().size();

        // Get the gDPRQuestionnaire
        restGDPRQuestionnaireMockMvc.perform(delete("/api/gdpr-questionnaires/{id}", gDPRQuestionnaire.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<GDPRQuestionnaire> gDPRQuestionnaireList = gDPRQuestionnaireRepository.findAll();
        assertThat(gDPRQuestionnaireList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GDPRQuestionnaire.class);
        GDPRQuestionnaire gDPRQuestionnaire1 = new GDPRQuestionnaire();
        gDPRQuestionnaire1.setId(1L);
        GDPRQuestionnaire gDPRQuestionnaire2 = new GDPRQuestionnaire();
        gDPRQuestionnaire2.setId(gDPRQuestionnaire1.getId());
        assertThat(gDPRQuestionnaire1).isEqualTo(gDPRQuestionnaire2);
        gDPRQuestionnaire2.setId(2L);
        assertThat(gDPRQuestionnaire1).isNotEqualTo(gDPRQuestionnaire2);
        gDPRQuestionnaire1.setId(null);
        assertThat(gDPRQuestionnaire1).isNotEqualTo(gDPRQuestionnaire2);
    }
}
