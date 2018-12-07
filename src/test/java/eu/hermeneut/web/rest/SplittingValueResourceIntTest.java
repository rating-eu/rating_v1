package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.SplittingValue;
import eu.hermeneut.repository.SplittingValueRepository;
import eu.hermeneut.service.SplittingValueService;
import eu.hermeneut.repository.search.SplittingValueSearchRepository;
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
import java.math.BigDecimal;
import java.util.List;

import static eu.hermeneut.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.domain.enumeration.CategoryType;
/**
 * Test class for the SplittingValueResource REST controller.
 *
 * @see SplittingValueResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class SplittingValueResourceIntTest {

    private static final SectorType DEFAULT_SECTOR_TYPE = SectorType.GLOBAL;
    private static final SectorType UPDATED_SECTOR_TYPE = SectorType.FINANCE_AND_INSURANCE;

    private static final CategoryType DEFAULT_CATEGORY_TYPE = CategoryType.IP;
    private static final CategoryType UPDATED_CATEGORY_TYPE = CategoryType.KEY_COMP;

    private static final BigDecimal DEFAULT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE = new BigDecimal(2);

    @Autowired
    private SplittingValueRepository splittingValueRepository;

    @Autowired
    private SplittingValueService splittingValueService;

    @Autowired
    private SplittingValueSearchRepository splittingValueSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSplittingValueMockMvc;

    private SplittingValue splittingValue;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SplittingValueResource splittingValueResource = new SplittingValueResource(splittingValueService);
        this.restSplittingValueMockMvc = MockMvcBuilders.standaloneSetup(splittingValueResource)
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
    public static SplittingValue createEntity(EntityManager em) {
        SplittingValue splittingValue = new SplittingValue()
            .sectorType(DEFAULT_SECTOR_TYPE)
            .categoryType(DEFAULT_CATEGORY_TYPE)
            .value(DEFAULT_VALUE);
        return splittingValue;
    }

    @Before
    public void initTest() {
        splittingValueSearchRepository.deleteAll();
        splittingValue = createEntity(em);
    }

    @Test
    @Transactional
    public void createSplittingValue() throws Exception {
        int databaseSizeBeforeCreate = splittingValueRepository.findAll().size();

        // Create the SplittingValue
        restSplittingValueMockMvc.perform(post("/api/splitting-values")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(splittingValue)))
            .andExpect(status().isCreated());

        // Validate the SplittingValue in the database
        List<SplittingValue> splittingValueList = splittingValueRepository.findAll();
        assertThat(splittingValueList).hasSize(databaseSizeBeforeCreate + 1);
        SplittingValue testSplittingValue = splittingValueList.get(splittingValueList.size() - 1);
        assertThat(testSplittingValue.getSectorType()).isEqualTo(DEFAULT_SECTOR_TYPE);
        assertThat(testSplittingValue.getCategoryType()).isEqualTo(DEFAULT_CATEGORY_TYPE);
        assertThat(testSplittingValue.getValue()).isEqualTo(DEFAULT_VALUE);

        // Validate the SplittingValue in Elasticsearch
        SplittingValue splittingValueEs = splittingValueSearchRepository.findOne(testSplittingValue.getId());
        assertThat(splittingValueEs).isEqualToIgnoringGivenFields(testSplittingValue);
    }

    @Test
    @Transactional
    public void createSplittingValueWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = splittingValueRepository.findAll().size();

        // Create the SplittingValue with an existing ID
        splittingValue.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSplittingValueMockMvc.perform(post("/api/splitting-values")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(splittingValue)))
            .andExpect(status().isBadRequest());

        // Validate the SplittingValue in the database
        List<SplittingValue> splittingValueList = splittingValueRepository.findAll();
        assertThat(splittingValueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSplittingValues() throws Exception {
        // Initialize the database
        splittingValueRepository.saveAndFlush(splittingValue);

        // Get all the splittingValueList
        restSplittingValueMockMvc.perform(get("/api/splitting-values?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(splittingValue.getId().intValue())))
            .andExpect(jsonPath("$.[*].sectorType").value(hasItem(DEFAULT_SECTOR_TYPE.toString())))
            .andExpect(jsonPath("$.[*].categoryType").value(hasItem(DEFAULT_CATEGORY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())));
    }

    @Test
    @Transactional
    public void getSplittingValue() throws Exception {
        // Initialize the database
        splittingValueRepository.saveAndFlush(splittingValue);

        // Get the splittingValue
        restSplittingValueMockMvc.perform(get("/api/splitting-values/{id}", splittingValue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(splittingValue.getId().intValue()))
            .andExpect(jsonPath("$.sectorType").value(DEFAULT_SECTOR_TYPE.toString()))
            .andExpect(jsonPath("$.categoryType").value(DEFAULT_CATEGORY_TYPE.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSplittingValue() throws Exception {
        // Get the splittingValue
        restSplittingValueMockMvc.perform(get("/api/splitting-values/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSplittingValue() throws Exception {
        // Initialize the database
        splittingValueService.save(splittingValue);

        int databaseSizeBeforeUpdate = splittingValueRepository.findAll().size();

        // Update the splittingValue
        SplittingValue updatedSplittingValue = splittingValueRepository.findOne(splittingValue.getId());
        // Disconnect from session so that the updates on updatedSplittingValue are not directly saved in db
        em.detach(updatedSplittingValue);
        updatedSplittingValue
            .sectorType(UPDATED_SECTOR_TYPE)
            .categoryType(UPDATED_CATEGORY_TYPE)
            .value(UPDATED_VALUE);

        restSplittingValueMockMvc.perform(put("/api/splitting-values")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSplittingValue)))
            .andExpect(status().isOk());

        // Validate the SplittingValue in the database
        List<SplittingValue> splittingValueList = splittingValueRepository.findAll();
        assertThat(splittingValueList).hasSize(databaseSizeBeforeUpdate);
        SplittingValue testSplittingValue = splittingValueList.get(splittingValueList.size() - 1);
        assertThat(testSplittingValue.getSectorType()).isEqualTo(UPDATED_SECTOR_TYPE);
        assertThat(testSplittingValue.getCategoryType()).isEqualTo(UPDATED_CATEGORY_TYPE);
        assertThat(testSplittingValue.getValue()).isEqualTo(UPDATED_VALUE);

        // Validate the SplittingValue in Elasticsearch
        SplittingValue splittingValueEs = splittingValueSearchRepository.findOne(testSplittingValue.getId());
        assertThat(splittingValueEs).isEqualToIgnoringGivenFields(testSplittingValue);
    }

    @Test
    @Transactional
    public void updateNonExistingSplittingValue() throws Exception {
        int databaseSizeBeforeUpdate = splittingValueRepository.findAll().size();

        // Create the SplittingValue

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSplittingValueMockMvc.perform(put("/api/splitting-values")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(splittingValue)))
            .andExpect(status().isCreated());

        // Validate the SplittingValue in the database
        List<SplittingValue> splittingValueList = splittingValueRepository.findAll();
        assertThat(splittingValueList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSplittingValue() throws Exception {
        // Initialize the database
        splittingValueService.save(splittingValue);

        int databaseSizeBeforeDelete = splittingValueRepository.findAll().size();

        // Get the splittingValue
        restSplittingValueMockMvc.perform(delete("/api/splitting-values/{id}", splittingValue.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean splittingValueExistsInEs = splittingValueSearchRepository.exists(splittingValue.getId());
        assertThat(splittingValueExistsInEs).isFalse();

        // Validate the database is empty
        List<SplittingValue> splittingValueList = splittingValueRepository.findAll();
        assertThat(splittingValueList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSplittingValue() throws Exception {
        // Initialize the database
        splittingValueService.save(splittingValue);

        // Search the splittingValue
        restSplittingValueMockMvc.perform(get("/api/_search/splitting-values?query=id:" + splittingValue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(splittingValue.getId().intValue())))
            .andExpect(jsonPath("$.[*].sectorType").value(hasItem(DEFAULT_SECTOR_TYPE.toString())))
            .andExpect(jsonPath("$.[*].categoryType").value(hasItem(DEFAULT_CATEGORY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SplittingValue.class);
        SplittingValue splittingValue1 = new SplittingValue();
        splittingValue1.setId(1L);
        SplittingValue splittingValue2 = new SplittingValue();
        splittingValue2.setId(splittingValue1.getId());
        assertThat(splittingValue1).isEqualTo(splittingValue2);
        splittingValue2.setId(2L);
        assertThat(splittingValue1).isNotEqualTo(splittingValue2);
        splittingValue1.setId(null);
        assertThat(splittingValue1).isNotEqualTo(splittingValue2);
    }
}
