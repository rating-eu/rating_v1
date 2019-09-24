package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.OverallSecurityImpact;
import eu.hermeneut.repository.OverallSecurityImpactRepository;
import eu.hermeneut.service.OverallSecurityImpactService;
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

import eu.hermeneut.domain.enumeration.DataImpact;
/**
 * Test class for the OverallSecurityImpactResource REST controller.
 *
 * @see OverallSecurityImpactResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class OverallSecurityImpactResourceIntTest {

    private static final DataImpact DEFAULT_IMPACT = DataImpact.LOW;
    private static final DataImpact UPDATED_IMPACT = DataImpact.MEDIUM;

    @Autowired
    private OverallSecurityImpactRepository overallSecurityImpactRepository;

    @Autowired
    private OverallSecurityImpactService overallSecurityImpactService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restOverallSecurityImpactMockMvc;

    private OverallSecurityImpact overallSecurityImpact;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OverallSecurityImpactResource overallSecurityImpactResource = new OverallSecurityImpactResource(overallSecurityImpactService);
        this.restOverallSecurityImpactMockMvc = MockMvcBuilders.standaloneSetup(overallSecurityImpactResource)
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
    public static OverallSecurityImpact createEntity(EntityManager em) {
        OverallSecurityImpact overallSecurityImpact = new OverallSecurityImpact()
            .impact(DEFAULT_IMPACT);
        return overallSecurityImpact;
    }

    @Before
    public void initTest() {
        overallSecurityImpact = createEntity(em);
    }

    @Test
    @Transactional
    public void createOverallSecurityImpact() throws Exception {
        int databaseSizeBeforeCreate = overallSecurityImpactRepository.findAll().size();

        // Create the OverallSecurityImpact
        restOverallSecurityImpactMockMvc.perform(post("/api/overall-security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallSecurityImpact)))
            .andExpect(status().isCreated());

        // Validate the OverallSecurityImpact in the database
        List<OverallSecurityImpact> overallSecurityImpactList = overallSecurityImpactRepository.findAll();
        assertThat(overallSecurityImpactList).hasSize(databaseSizeBeforeCreate + 1);
        OverallSecurityImpact testOverallSecurityImpact = overallSecurityImpactList.get(overallSecurityImpactList.size() - 1);
        assertThat(testOverallSecurityImpact.getImpact()).isEqualTo(DEFAULT_IMPACT);
    }

    @Test
    @Transactional
    public void createOverallSecurityImpactWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = overallSecurityImpactRepository.findAll().size();

        // Create the OverallSecurityImpact with an existing ID
        overallSecurityImpact.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOverallSecurityImpactMockMvc.perform(post("/api/overall-security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallSecurityImpact)))
            .andExpect(status().isBadRequest());

        // Validate the OverallSecurityImpact in the database
        List<OverallSecurityImpact> overallSecurityImpactList = overallSecurityImpactRepository.findAll();
        assertThat(overallSecurityImpactList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkImpactIsRequired() throws Exception {
        int databaseSizeBeforeTest = overallSecurityImpactRepository.findAll().size();
        // set the field null
        overallSecurityImpact.setImpact(null);

        // Create the OverallSecurityImpact, which fails.

        restOverallSecurityImpactMockMvc.perform(post("/api/overall-security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallSecurityImpact)))
            .andExpect(status().isBadRequest());

        List<OverallSecurityImpact> overallSecurityImpactList = overallSecurityImpactRepository.findAll();
        assertThat(overallSecurityImpactList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOverallSecurityImpacts() throws Exception {
        // Initialize the database
        overallSecurityImpactRepository.saveAndFlush(overallSecurityImpact);

        // Get all the overallSecurityImpactList
        restOverallSecurityImpactMockMvc.perform(get("/api/overall-security-impacts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(overallSecurityImpact.getId().intValue())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT.toString())));
    }

    @Test
    @Transactional
    public void getOverallSecurityImpact() throws Exception {
        // Initialize the database
        overallSecurityImpactRepository.saveAndFlush(overallSecurityImpact);

        // Get the overallSecurityImpact
        restOverallSecurityImpactMockMvc.perform(get("/api/overall-security-impacts/{id}", overallSecurityImpact.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(overallSecurityImpact.getId().intValue()))
            .andExpect(jsonPath("$.impact").value(DEFAULT_IMPACT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOverallSecurityImpact() throws Exception {
        // Get the overallSecurityImpact
        restOverallSecurityImpactMockMvc.perform(get("/api/overall-security-impacts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOverallSecurityImpact() throws Exception {
        // Initialize the database
        overallSecurityImpactService.save(overallSecurityImpact);

        int databaseSizeBeforeUpdate = overallSecurityImpactRepository.findAll().size();

        // Update the overallSecurityImpact
        OverallSecurityImpact updatedOverallSecurityImpact = overallSecurityImpactRepository.findOne(overallSecurityImpact.getId());
        // Disconnect from session so that the updates on updatedOverallSecurityImpact are not directly saved in db
        em.detach(updatedOverallSecurityImpact);
        updatedOverallSecurityImpact
            .impact(UPDATED_IMPACT);

        restOverallSecurityImpactMockMvc.perform(put("/api/overall-security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOverallSecurityImpact)))
            .andExpect(status().isOk());

        // Validate the OverallSecurityImpact in the database
        List<OverallSecurityImpact> overallSecurityImpactList = overallSecurityImpactRepository.findAll();
        assertThat(overallSecurityImpactList).hasSize(databaseSizeBeforeUpdate);
        OverallSecurityImpact testOverallSecurityImpact = overallSecurityImpactList.get(overallSecurityImpactList.size() - 1);
        assertThat(testOverallSecurityImpact.getImpact()).isEqualTo(UPDATED_IMPACT);
    }

    @Test
    @Transactional
    public void updateNonExistingOverallSecurityImpact() throws Exception {
        int databaseSizeBeforeUpdate = overallSecurityImpactRepository.findAll().size();

        // Create the OverallSecurityImpact

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restOverallSecurityImpactMockMvc.perform(put("/api/overall-security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(overallSecurityImpact)))
            .andExpect(status().isCreated());

        // Validate the OverallSecurityImpact in the database
        List<OverallSecurityImpact> overallSecurityImpactList = overallSecurityImpactRepository.findAll();
        assertThat(overallSecurityImpactList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteOverallSecurityImpact() throws Exception {
        // Initialize the database
        overallSecurityImpactService.save(overallSecurityImpact);

        int databaseSizeBeforeDelete = overallSecurityImpactRepository.findAll().size();

        // Get the overallSecurityImpact
        restOverallSecurityImpactMockMvc.perform(delete("/api/overall-security-impacts/{id}", overallSecurityImpact.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<OverallSecurityImpact> overallSecurityImpactList = overallSecurityImpactRepository.findAll();
        assertThat(overallSecurityImpactList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OverallSecurityImpact.class);
        OverallSecurityImpact overallSecurityImpact1 = new OverallSecurityImpact();
        overallSecurityImpact1.setId(1L);
        OverallSecurityImpact overallSecurityImpact2 = new OverallSecurityImpact();
        overallSecurityImpact2.setId(overallSecurityImpact1.getId());
        assertThat(overallSecurityImpact1).isEqualTo(overallSecurityImpact2);
        overallSecurityImpact2.setId(2L);
        assertThat(overallSecurityImpact1).isNotEqualTo(overallSecurityImpact2);
        overallSecurityImpact1.setId(null);
        assertThat(overallSecurityImpact1).isNotEqualTo(overallSecurityImpact2);
    }
}
