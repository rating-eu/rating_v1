package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.GDPRQuestionnaireStatus;
import eu.hermeneut.repository.GDPRQuestionnaireStatusRepository;
import eu.hermeneut.service.GDPRQuestionnaireStatusService;
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

import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.domain.enumeration.Role;
/**
 * Test class for the GDPRQuestionnaireStatusResource REST controller.
 *
 * @see GDPRQuestionnaireStatusResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class GDPRQuestionnaireStatusResourceIntTest {

    private static final Status DEFAULT_STATUS = Status.EMPTY;
    private static final Status UPDATED_STATUS = Status.PENDING;

    private static final Role DEFAULT_ROLE = Role.ROLE_ADMIN;
    private static final Role UPDATED_ROLE = Role.ROLE_USER;

    @Autowired
    private GDPRQuestionnaireStatusRepository gDPRQuestionnaireStatusRepository;

    @Autowired
    private GDPRQuestionnaireStatusService gDPRQuestionnaireStatusService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restGDPRQuestionnaireStatusMockMvc;

    private GDPRQuestionnaireStatus gDPRQuestionnaireStatus;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GDPRQuestionnaireStatusResource gDPRQuestionnaireStatusResource = new GDPRQuestionnaireStatusResource(gDPRQuestionnaireStatusService);
        this.restGDPRQuestionnaireStatusMockMvc = MockMvcBuilders.standaloneSetup(gDPRQuestionnaireStatusResource)
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
    public static GDPRQuestionnaireStatus createEntity(EntityManager em) {
        GDPRQuestionnaireStatus gDPRQuestionnaireStatus = new GDPRQuestionnaireStatus()
            .status(DEFAULT_STATUS)
            .role(DEFAULT_ROLE);
        return gDPRQuestionnaireStatus;
    }

    @Before
    public void initTest() {
        gDPRQuestionnaireStatus = createEntity(em);
    }

    @Test
    @Transactional
    public void createGDPRQuestionnaireStatus() throws Exception {
        int databaseSizeBeforeCreate = gDPRQuestionnaireStatusRepository.findAll().size();

        // Create the GDPRQuestionnaireStatus
        restGDPRQuestionnaireStatusMockMvc.perform(post("/api/gdpr-questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaireStatus)))
            .andExpect(status().isCreated());

        // Validate the GDPRQuestionnaireStatus in the database
        List<GDPRQuestionnaireStatus> gDPRQuestionnaireStatusList = gDPRQuestionnaireStatusRepository.findAll();
        assertThat(gDPRQuestionnaireStatusList).hasSize(databaseSizeBeforeCreate + 1);
        GDPRQuestionnaireStatus testGDPRQuestionnaireStatus = gDPRQuestionnaireStatusList.get(gDPRQuestionnaireStatusList.size() - 1);
        assertThat(testGDPRQuestionnaireStatus.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testGDPRQuestionnaireStatus.getRole()).isEqualTo(DEFAULT_ROLE);
    }

    @Test
    @Transactional
    public void createGDPRQuestionnaireStatusWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = gDPRQuestionnaireStatusRepository.findAll().size();

        // Create the GDPRQuestionnaireStatus with an existing ID
        gDPRQuestionnaireStatus.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGDPRQuestionnaireStatusMockMvc.perform(post("/api/gdpr-questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaireStatus)))
            .andExpect(status().isBadRequest());

        // Validate the GDPRQuestionnaireStatus in the database
        List<GDPRQuestionnaireStatus> gDPRQuestionnaireStatusList = gDPRQuestionnaireStatusRepository.findAll();
        assertThat(gDPRQuestionnaireStatusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRQuestionnaireStatusRepository.findAll().size();
        // set the field null
        gDPRQuestionnaireStatus.setStatus(null);

        // Create the GDPRQuestionnaireStatus, which fails.

        restGDPRQuestionnaireStatusMockMvc.perform(post("/api/gdpr-questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaireStatus)))
            .andExpect(status().isBadRequest());

        List<GDPRQuestionnaireStatus> gDPRQuestionnaireStatusList = gDPRQuestionnaireStatusRepository.findAll();
        assertThat(gDPRQuestionnaireStatusList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRoleIsRequired() throws Exception {
        int databaseSizeBeforeTest = gDPRQuestionnaireStatusRepository.findAll().size();
        // set the field null
        gDPRQuestionnaireStatus.setRole(null);

        // Create the GDPRQuestionnaireStatus, which fails.

        restGDPRQuestionnaireStatusMockMvc.perform(post("/api/gdpr-questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaireStatus)))
            .andExpect(status().isBadRequest());

        List<GDPRQuestionnaireStatus> gDPRQuestionnaireStatusList = gDPRQuestionnaireStatusRepository.findAll();
        assertThat(gDPRQuestionnaireStatusList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllGDPRQuestionnaireStatuses() throws Exception {
        // Initialize the database
        gDPRQuestionnaireStatusRepository.saveAndFlush(gDPRQuestionnaireStatus);

        // Get all the gDPRQuestionnaireStatusList
        restGDPRQuestionnaireStatusMockMvc.perform(get("/api/gdpr-questionnaire-statuses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gDPRQuestionnaireStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE.toString())));
    }

    @Test
    @Transactional
    public void getGDPRQuestionnaireStatus() throws Exception {
        // Initialize the database
        gDPRQuestionnaireStatusRepository.saveAndFlush(gDPRQuestionnaireStatus);

        // Get the gDPRQuestionnaireStatus
        restGDPRQuestionnaireStatusMockMvc.perform(get("/api/gdpr-questionnaire-statuses/{id}", gDPRQuestionnaireStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(gDPRQuestionnaireStatus.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.role").value(DEFAULT_ROLE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGDPRQuestionnaireStatus() throws Exception {
        // Get the gDPRQuestionnaireStatus
        restGDPRQuestionnaireStatusMockMvc.perform(get("/api/gdpr-questionnaire-statuses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGDPRQuestionnaireStatus() throws Exception {
        // Initialize the database
        gDPRQuestionnaireStatusService.save(gDPRQuestionnaireStatus);

        int databaseSizeBeforeUpdate = gDPRQuestionnaireStatusRepository.findAll().size();

        // Update the gDPRQuestionnaireStatus
        GDPRQuestionnaireStatus updatedGDPRQuestionnaireStatus = gDPRQuestionnaireStatusRepository.findOne(gDPRQuestionnaireStatus.getId());
        // Disconnect from session so that the updates on updatedGDPRQuestionnaireStatus are not directly saved in db
        em.detach(updatedGDPRQuestionnaireStatus);
        updatedGDPRQuestionnaireStatus
            .status(UPDATED_STATUS)
            .role(UPDATED_ROLE);

        restGDPRQuestionnaireStatusMockMvc.perform(put("/api/gdpr-questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGDPRQuestionnaireStatus)))
            .andExpect(status().isOk());

        // Validate the GDPRQuestionnaireStatus in the database
        List<GDPRQuestionnaireStatus> gDPRQuestionnaireStatusList = gDPRQuestionnaireStatusRepository.findAll();
        assertThat(gDPRQuestionnaireStatusList).hasSize(databaseSizeBeforeUpdate);
        GDPRQuestionnaireStatus testGDPRQuestionnaireStatus = gDPRQuestionnaireStatusList.get(gDPRQuestionnaireStatusList.size() - 1);
        assertThat(testGDPRQuestionnaireStatus.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testGDPRQuestionnaireStatus.getRole()).isEqualTo(UPDATED_ROLE);
    }

    @Test
    @Transactional
    public void updateNonExistingGDPRQuestionnaireStatus() throws Exception {
        int databaseSizeBeforeUpdate = gDPRQuestionnaireStatusRepository.findAll().size();

        // Create the GDPRQuestionnaireStatus

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restGDPRQuestionnaireStatusMockMvc.perform(put("/api/gdpr-questionnaire-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gDPRQuestionnaireStatus)))
            .andExpect(status().isCreated());

        // Validate the GDPRQuestionnaireStatus in the database
        List<GDPRQuestionnaireStatus> gDPRQuestionnaireStatusList = gDPRQuestionnaireStatusRepository.findAll();
        assertThat(gDPRQuestionnaireStatusList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteGDPRQuestionnaireStatus() throws Exception {
        // Initialize the database
        gDPRQuestionnaireStatusService.save(gDPRQuestionnaireStatus);

        int databaseSizeBeforeDelete = gDPRQuestionnaireStatusRepository.findAll().size();

        // Get the gDPRQuestionnaireStatus
        restGDPRQuestionnaireStatusMockMvc.perform(delete("/api/gdpr-questionnaire-statuses/{id}", gDPRQuestionnaireStatus.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<GDPRQuestionnaireStatus> gDPRQuestionnaireStatusList = gDPRQuestionnaireStatusRepository.findAll();
        assertThat(gDPRQuestionnaireStatusList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GDPRQuestionnaireStatus.class);
        GDPRQuestionnaireStatus gDPRQuestionnaireStatus1 = new GDPRQuestionnaireStatus();
        gDPRQuestionnaireStatus1.setId(1L);
        GDPRQuestionnaireStatus gDPRQuestionnaireStatus2 = new GDPRQuestionnaireStatus();
        gDPRQuestionnaireStatus2.setId(gDPRQuestionnaireStatus1.getId());
        assertThat(gDPRQuestionnaireStatus1).isEqualTo(gDPRQuestionnaireStatus2);
        gDPRQuestionnaireStatus2.setId(2L);
        assertThat(gDPRQuestionnaireStatus1).isNotEqualTo(gDPRQuestionnaireStatus2);
        gDPRQuestionnaireStatus1.setId(null);
        assertThat(gDPRQuestionnaireStatus1).isNotEqualTo(gDPRQuestionnaireStatus2);
    }
}
