package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.DataImpactDescription;
import eu.hermeneut.repository.DataImpactDescriptionRepository;
import eu.hermeneut.service.DataImpactDescriptionService;
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
import eu.hermeneut.domain.enumeration.Language;
/**
 * Test class for the DataImpactDescriptionResource REST controller.
 *
 * @see DataImpactDescriptionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class DataImpactDescriptionResourceIntTest {

    private static final DataImpact DEFAULT_IMPACT = DataImpact.LOW;
    private static final DataImpact UPDATED_IMPACT = DataImpact.MEDIUM;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Language DEFAULT_LANGUAGE = Language.IT;
    private static final Language UPDATED_LANGUAGE = Language.EN;

    @Autowired
    private DataImpactDescriptionRepository dataImpactDescriptionRepository;

    @Autowired
    private DataImpactDescriptionService dataImpactDescriptionService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDataImpactDescriptionMockMvc;

    private DataImpactDescription dataImpactDescription;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DataImpactDescriptionResource dataImpactDescriptionResource = new DataImpactDescriptionResource(dataImpactDescriptionService);
        this.restDataImpactDescriptionMockMvc = MockMvcBuilders.standaloneSetup(dataImpactDescriptionResource)
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
    public static DataImpactDescription createEntity(EntityManager em) {
        DataImpactDescription dataImpactDescription = new DataImpactDescription()
            .impact(DEFAULT_IMPACT)
            .description(DEFAULT_DESCRIPTION)
            .language(DEFAULT_LANGUAGE);
        return dataImpactDescription;
    }

    @Before
    public void initTest() {
        dataImpactDescription = createEntity(em);
    }

    @Test
    @Transactional
    public void createDataImpactDescription() throws Exception {
        int databaseSizeBeforeCreate = dataImpactDescriptionRepository.findAll().size();

        // Create the DataImpactDescription
        restDataImpactDescriptionMockMvc.perform(post("/api/data-impact-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataImpactDescription)))
            .andExpect(status().isCreated());

        // Validate the DataImpactDescription in the database
        List<DataImpactDescription> dataImpactDescriptionList = dataImpactDescriptionRepository.findAll();
        assertThat(dataImpactDescriptionList).hasSize(databaseSizeBeforeCreate + 1);
        DataImpactDescription testDataImpactDescription = dataImpactDescriptionList.get(dataImpactDescriptionList.size() - 1);
        assertThat(testDataImpactDescription.getImpact()).isEqualTo(DEFAULT_IMPACT);
        assertThat(testDataImpactDescription.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDataImpactDescription.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
    }

    @Test
    @Transactional
    public void createDataImpactDescriptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dataImpactDescriptionRepository.findAll().size();

        // Create the DataImpactDescription with an existing ID
        dataImpactDescription.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataImpactDescriptionMockMvc.perform(post("/api/data-impact-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataImpactDescription)))
            .andExpect(status().isBadRequest());

        // Validate the DataImpactDescription in the database
        List<DataImpactDescription> dataImpactDescriptionList = dataImpactDescriptionRepository.findAll();
        assertThat(dataImpactDescriptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkImpactIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataImpactDescriptionRepository.findAll().size();
        // set the field null
        dataImpactDescription.setImpact(null);

        // Create the DataImpactDescription, which fails.

        restDataImpactDescriptionMockMvc.perform(post("/api/data-impact-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataImpactDescription)))
            .andExpect(status().isBadRequest());

        List<DataImpactDescription> dataImpactDescriptionList = dataImpactDescriptionRepository.findAll();
        assertThat(dataImpactDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataImpactDescriptionRepository.findAll().size();
        // set the field null
        dataImpactDescription.setDescription(null);

        // Create the DataImpactDescription, which fails.

        restDataImpactDescriptionMockMvc.perform(post("/api/data-impact-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataImpactDescription)))
            .andExpect(status().isBadRequest());

        List<DataImpactDescription> dataImpactDescriptionList = dataImpactDescriptionRepository.findAll();
        assertThat(dataImpactDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLanguageIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataImpactDescriptionRepository.findAll().size();
        // set the field null
        dataImpactDescription.setLanguage(null);

        // Create the DataImpactDescription, which fails.

        restDataImpactDescriptionMockMvc.perform(post("/api/data-impact-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataImpactDescription)))
            .andExpect(status().isBadRequest());

        List<DataImpactDescription> dataImpactDescriptionList = dataImpactDescriptionRepository.findAll();
        assertThat(dataImpactDescriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDataImpactDescriptions() throws Exception {
        // Initialize the database
        dataImpactDescriptionRepository.saveAndFlush(dataImpactDescription);

        // Get all the dataImpactDescriptionList
        restDataImpactDescriptionMockMvc.perform(get("/api/data-impact-descriptions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataImpactDescription.getId().intValue())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())));
    }

    @Test
    @Transactional
    public void getDataImpactDescription() throws Exception {
        // Initialize the database
        dataImpactDescriptionRepository.saveAndFlush(dataImpactDescription);

        // Get the dataImpactDescription
        restDataImpactDescriptionMockMvc.perform(get("/api/data-impact-descriptions/{id}", dataImpactDescription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dataImpactDescription.getId().intValue()))
            .andExpect(jsonPath("$.impact").value(DEFAULT_IMPACT.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDataImpactDescription() throws Exception {
        // Get the dataImpactDescription
        restDataImpactDescriptionMockMvc.perform(get("/api/data-impact-descriptions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDataImpactDescription() throws Exception {
        // Initialize the database
        dataImpactDescriptionService.save(dataImpactDescription);

        int databaseSizeBeforeUpdate = dataImpactDescriptionRepository.findAll().size();

        // Update the dataImpactDescription
        DataImpactDescription updatedDataImpactDescription = dataImpactDescriptionRepository.findOne(dataImpactDescription.getId());
        // Disconnect from session so that the updates on updatedDataImpactDescription are not directly saved in db
        em.detach(updatedDataImpactDescription);
        updatedDataImpactDescription
            .impact(UPDATED_IMPACT)
            .description(UPDATED_DESCRIPTION)
            .language(UPDATED_LANGUAGE);

        restDataImpactDescriptionMockMvc.perform(put("/api/data-impact-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDataImpactDescription)))
            .andExpect(status().isOk());

        // Validate the DataImpactDescription in the database
        List<DataImpactDescription> dataImpactDescriptionList = dataImpactDescriptionRepository.findAll();
        assertThat(dataImpactDescriptionList).hasSize(databaseSizeBeforeUpdate);
        DataImpactDescription testDataImpactDescription = dataImpactDescriptionList.get(dataImpactDescriptionList.size() - 1);
        assertThat(testDataImpactDescription.getImpact()).isEqualTo(UPDATED_IMPACT);
        assertThat(testDataImpactDescription.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDataImpactDescription.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
    }

    @Test
    @Transactional
    public void updateNonExistingDataImpactDescription() throws Exception {
        int databaseSizeBeforeUpdate = dataImpactDescriptionRepository.findAll().size();

        // Create the DataImpactDescription

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDataImpactDescriptionMockMvc.perform(put("/api/data-impact-descriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataImpactDescription)))
            .andExpect(status().isCreated());

        // Validate the DataImpactDescription in the database
        List<DataImpactDescription> dataImpactDescriptionList = dataImpactDescriptionRepository.findAll();
        assertThat(dataImpactDescriptionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDataImpactDescription() throws Exception {
        // Initialize the database
        dataImpactDescriptionService.save(dataImpactDescription);

        int databaseSizeBeforeDelete = dataImpactDescriptionRepository.findAll().size();

        // Get the dataImpactDescription
        restDataImpactDescriptionMockMvc.perform(delete("/api/data-impact-descriptions/{id}", dataImpactDescription.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DataImpactDescription> dataImpactDescriptionList = dataImpactDescriptionRepository.findAll();
        assertThat(dataImpactDescriptionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataImpactDescription.class);
        DataImpactDescription dataImpactDescription1 = new DataImpactDescription();
        dataImpactDescription1.setId(1L);
        DataImpactDescription dataImpactDescription2 = new DataImpactDescription();
        dataImpactDescription2.setId(dataImpactDescription1.getId());
        assertThat(dataImpactDescription1).isEqualTo(dataImpactDescription2);
        dataImpactDescription2.setId(2L);
        assertThat(dataImpactDescription1).isNotEqualTo(dataImpactDescription2);
        dataImpactDescription1.setId(null);
        assertThat(dataImpactDescription1).isNotEqualTo(dataImpactDescription2);
    }
}
