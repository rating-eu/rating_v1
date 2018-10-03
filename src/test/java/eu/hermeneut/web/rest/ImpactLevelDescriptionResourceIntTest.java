package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.ImpactLevelDescription;
import eu.hermeneut.repository.ImpactLevelDescriptionRepository;
import eu.hermeneut.service.ImpactLevelDescriptionService;
import eu.hermeneut.repository.search.ImpactLevelDescriptionSearchRepository;
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
 * Test class for the ImpactLevelDescriptionResource REST controller.
 *
 * @see ImpactLevelDescriptionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class ImpactLevelDescriptionResourceIntTest {

    private static final Integer DEFAULT_IMPACT = 1;
    private static final Integer UPDATED_IMPACT = 2;

    private static final String DEFAULT_PEOPLE_EFFECTS = "AAAAAAAAAA";
    private static final String UPDATED_PEOPLE_EFFECTS = "BBBBBBBBBB";

    private static final String DEFAULT_REPUTATION = "AAAAAAAAAA";
    private static final String UPDATED_REPUTATION = "BBBBBBBBBB";

    private static final String DEFAULT_SERVICE_OUTPUTS = "AAAAAAAAAA";
    private static final String UPDATED_SERVICE_OUTPUTS = "BBBBBBBBBB";

    private static final String DEFAULT_LEGAL_AND_COMPLIANCE = "AAAAAAAAAA";
    private static final String UPDATED_LEGAL_AND_COMPLIANCE = "BBBBBBBBBB";

    private static final String DEFAULT_MANAGEMENT_IMPACT = "AAAAAAAAAA";
    private static final String UPDATED_MANAGEMENT_IMPACT = "BBBBBBBBBB";

    @Autowired
    private ImpactLevelDescriptionRepository impactLevelDescriptionRepository;

    @Autowired
    private ImpactLevelDescriptionService impactLevelDescriptionService;

    @Autowired
    private ImpactLevelDescriptionSearchRepository impactLevelDescriptionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restImpactLevelDescriptionMockMvc;

    private ImpactLevelDescription impactLevelDescription;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ImpactLevelDescriptionResource impactLevelDescriptionResource = new ImpactLevelDescriptionResource(impactLevelDescriptionService);
        this.restImpactLevelDescriptionMockMvc = MockMvcBuilders.standaloneSetup(impactLevelDescriptionResource)
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
    public static ImpactLevelDescription createEntity(EntityManager em) {
        ImpactLevelDescription impactLevelDescription = new ImpactLevelDescription()
            .impact(DEFAULT_IMPACT)
            .peopleEffects(DEFAULT_PEOPLE_EFFECTS)
            .reputation(DEFAULT_REPUTATION)
            .serviceOutputs(DEFAULT_SERVICE_OUTPUTS)
            .legalAndCompliance(DEFAULT_LEGAL_AND_COMPLIANCE)
            .managementImpact(DEFAULT_MANAGEMENT_IMPACT);
        return impactLevelDescription;
    }

    @Before
    public void initTest() {
        impactLevelDescriptionSearchRepository.deleteAll();
        impactLevelDescription = createEntity(em);
    }

    @Test
    @Transactional
    public void createImpactLevelDescription() throws Exception {
        int databaseSizeBeforeCreate = impactLevelDescriptionRepository.findAll().size();

        // Create the ImpactLevelDescription
        restImpactLevelDescriptionMockMvc.perform(post("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isCreated());

        // Validate the ImpactLevelDescription in the database
        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeCreate + 1);
        ImpactLevelDescription testImpactLevelDescription = impactLevelDescriptionList.get(impactLevelDescriptionList.size() - 1);
        assertThat(testImpactLevelDescription.getImpact()).isEqualTo(DEFAULT_IMPACT);
        assertThat(testImpactLevelDescription.getPeopleEffects()).isEqualTo(DEFAULT_PEOPLE_EFFECTS);
        assertThat(testImpactLevelDescription.getReputation()).isEqualTo(DEFAULT_REPUTATION);
        assertThat(testImpactLevelDescription.getServiceOutputs()).isEqualTo(DEFAULT_SERVICE_OUTPUTS);
        assertThat(testImpactLevelDescription.getLegalAndCompliance()).isEqualTo(DEFAULT_LEGAL_AND_COMPLIANCE);
        assertThat(testImpactLevelDescription.getManagementImpact()).isEqualTo(DEFAULT_MANAGEMENT_IMPACT);

        // Validate the ImpactLevelDescription in Elasticsearch
        ImpactLevelDescription impactLevelDescriptionEs = impactLevelDescriptionSearchRepository.findOne(testImpactLevelDescription.getId());
        assertThat(impactLevelDescriptionEs).isEqualToIgnoringGivenFields(testImpactLevelDescription);
    }

    @Test
    @Transactional
    public void createImpactLevelDescriptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = impactLevelDescriptionRepository.findAll().size();

        // Create the ImpactLevelDescription with an existing ID
        impactLevelDescription.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restImpactLevelDescriptionMockMvc.perform(post("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isBadRequest());

        // Validate the ImpactLevelDescription in the database
        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkImpactIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelDescriptionRepository.findAll().size();
        // set the field null
        impactLevelDescription.setImpact(null);

        // Create the ImpactLevelDescription, which fails.

        restImpactLevelDescriptionMockMvc.perform(post("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isBadRequest());

        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPeopleEffectsIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelDescriptionRepository.findAll().size();
        // set the field null
        impactLevelDescription.setPeopleEffects(null);

        // Create the ImpactLevelDescription, which fails.

        restImpactLevelDescriptionMockMvc.perform(post("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isBadRequest());

        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkReputationIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelDescriptionRepository.findAll().size();
        // set the field null
        impactLevelDescription.setReputation(null);

        // Create the ImpactLevelDescription, which fails.

        restImpactLevelDescriptionMockMvc.perform(post("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isBadRequest());

        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkServiceOutputsIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelDescriptionRepository.findAll().size();
        // set the field null
        impactLevelDescription.setServiceOutputs(null);

        // Create the ImpactLevelDescription, which fails.

        restImpactLevelDescriptionMockMvc.perform(post("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isBadRequest());

        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLegalAndComplianceIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelDescriptionRepository.findAll().size();
        // set the field null
        impactLevelDescription.setLegalAndCompliance(null);

        // Create the ImpactLevelDescription, which fails.

        restImpactLevelDescriptionMockMvc.perform(post("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isBadRequest());

        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkManagementImpactIsRequired() throws Exception {
        int databaseSizeBeforeTest = impactLevelDescriptionRepository.findAll().size();
        // set the field null
        impactLevelDescription.setManagementImpact(null);

        // Create the ImpactLevelDescription, which fails.

        restImpactLevelDescriptionMockMvc.perform(post("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isBadRequest());

        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllImpactLevelDescriptions() throws Exception {
        // Initialize the database
        impactLevelDescriptionRepository.saveAndFlush(impactLevelDescription);

        // Get all the impactLevelDescriptionList
        restImpactLevelDescriptionMockMvc.perform(get("/api/impact-level-descriptions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(impactLevelDescription.getId().intValue())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT)))
            .andExpect(jsonPath("$.[*].peopleEffects").value(hasItem(DEFAULT_PEOPLE_EFFECTS.toString())))
            .andExpect(jsonPath("$.[*].reputation").value(hasItem(DEFAULT_REPUTATION.toString())))
            .andExpect(jsonPath("$.[*].serviceOutputs").value(hasItem(DEFAULT_SERVICE_OUTPUTS.toString())))
            .andExpect(jsonPath("$.[*].legalAndCompliance").value(hasItem(DEFAULT_LEGAL_AND_COMPLIANCE.toString())))
            .andExpect(jsonPath("$.[*].managementImpact").value(hasItem(DEFAULT_MANAGEMENT_IMPACT.toString())));
    }

    @Test
    @Transactional
    public void getImpactLevelDescription() throws Exception {
        // Initialize the database
        impactLevelDescriptionRepository.saveAndFlush(impactLevelDescription);

        // Get the impactLevelDescription
        restImpactLevelDescriptionMockMvc.perform(get("/api/impact-level-descriptions/{id}", impactLevelDescription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(impactLevelDescription.getId().intValue()))
            .andExpect(jsonPath("$.impact").value(DEFAULT_IMPACT))
            .andExpect(jsonPath("$.peopleEffects").value(DEFAULT_PEOPLE_EFFECTS.toString()))
            .andExpect(jsonPath("$.reputation").value(DEFAULT_REPUTATION.toString()))
            .andExpect(jsonPath("$.serviceOutputs").value(DEFAULT_SERVICE_OUTPUTS.toString()))
            .andExpect(jsonPath("$.legalAndCompliance").value(DEFAULT_LEGAL_AND_COMPLIANCE.toString()))
            .andExpect(jsonPath("$.managementImpact").value(DEFAULT_MANAGEMENT_IMPACT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingImpactLevelDescription() throws Exception {
        // Get the impactLevelDescription
        restImpactLevelDescriptionMockMvc.perform(get("/api/impact-level-descriptions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateImpactLevelDescription() throws Exception {
        // Initialize the database
        impactLevelDescriptionService.save(impactLevelDescription);

        int databaseSizeBeforeUpdate = impactLevelDescriptionRepository.findAll().size();

        // Update the impactLevelDescription
        ImpactLevelDescription updatedImpactLevelDescription = impactLevelDescriptionRepository.findOne(impactLevelDescription.getId());
        // Disconnect from session so that the updates on updatedImpactLevelDescription are not directly saved in db
        em.detach(updatedImpactLevelDescription);
        updatedImpactLevelDescription
            .impact(UPDATED_IMPACT)
            .peopleEffects(UPDATED_PEOPLE_EFFECTS)
            .reputation(UPDATED_REPUTATION)
            .serviceOutputs(UPDATED_SERVICE_OUTPUTS)
            .legalAndCompliance(UPDATED_LEGAL_AND_COMPLIANCE)
            .managementImpact(UPDATED_MANAGEMENT_IMPACT);

        restImpactLevelDescriptionMockMvc.perform(put("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedImpactLevelDescription)))
            .andExpect(status().isOk());

        // Validate the ImpactLevelDescription in the database
        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeUpdate);
        ImpactLevelDescription testImpactLevelDescription = impactLevelDescriptionList.get(impactLevelDescriptionList.size() - 1);
        assertThat(testImpactLevelDescription.getImpact()).isEqualTo(UPDATED_IMPACT);
        assertThat(testImpactLevelDescription.getPeopleEffects()).isEqualTo(UPDATED_PEOPLE_EFFECTS);
        assertThat(testImpactLevelDescription.getReputation()).isEqualTo(UPDATED_REPUTATION);
        assertThat(testImpactLevelDescription.getServiceOutputs()).isEqualTo(UPDATED_SERVICE_OUTPUTS);
        assertThat(testImpactLevelDescription.getLegalAndCompliance()).isEqualTo(UPDATED_LEGAL_AND_COMPLIANCE);
        assertThat(testImpactLevelDescription.getManagementImpact()).isEqualTo(UPDATED_MANAGEMENT_IMPACT);

        // Validate the ImpactLevelDescription in Elasticsearch
        ImpactLevelDescription impactLevelDescriptionEs = impactLevelDescriptionSearchRepository.findOne(testImpactLevelDescription.getId());
        assertThat(impactLevelDescriptionEs).isEqualToIgnoringGivenFields(testImpactLevelDescription);
    }

    @Test
    @Transactional
    public void updateNonExistingImpactLevelDescription() throws Exception {
        int databaseSizeBeforeUpdate = impactLevelDescriptionRepository.findAll().size();

        // Create the ImpactLevelDescription

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restImpactLevelDescriptionMockMvc.perform(put("/api/impact-level-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(impactLevelDescription)))
            .andExpect(status().isCreated());

        // Validate the ImpactLevelDescription in the database
        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteImpactLevelDescription() throws Exception {
        // Initialize the database
        impactLevelDescriptionService.save(impactLevelDescription);

        int databaseSizeBeforeDelete = impactLevelDescriptionRepository.findAll().size();

        // Get the impactLevelDescription
        restImpactLevelDescriptionMockMvc.perform(delete("/api/impact-level-descriptions/{id}", impactLevelDescription.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean impactLevelDescriptionExistsInEs = impactLevelDescriptionSearchRepository.exists(impactLevelDescription.getId());
        assertThat(impactLevelDescriptionExistsInEs).isFalse();

        // Validate the database is empty
        List<ImpactLevelDescription> impactLevelDescriptionList = impactLevelDescriptionRepository.findAll();
        assertThat(impactLevelDescriptionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchImpactLevelDescription() throws Exception {
        // Initialize the database
        impactLevelDescriptionService.save(impactLevelDescription);

        // Search the impactLevelDescription
        restImpactLevelDescriptionMockMvc.perform(get("/api/_search/impact-level-descriptions?query=id:" + impactLevelDescription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(impactLevelDescription.getId().intValue())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT)))
            .andExpect(jsonPath("$.[*].peopleEffects").value(hasItem(DEFAULT_PEOPLE_EFFECTS.toString())))
            .andExpect(jsonPath("$.[*].reputation").value(hasItem(DEFAULT_REPUTATION.toString())))
            .andExpect(jsonPath("$.[*].serviceOutputs").value(hasItem(DEFAULT_SERVICE_OUTPUTS.toString())))
            .andExpect(jsonPath("$.[*].legalAndCompliance").value(hasItem(DEFAULT_LEGAL_AND_COMPLIANCE.toString())))
            .andExpect(jsonPath("$.[*].managementImpact").value(hasItem(DEFAULT_MANAGEMENT_IMPACT.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ImpactLevelDescription.class);
        ImpactLevelDescription impactLevelDescription1 = new ImpactLevelDescription();
        impactLevelDescription1.setId(1L);
        ImpactLevelDescription impactLevelDescription2 = new ImpactLevelDescription();
        impactLevelDescription2.setId(impactLevelDescription1.getId());
        assertThat(impactLevelDescription1).isEqualTo(impactLevelDescription2);
        impactLevelDescription2.setId(2L);
        assertThat(impactLevelDescription1).isNotEqualTo(impactLevelDescription2);
        impactLevelDescription1.setId(null);
        assertThat(impactLevelDescription1).isNotEqualTo(impactLevelDescription2);
    }
}
