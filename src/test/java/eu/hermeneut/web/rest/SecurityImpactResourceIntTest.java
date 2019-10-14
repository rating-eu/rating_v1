package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.SecurityImpact;
import eu.hermeneut.repository.SecurityImpactRepository;
import eu.hermeneut.service.SecurityImpactService;
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

import eu.hermeneut.domain.enumeration.SecurityPillar;
import eu.hermeneut.domain.enumeration.DataImpact;
/**
 * Test class for the SecurityImpactResource REST controller.
 *
 * @see SecurityImpactResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class SecurityImpactResourceIntTest {

    private static final SecurityPillar DEFAULT_SECURITY_PILLAR = SecurityPillar.CONFIDENTIALITY;
    private static final SecurityPillar UPDATED_SECURITY_PILLAR = SecurityPillar.INTEGRITY;

    private static final DataImpact DEFAULT_IMPACT = DataImpact.LOW;
    private static final DataImpact UPDATED_IMPACT = DataImpact.MEDIUM;

    @Autowired
    private SecurityImpactRepository securityImpactRepository;

    @Autowired
    private SecurityImpactService securityImpactService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSecurityImpactMockMvc;

    private SecurityImpact securityImpact;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SecurityImpactResource securityImpactResource = new SecurityImpactResource(securityImpactService);
        this.restSecurityImpactMockMvc = MockMvcBuilders.standaloneSetup(securityImpactResource)
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
    public static SecurityImpact createEntity(EntityManager em) {
        SecurityImpact securityImpact = new SecurityImpact()
            .securityPillar(DEFAULT_SECURITY_PILLAR)
            .impact(DEFAULT_IMPACT);
        return securityImpact;
    }

    @Before
    public void initTest() {
        securityImpact = createEntity(em);
    }

    @Test
    @Transactional
    public void createSecurityImpact() throws Exception {
        int databaseSizeBeforeCreate = securityImpactRepository.findAll().size();

        // Create the SecurityImpact
        restSecurityImpactMockMvc.perform(post("/api/security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(securityImpact)))
            .andExpect(status().isCreated());

        // Validate the SecurityImpact in the database
        List<SecurityImpact> securityImpactList = securityImpactRepository.findAll();
        assertThat(securityImpactList).hasSize(databaseSizeBeforeCreate + 1);
        SecurityImpact testSecurityImpact = securityImpactList.get(securityImpactList.size() - 1);
        assertThat(testSecurityImpact.getSecurityPillar()).isEqualTo(DEFAULT_SECURITY_PILLAR);
        assertThat(testSecurityImpact.getImpact()).isEqualTo(DEFAULT_IMPACT);
    }

    @Test
    @Transactional
    public void createSecurityImpactWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = securityImpactRepository.findAll().size();

        // Create the SecurityImpact with an existing ID
        securityImpact.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSecurityImpactMockMvc.perform(post("/api/security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(securityImpact)))
            .andExpect(status().isBadRequest());

        // Validate the SecurityImpact in the database
        List<SecurityImpact> securityImpactList = securityImpactRepository.findAll();
        assertThat(securityImpactList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkSecurityPillarIsRequired() throws Exception {
        int databaseSizeBeforeTest = securityImpactRepository.findAll().size();
        // set the field null
        securityImpact.setSecurityPillar(null);

        // Create the SecurityImpact, which fails.

        restSecurityImpactMockMvc.perform(post("/api/security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(securityImpact)))
            .andExpect(status().isBadRequest());

        List<SecurityImpact> securityImpactList = securityImpactRepository.findAll();
        assertThat(securityImpactList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkImpactIsRequired() throws Exception {
        int databaseSizeBeforeTest = securityImpactRepository.findAll().size();
        // set the field null
        securityImpact.setImpact(null);

        // Create the SecurityImpact, which fails.

        restSecurityImpactMockMvc.perform(post("/api/security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(securityImpact)))
            .andExpect(status().isBadRequest());

        List<SecurityImpact> securityImpactList = securityImpactRepository.findAll();
        assertThat(securityImpactList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSecurityImpacts() throws Exception {
        // Initialize the database
        securityImpactRepository.saveAndFlush(securityImpact);

        // Get all the securityImpactList
        restSecurityImpactMockMvc.perform(get("/api/security-impacts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(securityImpact.getId().intValue())))
            .andExpect(jsonPath("$.[*].securityPillar").value(hasItem(DEFAULT_SECURITY_PILLAR.toString())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT.toString())));
    }

    @Test
    @Transactional
    public void getSecurityImpact() throws Exception {
        // Initialize the database
        securityImpactRepository.saveAndFlush(securityImpact);

        // Get the securityImpact
        restSecurityImpactMockMvc.perform(get("/api/security-impacts/{id}", securityImpact.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(securityImpact.getId().intValue()))
            .andExpect(jsonPath("$.securityPillar").value(DEFAULT_SECURITY_PILLAR.toString()))
            .andExpect(jsonPath("$.impact").value(DEFAULT_IMPACT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSecurityImpact() throws Exception {
        // Get the securityImpact
        restSecurityImpactMockMvc.perform(get("/api/security-impacts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSecurityImpact() throws Exception {
        // Initialize the database
        securityImpactService.save(securityImpact);

        int databaseSizeBeforeUpdate = securityImpactRepository.findAll().size();

        // Update the securityImpact
        SecurityImpact updatedSecurityImpact = securityImpactRepository.findOne(securityImpact.getId());
        // Disconnect from session so that the updates on updatedSecurityImpact are not directly saved in db
        em.detach(updatedSecurityImpact);
        updatedSecurityImpact
            .securityPillar(UPDATED_SECURITY_PILLAR)
            .impact(UPDATED_IMPACT);

        restSecurityImpactMockMvc.perform(put("/api/security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSecurityImpact)))
            .andExpect(status().isOk());

        // Validate the SecurityImpact in the database
        List<SecurityImpact> securityImpactList = securityImpactRepository.findAll();
        assertThat(securityImpactList).hasSize(databaseSizeBeforeUpdate);
        SecurityImpact testSecurityImpact = securityImpactList.get(securityImpactList.size() - 1);
        assertThat(testSecurityImpact.getSecurityPillar()).isEqualTo(UPDATED_SECURITY_PILLAR);
        assertThat(testSecurityImpact.getImpact()).isEqualTo(UPDATED_IMPACT);
    }

    @Test
    @Transactional
    public void updateNonExistingSecurityImpact() throws Exception {
        int databaseSizeBeforeUpdate = securityImpactRepository.findAll().size();

        // Create the SecurityImpact

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSecurityImpactMockMvc.perform(put("/api/security-impacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(securityImpact)))
            .andExpect(status().isCreated());

        // Validate the SecurityImpact in the database
        List<SecurityImpact> securityImpactList = securityImpactRepository.findAll();
        assertThat(securityImpactList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSecurityImpact() throws Exception {
        // Initialize the database
        securityImpactService.save(securityImpact);

        int databaseSizeBeforeDelete = securityImpactRepository.findAll().size();

        // Get the securityImpact
        restSecurityImpactMockMvc.perform(delete("/api/security-impacts/{id}", securityImpact.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SecurityImpact> securityImpactList = securityImpactRepository.findAll();
        assertThat(securityImpactList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SecurityImpact.class);
        SecurityImpact securityImpact1 = new SecurityImpact();
        securityImpact1.setId(1L);
        SecurityImpact securityImpact2 = new SecurityImpact();
        securityImpact2.setId(securityImpact1.getId());
        assertThat(securityImpact1).isEqualTo(securityImpact2);
        securityImpact2.setId(2L);
        assertThat(securityImpact1).isNotEqualTo(securityImpact2);
        securityImpact1.setId(null);
        assertThat(securityImpact1).isNotEqualTo(securityImpact2);
    }
}
