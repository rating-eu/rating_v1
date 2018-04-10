package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.repository.CompanyProfileRepository;
import eu.hermeneut.service.CompanyProfileService;
import eu.hermeneut.repository.search.CompanyProfileSearchRepository;
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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static eu.hermeneut.web.rest.TestUtil.sameInstant;
import static eu.hermeneut.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import eu.hermeneut.domain.enumeration.CompType;
/**
 * Test class for the CompanyProfileResource REST controller.
 *
 * @see CompanyProfileResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class CompanyProfileResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final CompType DEFAULT_TYPE = CompType.INFORMATION;
    private static final CompType UPDATED_TYPE = CompType.HEALTHCARE;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private CompanyProfileSearchRepository companyProfileSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCompanyProfileMockMvc;

    private CompanyProfile companyProfile;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CompanyProfileResource companyProfileResource = new CompanyProfileResource(companyProfileService);
        this.restCompanyProfileMockMvc = MockMvcBuilders.standaloneSetup(companyProfileResource)
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
    public static CompanyProfile createEntity(EntityManager em) {
        CompanyProfile companyProfile = new CompanyProfile()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED)
            .type(DEFAULT_TYPE);
        return companyProfile;
    }

    @Before
    public void initTest() {
        companyProfileSearchRepository.deleteAll();
        companyProfile = createEntity(em);
    }

    @Test
    @Transactional
    public void createCompanyProfile() throws Exception {
        int databaseSizeBeforeCreate = companyProfileRepository.findAll().size();

        // Create the CompanyProfile
        restCompanyProfileMockMvc.perform(post("/api/company-profiles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companyProfile)))
            .andExpect(status().isCreated());

        // Validate the CompanyProfile in the database
        List<CompanyProfile> companyProfileList = companyProfileRepository.findAll();
        assertThat(companyProfileList).hasSize(databaseSizeBeforeCreate + 1);
        CompanyProfile testCompanyProfile = companyProfileList.get(companyProfileList.size() - 1);
        assertThat(testCompanyProfile.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCompanyProfile.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCompanyProfile.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testCompanyProfile.getModified()).isEqualTo(DEFAULT_MODIFIED);
        assertThat(testCompanyProfile.getType()).isEqualTo(DEFAULT_TYPE);

        // Validate the CompanyProfile in Elasticsearch
        CompanyProfile companyProfileEs = companyProfileSearchRepository.findOne(testCompanyProfile.getId());
        assertThat(testCompanyProfile.getCreated()).isEqualTo(testCompanyProfile.getCreated());
        assertThat(testCompanyProfile.getModified()).isEqualTo(testCompanyProfile.getModified());
        assertThat(companyProfileEs).isEqualToIgnoringGivenFields(testCompanyProfile, "created", "modified");
    }

    @Test
    @Transactional
    public void createCompanyProfileWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = companyProfileRepository.findAll().size();

        // Create the CompanyProfile with an existing ID
        companyProfile.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompanyProfileMockMvc.perform(post("/api/company-profiles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companyProfile)))
            .andExpect(status().isBadRequest());

        // Validate the CompanyProfile in the database
        List<CompanyProfile> companyProfileList = companyProfileRepository.findAll();
        assertThat(companyProfileList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyProfileRepository.findAll().size();
        // set the field null
        companyProfile.setName(null);

        // Create the CompanyProfile, which fails.

        restCompanyProfileMockMvc.perform(post("/api/company-profiles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companyProfile)))
            .andExpect(status().isBadRequest());

        List<CompanyProfile> companyProfileList = companyProfileRepository.findAll();
        assertThat(companyProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCompanyProfiles() throws Exception {
        // Initialize the database
        companyProfileRepository.saveAndFlush(companyProfile);

        // Get all the companyProfileList
        restCompanyProfileMockMvc.perform(get("/api/company-profiles?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companyProfile.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void getCompanyProfile() throws Exception {
        // Initialize the database
        companyProfileRepository.saveAndFlush(companyProfile);

        // Get the companyProfile
        restCompanyProfileMockMvc.perform(get("/api/company-profiles/{id}", companyProfile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(companyProfile.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCompanyProfile() throws Exception {
        // Get the companyProfile
        restCompanyProfileMockMvc.perform(get("/api/company-profiles/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCompanyProfile() throws Exception {
        // Initialize the database
        companyProfileService.save(companyProfile);

        int databaseSizeBeforeUpdate = companyProfileRepository.findAll().size();

        // Update the companyProfile
        CompanyProfile updatedCompanyProfile = companyProfileRepository.findOne(companyProfile.getId());
        // Disconnect from session so that the updates on updatedCompanyProfile are not directly saved in db
        em.detach(updatedCompanyProfile);
        updatedCompanyProfile
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .type(UPDATED_TYPE);

        restCompanyProfileMockMvc.perform(put("/api/company-profiles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCompanyProfile)))
            .andExpect(status().isOk());

        // Validate the CompanyProfile in the database
        List<CompanyProfile> companyProfileList = companyProfileRepository.findAll();
        assertThat(companyProfileList).hasSize(databaseSizeBeforeUpdate);
        CompanyProfile testCompanyProfile = companyProfileList.get(companyProfileList.size() - 1);
        assertThat(testCompanyProfile.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCompanyProfile.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCompanyProfile.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testCompanyProfile.getModified()).isEqualTo(UPDATED_MODIFIED);
        assertThat(testCompanyProfile.getType()).isEqualTo(UPDATED_TYPE);

        // Validate the CompanyProfile in Elasticsearch
        CompanyProfile companyProfileEs = companyProfileSearchRepository.findOne(testCompanyProfile.getId());
        assertThat(testCompanyProfile.getCreated()).isEqualTo(testCompanyProfile.getCreated());
        assertThat(testCompanyProfile.getModified()).isEqualTo(testCompanyProfile.getModified());
        assertThat(companyProfileEs).isEqualToIgnoringGivenFields(testCompanyProfile, "created", "modified");
    }

    @Test
    @Transactional
    public void updateNonExistingCompanyProfile() throws Exception {
        int databaseSizeBeforeUpdate = companyProfileRepository.findAll().size();

        // Create the CompanyProfile

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCompanyProfileMockMvc.perform(put("/api/company-profiles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companyProfile)))
            .andExpect(status().isCreated());

        // Validate the CompanyProfile in the database
        List<CompanyProfile> companyProfileList = companyProfileRepository.findAll();
        assertThat(companyProfileList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCompanyProfile() throws Exception {
        // Initialize the database
        companyProfileService.save(companyProfile);

        int databaseSizeBeforeDelete = companyProfileRepository.findAll().size();

        // Get the companyProfile
        restCompanyProfileMockMvc.perform(delete("/api/company-profiles/{id}", companyProfile.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean companyProfileExistsInEs = companyProfileSearchRepository.exists(companyProfile.getId());
        assertThat(companyProfileExistsInEs).isFalse();

        // Validate the database is empty
        List<CompanyProfile> companyProfileList = companyProfileRepository.findAll();
        assertThat(companyProfileList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCompanyProfile() throws Exception {
        // Initialize the database
        companyProfileService.save(companyProfile);

        // Search the companyProfile
        restCompanyProfileMockMvc.perform(get("/api/_search/company-profiles?query=id:" + companyProfile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companyProfile.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompanyProfile.class);
        CompanyProfile companyProfile1 = new CompanyProfile();
        companyProfile1.setId(1L);
        CompanyProfile companyProfile2 = new CompanyProfile();
        companyProfile2.setId(companyProfile1.getId());
        assertThat(companyProfile1).isEqualTo(companyProfile2);
        companyProfile2.setId(2L);
        assertThat(companyProfile1).isNotEqualTo(companyProfile2);
        companyProfile1.setId(null);
        assertThat(companyProfile1).isNotEqualTo(companyProfile2);
    }
}
