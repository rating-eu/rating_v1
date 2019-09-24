package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.DataRecipient;
import eu.hermeneut.repository.DataRecipientRepository;
import eu.hermeneut.service.DataRecipientService;
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

import eu.hermeneut.domain.enumeration.DataRecipientType;
/**
 * Test class for the DataRecipientResource REST controller.
 *
 * @see DataRecipientResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class DataRecipientResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final DataRecipientType DEFAULT_TYPE = DataRecipientType.INTERNAL;
    private static final DataRecipientType UPDATED_TYPE = DataRecipientType.EXTERNAL;

    @Autowired
    private DataRecipientRepository dataRecipientRepository;

    @Autowired
    private DataRecipientService dataRecipientService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDataRecipientMockMvc;

    private DataRecipient dataRecipient;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DataRecipientResource dataRecipientResource = new DataRecipientResource(dataRecipientService);
        this.restDataRecipientMockMvc = MockMvcBuilders.standaloneSetup(dataRecipientResource)
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
    public static DataRecipient createEntity(EntityManager em) {
        DataRecipient dataRecipient = new DataRecipient()
            .name(DEFAULT_NAME)
            .type(DEFAULT_TYPE);
        return dataRecipient;
    }

    @Before
    public void initTest() {
        dataRecipient = createEntity(em);
    }

    @Test
    @Transactional
    public void createDataRecipient() throws Exception {
        int databaseSizeBeforeCreate = dataRecipientRepository.findAll().size();

        // Create the DataRecipient
        restDataRecipientMockMvc.perform(post("/api/data-recipients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRecipient)))
            .andExpect(status().isCreated());

        // Validate the DataRecipient in the database
        List<DataRecipient> dataRecipientList = dataRecipientRepository.findAll();
        assertThat(dataRecipientList).hasSize(databaseSizeBeforeCreate + 1);
        DataRecipient testDataRecipient = dataRecipientList.get(dataRecipientList.size() - 1);
        assertThat(testDataRecipient.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDataRecipient.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    public void createDataRecipientWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dataRecipientRepository.findAll().size();

        // Create the DataRecipient with an existing ID
        dataRecipient.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataRecipientMockMvc.perform(post("/api/data-recipients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRecipient)))
            .andExpect(status().isBadRequest());

        // Validate the DataRecipient in the database
        List<DataRecipient> dataRecipientList = dataRecipientRepository.findAll();
        assertThat(dataRecipientList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataRecipientRepository.findAll().size();
        // set the field null
        dataRecipient.setName(null);

        // Create the DataRecipient, which fails.

        restDataRecipientMockMvc.perform(post("/api/data-recipients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRecipient)))
            .andExpect(status().isBadRequest());

        List<DataRecipient> dataRecipientList = dataRecipientRepository.findAll();
        assertThat(dataRecipientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataRecipientRepository.findAll().size();
        // set the field null
        dataRecipient.setType(null);

        // Create the DataRecipient, which fails.

        restDataRecipientMockMvc.perform(post("/api/data-recipients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRecipient)))
            .andExpect(status().isBadRequest());

        List<DataRecipient> dataRecipientList = dataRecipientRepository.findAll();
        assertThat(dataRecipientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDataRecipients() throws Exception {
        // Initialize the database
        dataRecipientRepository.saveAndFlush(dataRecipient);

        // Get all the dataRecipientList
        restDataRecipientMockMvc.perform(get("/api/data-recipients?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataRecipient.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void getDataRecipient() throws Exception {
        // Initialize the database
        dataRecipientRepository.saveAndFlush(dataRecipient);

        // Get the dataRecipient
        restDataRecipientMockMvc.perform(get("/api/data-recipients/{id}", dataRecipient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dataRecipient.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDataRecipient() throws Exception {
        // Get the dataRecipient
        restDataRecipientMockMvc.perform(get("/api/data-recipients/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDataRecipient() throws Exception {
        // Initialize the database
        dataRecipientService.save(dataRecipient);

        int databaseSizeBeforeUpdate = dataRecipientRepository.findAll().size();

        // Update the dataRecipient
        DataRecipient updatedDataRecipient = dataRecipientRepository.findOne(dataRecipient.getId());
        // Disconnect from session so that the updates on updatedDataRecipient are not directly saved in db
        em.detach(updatedDataRecipient);
        updatedDataRecipient
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE);

        restDataRecipientMockMvc.perform(put("/api/data-recipients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDataRecipient)))
            .andExpect(status().isOk());

        // Validate the DataRecipient in the database
        List<DataRecipient> dataRecipientList = dataRecipientRepository.findAll();
        assertThat(dataRecipientList).hasSize(databaseSizeBeforeUpdate);
        DataRecipient testDataRecipient = dataRecipientList.get(dataRecipientList.size() - 1);
        assertThat(testDataRecipient.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataRecipient.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingDataRecipient() throws Exception {
        int databaseSizeBeforeUpdate = dataRecipientRepository.findAll().size();

        // Create the DataRecipient

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDataRecipientMockMvc.perform(put("/api/data-recipients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataRecipient)))
            .andExpect(status().isCreated());

        // Validate the DataRecipient in the database
        List<DataRecipient> dataRecipientList = dataRecipientRepository.findAll();
        assertThat(dataRecipientList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDataRecipient() throws Exception {
        // Initialize the database
        dataRecipientService.save(dataRecipient);

        int databaseSizeBeforeDelete = dataRecipientRepository.findAll().size();

        // Get the dataRecipient
        restDataRecipientMockMvc.perform(delete("/api/data-recipients/{id}", dataRecipient.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DataRecipient> dataRecipientList = dataRecipientRepository.findAll();
        assertThat(dataRecipientList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataRecipient.class);
        DataRecipient dataRecipient1 = new DataRecipient();
        dataRecipient1.setId(1L);
        DataRecipient dataRecipient2 = new DataRecipient();
        dataRecipient2.setId(dataRecipient1.getId());
        assertThat(dataRecipient1).isEqualTo(dataRecipient2);
        dataRecipient2.setId(2L);
        assertThat(dataRecipient1).isNotEqualTo(dataRecipient2);
        dataRecipient1.setId(null);
        assertThat(dataRecipient1).isNotEqualTo(dataRecipient2);
    }
}
