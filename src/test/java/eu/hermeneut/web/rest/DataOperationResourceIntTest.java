package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.DataOperation;
import eu.hermeneut.repository.DataOperationRepository;
import eu.hermeneut.service.DataOperationService;
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
 * Test class for the DataOperationResource REST controller.
 *
 * @see DataOperationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class DataOperationResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PROCESSED_DATA = "AAAAAAAAAA";
    private static final String UPDATED_PROCESSED_DATA = "BBBBBBBBBB";

    private static final String DEFAULT_PROCESSING_PURPOSE = "AAAAAAAAAA";
    private static final String UPDATED_PROCESSING_PURPOSE = "BBBBBBBBBB";

    private static final String DEFAULT_DATA_SUBJECT = "AAAAAAAAAA";
    private static final String UPDATED_DATA_SUBJECT = "BBBBBBBBBB";

    private static final String DEFAULT_PROCESSING_MEANS = "AAAAAAAAAA";
    private static final String UPDATED_PROCESSING_MEANS = "BBBBBBBBBB";

    private static final String DEFAULT_DATA_PROCESSOR = "AAAAAAAAAA";
    private static final String UPDATED_DATA_PROCESSOR = "BBBBBBBBBB";

    @Autowired
    private DataOperationRepository dataOperationRepository;

    @Autowired
    private DataOperationService dataOperationService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDataOperationMockMvc;

    private DataOperation dataOperation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DataOperationResource dataOperationResource = new DataOperationResource(dataOperationService);
        this.restDataOperationMockMvc = MockMvcBuilders.standaloneSetup(dataOperationResource)
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
    public static DataOperation createEntity(EntityManager em) {
        DataOperation dataOperation = new DataOperation()
            .name(DEFAULT_NAME)
            .processedData(DEFAULT_PROCESSED_DATA)
            .processingPurpose(DEFAULT_PROCESSING_PURPOSE)
            .dataSubject(DEFAULT_DATA_SUBJECT)
            .processingMeans(DEFAULT_PROCESSING_MEANS)
            .dataProcessor(DEFAULT_DATA_PROCESSOR);
        return dataOperation;
    }

    @Before
    public void initTest() {
        dataOperation = createEntity(em);
    }

    @Test
    @Transactional
    public void createDataOperation() throws Exception {
        int databaseSizeBeforeCreate = dataOperationRepository.findAll().size();

        // Create the DataOperation
        restDataOperationMockMvc.perform(post("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isCreated());

        // Validate the DataOperation in the database
        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeCreate + 1);
        DataOperation testDataOperation = dataOperationList.get(dataOperationList.size() - 1);
        assertThat(testDataOperation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDataOperation.getProcessedData()).isEqualTo(DEFAULT_PROCESSED_DATA);
        assertThat(testDataOperation.getProcessingPurpose()).isEqualTo(DEFAULT_PROCESSING_PURPOSE);
        assertThat(testDataOperation.getDataSubject()).isEqualTo(DEFAULT_DATA_SUBJECT);
        assertThat(testDataOperation.getProcessingMeans()).isEqualTo(DEFAULT_PROCESSING_MEANS);
        assertThat(testDataOperation.getDataProcessor()).isEqualTo(DEFAULT_DATA_PROCESSOR);
    }

    @Test
    @Transactional
    public void createDataOperationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dataOperationRepository.findAll().size();

        // Create the DataOperation with an existing ID
        dataOperation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataOperationMockMvc.perform(post("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isBadRequest());

        // Validate the DataOperation in the database
        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataOperationRepository.findAll().size();
        // set the field null
        dataOperation.setName(null);

        // Create the DataOperation, which fails.

        restDataOperationMockMvc.perform(post("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isBadRequest());

        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkProcessedDataIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataOperationRepository.findAll().size();
        // set the field null
        dataOperation.setProcessedData(null);

        // Create the DataOperation, which fails.

        restDataOperationMockMvc.perform(post("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isBadRequest());

        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkProcessingPurposeIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataOperationRepository.findAll().size();
        // set the field null
        dataOperation.setProcessingPurpose(null);

        // Create the DataOperation, which fails.

        restDataOperationMockMvc.perform(post("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isBadRequest());

        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataSubjectIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataOperationRepository.findAll().size();
        // set the field null
        dataOperation.setDataSubject(null);

        // Create the DataOperation, which fails.

        restDataOperationMockMvc.perform(post("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isBadRequest());

        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkProcessingMeansIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataOperationRepository.findAll().size();
        // set the field null
        dataOperation.setProcessingMeans(null);

        // Create the DataOperation, which fails.

        restDataOperationMockMvc.perform(post("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isBadRequest());

        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataProcessorIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataOperationRepository.findAll().size();
        // set the field null
        dataOperation.setDataProcessor(null);

        // Create the DataOperation, which fails.

        restDataOperationMockMvc.perform(post("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isBadRequest());

        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDataOperations() throws Exception {
        // Initialize the database
        dataOperationRepository.saveAndFlush(dataOperation);

        // Get all the dataOperationList
        restDataOperationMockMvc.perform(get("/api/data-operations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataOperation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].processedData").value(hasItem(DEFAULT_PROCESSED_DATA.toString())))
            .andExpect(jsonPath("$.[*].processingPurpose").value(hasItem(DEFAULT_PROCESSING_PURPOSE.toString())))
            .andExpect(jsonPath("$.[*].dataSubject").value(hasItem(DEFAULT_DATA_SUBJECT.toString())))
            .andExpect(jsonPath("$.[*].processingMeans").value(hasItem(DEFAULT_PROCESSING_MEANS.toString())))
            .andExpect(jsonPath("$.[*].dataProcessor").value(hasItem(DEFAULT_DATA_PROCESSOR.toString())));
    }

    @Test
    @Transactional
    public void getDataOperation() throws Exception {
        // Initialize the database
        dataOperationRepository.saveAndFlush(dataOperation);

        // Get the dataOperation
        restDataOperationMockMvc.perform(get("/api/data-operations/{id}", dataOperation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dataOperation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.processedData").value(DEFAULT_PROCESSED_DATA.toString()))
            .andExpect(jsonPath("$.processingPurpose").value(DEFAULT_PROCESSING_PURPOSE.toString()))
            .andExpect(jsonPath("$.dataSubject").value(DEFAULT_DATA_SUBJECT.toString()))
            .andExpect(jsonPath("$.processingMeans").value(DEFAULT_PROCESSING_MEANS.toString()))
            .andExpect(jsonPath("$.dataProcessor").value(DEFAULT_DATA_PROCESSOR.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDataOperation() throws Exception {
        // Get the dataOperation
        restDataOperationMockMvc.perform(get("/api/data-operations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDataOperation() throws Exception {
        // Initialize the database
        dataOperationService.save(dataOperation);

        int databaseSizeBeforeUpdate = dataOperationRepository.findAll().size();

        // Update the dataOperation
        DataOperation updatedDataOperation = dataOperationRepository.findOne(dataOperation.getId());
        // Disconnect from session so that the updates on updatedDataOperation are not directly saved in db
        em.detach(updatedDataOperation);
        updatedDataOperation
            .name(UPDATED_NAME)
            .processedData(UPDATED_PROCESSED_DATA)
            .processingPurpose(UPDATED_PROCESSING_PURPOSE)
            .dataSubject(UPDATED_DATA_SUBJECT)
            .processingMeans(UPDATED_PROCESSING_MEANS)
            .dataProcessor(UPDATED_DATA_PROCESSOR);

        restDataOperationMockMvc.perform(put("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDataOperation)))
            .andExpect(status().isOk());

        // Validate the DataOperation in the database
        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeUpdate);
        DataOperation testDataOperation = dataOperationList.get(dataOperationList.size() - 1);
        assertThat(testDataOperation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataOperation.getProcessedData()).isEqualTo(UPDATED_PROCESSED_DATA);
        assertThat(testDataOperation.getProcessingPurpose()).isEqualTo(UPDATED_PROCESSING_PURPOSE);
        assertThat(testDataOperation.getDataSubject()).isEqualTo(UPDATED_DATA_SUBJECT);
        assertThat(testDataOperation.getProcessingMeans()).isEqualTo(UPDATED_PROCESSING_MEANS);
        assertThat(testDataOperation.getDataProcessor()).isEqualTo(UPDATED_DATA_PROCESSOR);
    }

    @Test
    @Transactional
    public void updateNonExistingDataOperation() throws Exception {
        int databaseSizeBeforeUpdate = dataOperationRepository.findAll().size();

        // Create the DataOperation

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDataOperationMockMvc.perform(put("/api/data-operations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataOperation)))
            .andExpect(status().isCreated());

        // Validate the DataOperation in the database
        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDataOperation() throws Exception {
        // Initialize the database
        dataOperationService.save(dataOperation);

        int databaseSizeBeforeDelete = dataOperationRepository.findAll().size();

        // Get the dataOperation
        restDataOperationMockMvc.perform(delete("/api/data-operations/{id}", dataOperation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DataOperation> dataOperationList = dataOperationRepository.findAll();
        assertThat(dataOperationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataOperation.class);
        DataOperation dataOperation1 = new DataOperation();
        dataOperation1.setId(1L);
        DataOperation dataOperation2 = new DataOperation();
        dataOperation2.setId(dataOperation1.getId());
        assertThat(dataOperation1).isEqualTo(dataOperation2);
        dataOperation2.setId(2L);
        assertThat(dataOperation1).isNotEqualTo(dataOperation2);
        dataOperation1.setId(null);
        assertThat(dataOperation1).isNotEqualTo(dataOperation2);
    }
}
