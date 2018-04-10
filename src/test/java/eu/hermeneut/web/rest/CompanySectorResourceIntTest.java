package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.CompanySector;
import eu.hermeneut.repository.CompanySectorRepository;
import eu.hermeneut.service.CompanySectorService;
import eu.hermeneut.repository.search.CompanySectorSearchRepository;
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

/**
 * Test class for the CompanySectorResource REST controller.
 *
 * @see CompanySectorResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class CompanySectorResourceIntTest {

    private static final String DEFAULT_DEPARTMENT = "AAAAAAAAAA";
    private static final String UPDATED_DEPARTMENT = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private CompanySectorRepository companySectorRepository;

    @Autowired
    private CompanySectorService companySectorService;

    @Autowired
    private CompanySectorSearchRepository companySectorSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCompanySectorMockMvc;

    private CompanySector companySector;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CompanySectorResource companySectorResource = new CompanySectorResource(companySectorService);
        this.restCompanySectorMockMvc = MockMvcBuilders.standaloneSetup(companySectorResource)
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
    public static CompanySector createEntity(EntityManager em) {
        CompanySector companySector = new CompanySector()
            .department(DEFAULT_DEPARTMENT)
            .description(DEFAULT_DESCRIPTION)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED);
        return companySector;
    }

    @Before
    public void initTest() {
        companySectorSearchRepository.deleteAll();
        companySector = createEntity(em);
    }

    @Test
    @Transactional
    public void createCompanySector() throws Exception {
        int databaseSizeBeforeCreate = companySectorRepository.findAll().size();

        // Create the CompanySector
        restCompanySectorMockMvc.perform(post("/api/company-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companySector)))
            .andExpect(status().isCreated());

        // Validate the CompanySector in the database
        List<CompanySector> companySectorList = companySectorRepository.findAll();
        assertThat(companySectorList).hasSize(databaseSizeBeforeCreate + 1);
        CompanySector testCompanySector = companySectorList.get(companySectorList.size() - 1);
        assertThat(testCompanySector.getDepartment()).isEqualTo(DEFAULT_DEPARTMENT);
        assertThat(testCompanySector.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCompanySector.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testCompanySector.getModified()).isEqualTo(DEFAULT_MODIFIED);

        // Validate the CompanySector in Elasticsearch
        CompanySector companySectorEs = companySectorSearchRepository.findOne(testCompanySector.getId());
        assertThat(testCompanySector.getCreated()).isEqualTo(testCompanySector.getCreated());
        assertThat(testCompanySector.getModified()).isEqualTo(testCompanySector.getModified());
        assertThat(companySectorEs).isEqualToIgnoringGivenFields(testCompanySector, "created", "modified");
    }

    @Test
    @Transactional
    public void createCompanySectorWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = companySectorRepository.findAll().size();

        // Create the CompanySector with an existing ID
        companySector.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompanySectorMockMvc.perform(post("/api/company-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companySector)))
            .andExpect(status().isBadRequest());

        // Validate the CompanySector in the database
        List<CompanySector> companySectorList = companySectorRepository.findAll();
        assertThat(companySectorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDepartmentIsRequired() throws Exception {
        int databaseSizeBeforeTest = companySectorRepository.findAll().size();
        // set the field null
        companySector.setDepartment(null);

        // Create the CompanySector, which fails.

        restCompanySectorMockMvc.perform(post("/api/company-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companySector)))
            .andExpect(status().isBadRequest());

        List<CompanySector> companySectorList = companySectorRepository.findAll();
        assertThat(companySectorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCompanySectors() throws Exception {
        // Initialize the database
        companySectorRepository.saveAndFlush(companySector);

        // Get all the companySectorList
        restCompanySectorMockMvc.perform(get("/api/company-sectors?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companySector.getId().intValue())))
            .andExpect(jsonPath("$.[*].department").value(hasItem(DEFAULT_DEPARTMENT.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void getCompanySector() throws Exception {
        // Initialize the database
        companySectorRepository.saveAndFlush(companySector);

        // Get the companySector
        restCompanySectorMockMvc.perform(get("/api/company-sectors/{id}", companySector.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(companySector.getId().intValue()))
            .andExpect(jsonPath("$.department").value(DEFAULT_DEPARTMENT.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    @Transactional
    public void getNonExistingCompanySector() throws Exception {
        // Get the companySector
        restCompanySectorMockMvc.perform(get("/api/company-sectors/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCompanySector() throws Exception {
        // Initialize the database
        companySectorService.save(companySector);

        int databaseSizeBeforeUpdate = companySectorRepository.findAll().size();

        // Update the companySector
        CompanySector updatedCompanySector = companySectorRepository.findOne(companySector.getId());
        // Disconnect from session so that the updates on updatedCompanySector are not directly saved in db
        em.detach(updatedCompanySector);
        updatedCompanySector
            .department(UPDATED_DEPARTMENT)
            .description(UPDATED_DESCRIPTION)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED);

        restCompanySectorMockMvc.perform(put("/api/company-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCompanySector)))
            .andExpect(status().isOk());

        // Validate the CompanySector in the database
        List<CompanySector> companySectorList = companySectorRepository.findAll();
        assertThat(companySectorList).hasSize(databaseSizeBeforeUpdate);
        CompanySector testCompanySector = companySectorList.get(companySectorList.size() - 1);
        assertThat(testCompanySector.getDepartment()).isEqualTo(UPDATED_DEPARTMENT);
        assertThat(testCompanySector.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCompanySector.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testCompanySector.getModified()).isEqualTo(UPDATED_MODIFIED);

        // Validate the CompanySector in Elasticsearch
        CompanySector companySectorEs = companySectorSearchRepository.findOne(testCompanySector.getId());
        assertThat(testCompanySector.getCreated()).isEqualTo(testCompanySector.getCreated());
        assertThat(testCompanySector.getModified()).isEqualTo(testCompanySector.getModified());
        assertThat(companySectorEs).isEqualToIgnoringGivenFields(testCompanySector, "created", "modified");
    }

    @Test
    @Transactional
    public void updateNonExistingCompanySector() throws Exception {
        int databaseSizeBeforeUpdate = companySectorRepository.findAll().size();

        // Create the CompanySector

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCompanySectorMockMvc.perform(put("/api/company-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(companySector)))
            .andExpect(status().isCreated());

        // Validate the CompanySector in the database
        List<CompanySector> companySectorList = companySectorRepository.findAll();
        assertThat(companySectorList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCompanySector() throws Exception {
        // Initialize the database
        companySectorService.save(companySector);

        int databaseSizeBeforeDelete = companySectorRepository.findAll().size();

        // Get the companySector
        restCompanySectorMockMvc.perform(delete("/api/company-sectors/{id}", companySector.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean companySectorExistsInEs = companySectorSearchRepository.exists(companySector.getId());
        assertThat(companySectorExistsInEs).isFalse();

        // Validate the database is empty
        List<CompanySector> companySectorList = companySectorRepository.findAll();
        assertThat(companySectorList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCompanySector() throws Exception {
        // Initialize the database
        companySectorService.save(companySector);

        // Search the companySector
        restCompanySectorMockMvc.perform(get("/api/_search/company-sectors?query=id:" + companySector.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companySector.getId().intValue())))
            .andExpect(jsonPath("$.[*].department").value(hasItem(DEFAULT_DEPARTMENT.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompanySector.class);
        CompanySector companySector1 = new CompanySector();
        companySector1.setId(1L);
        CompanySector companySector2 = new CompanySector();
        companySector2.setId(companySector1.getId());
        assertThat(companySector1).isEqualTo(companySector2);
        companySector2.setId(2L);
        assertThat(companySector1).isNotEqualTo(companySector2);
        companySector1.setId(null);
        assertThat(companySector1).isNotEqualTo(companySector2);
    }
}
