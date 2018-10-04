package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.repository.MyAssetRepository;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.repository.search.MyAssetSearchRepository;
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

/**
 * Test class for the MyAssetResource REST controller.
 *
 * @see MyAssetResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class MyAssetResourceIntTest {

    private static final String DEFAULT_MAGNITUDE = "AAAAAAAAAA";
    private static final String UPDATED_MAGNITUDE = "BBBBBBBBBB";

    private static final Integer DEFAULT_RANKING = 1;
    private static final Integer UPDATED_RANKING = 2;

    private static final Boolean DEFAULT_ESTIMATED = false;
    private static final Boolean UPDATED_ESTIMATED = true;

    private static final BigDecimal DEFAULT_ECONOMIC_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_ECONOMIC_VALUE = new BigDecimal(2);

    private static final Integer DEFAULT_IMPACT = 1;
    private static final Integer UPDATED_IMPACT = 2;

    @Autowired
    private MyAssetRepository myAssetRepository;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private MyAssetSearchRepository myAssetSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMyAssetMockMvc;

    private MyAsset myAsset;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MyAssetResource myAssetResource = new MyAssetResource(myAssetService);
        this.restMyAssetMockMvc = MockMvcBuilders.standaloneSetup(myAssetResource)
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
    public static MyAsset createEntity(EntityManager em) {
        MyAsset myAsset = new MyAsset()
            .magnitude(DEFAULT_MAGNITUDE)
            .ranking(DEFAULT_RANKING)
            .estimated(DEFAULT_ESTIMATED)
            .economicValue(DEFAULT_ECONOMIC_VALUE)
            .impact(DEFAULT_IMPACT);
        return myAsset;
    }

    @Before
    public void initTest() {
        myAssetSearchRepository.deleteAll();
        myAsset = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyAsset() throws Exception {
        int databaseSizeBeforeCreate = myAssetRepository.findAll().size();

        // Create the MyAsset
        restMyAssetMockMvc.perform(post("/api/my-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAsset)))
            .andExpect(status().isCreated());

        // Validate the MyAsset in the database
        List<MyAsset> myAssetList = myAssetRepository.findAll();
        assertThat(myAssetList).hasSize(databaseSizeBeforeCreate + 1);
        MyAsset testMyAsset = myAssetList.get(myAssetList.size() - 1);
        assertThat(testMyAsset.getMagnitude()).isEqualTo(DEFAULT_MAGNITUDE);
        assertThat(testMyAsset.getRanking()).isEqualTo(DEFAULT_RANKING);
        assertThat(testMyAsset.isEstimated()).isEqualTo(DEFAULT_ESTIMATED);
        assertThat(testMyAsset.getEconomicValue()).isEqualTo(DEFAULT_ECONOMIC_VALUE);
        assertThat(testMyAsset.getImpact()).isEqualTo(DEFAULT_IMPACT);

        // Validate the MyAsset in Elasticsearch
        MyAsset myAssetEs = myAssetSearchRepository.findOne(testMyAsset.getId());
        assertThat(myAssetEs).isEqualToIgnoringGivenFields(testMyAsset);
    }

    @Test
    @Transactional
    public void createMyAssetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = myAssetRepository.findAll().size();

        // Create the MyAsset with an existing ID
        myAsset.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyAssetMockMvc.perform(post("/api/my-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAsset)))
            .andExpect(status().isBadRequest());

        // Validate the MyAsset in the database
        List<MyAsset> myAssetList = myAssetRepository.findAll();
        assertThat(myAssetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMyAssets() throws Exception {
        // Initialize the database
        myAssetRepository.saveAndFlush(myAsset);

        // Get all the myAssetList
        restMyAssetMockMvc.perform(get("/api/my-assets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myAsset.getId().intValue())))
            .andExpect(jsonPath("$.[*].magnitude").value(hasItem(DEFAULT_MAGNITUDE.toString())))
            .andExpect(jsonPath("$.[*].ranking").value(hasItem(DEFAULT_RANKING)))
            .andExpect(jsonPath("$.[*].estimated").value(hasItem(DEFAULT_ESTIMATED.booleanValue())))
            .andExpect(jsonPath("$.[*].economicValue").value(hasItem(DEFAULT_ECONOMIC_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT)));
    }

    @Test
    @Transactional
    public void getMyAsset() throws Exception {
        // Initialize the database
        myAssetRepository.saveAndFlush(myAsset);

        // Get the myAsset
        restMyAssetMockMvc.perform(get("/api/my-assets/{id}", myAsset.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(myAsset.getId().intValue()))
            .andExpect(jsonPath("$.magnitude").value(DEFAULT_MAGNITUDE.toString()))
            .andExpect(jsonPath("$.ranking").value(DEFAULT_RANKING))
            .andExpect(jsonPath("$.estimated").value(DEFAULT_ESTIMATED.booleanValue()))
            .andExpect(jsonPath("$.economicValue").value(DEFAULT_ECONOMIC_VALUE.intValue()))
            .andExpect(jsonPath("$.impact").value(DEFAULT_IMPACT));
    }

    @Test
    @Transactional
    public void getNonExistingMyAsset() throws Exception {
        // Get the myAsset
        restMyAssetMockMvc.perform(get("/api/my-assets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMyAsset() throws Exception {
        // Initialize the database
        myAssetService.save(myAsset);

        int databaseSizeBeforeUpdate = myAssetRepository.findAll().size();

        // Update the myAsset
        MyAsset updatedMyAsset = myAssetRepository.findOne(myAsset.getId());
        // Disconnect from session so that the updates on updatedMyAsset are not directly saved in db
        em.detach(updatedMyAsset);
        updatedMyAsset
            .magnitude(UPDATED_MAGNITUDE)
            .ranking(UPDATED_RANKING)
            .estimated(UPDATED_ESTIMATED)
            .economicValue(UPDATED_ECONOMIC_VALUE)
            .impact(UPDATED_IMPACT);

        restMyAssetMockMvc.perform(put("/api/my-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMyAsset)))
            .andExpect(status().isOk());

        // Validate the MyAsset in the database
        List<MyAsset> myAssetList = myAssetRepository.findAll();
        assertThat(myAssetList).hasSize(databaseSizeBeforeUpdate);
        MyAsset testMyAsset = myAssetList.get(myAssetList.size() - 1);
        assertThat(testMyAsset.getMagnitude()).isEqualTo(UPDATED_MAGNITUDE);
        assertThat(testMyAsset.getRanking()).isEqualTo(UPDATED_RANKING);
        assertThat(testMyAsset.isEstimated()).isEqualTo(UPDATED_ESTIMATED);
        assertThat(testMyAsset.getEconomicValue()).isEqualTo(UPDATED_ECONOMIC_VALUE);
        assertThat(testMyAsset.getImpact()).isEqualTo(UPDATED_IMPACT);

        // Validate the MyAsset in Elasticsearch
        MyAsset myAssetEs = myAssetSearchRepository.findOne(testMyAsset.getId());
        assertThat(myAssetEs).isEqualToIgnoringGivenFields(testMyAsset);
    }

    @Test
    @Transactional
    public void updateNonExistingMyAsset() throws Exception {
        int databaseSizeBeforeUpdate = myAssetRepository.findAll().size();

        // Create the MyAsset

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMyAssetMockMvc.perform(put("/api/my-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAsset)))
            .andExpect(status().isCreated());

        // Validate the MyAsset in the database
        List<MyAsset> myAssetList = myAssetRepository.findAll();
        assertThat(myAssetList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMyAsset() throws Exception {
        // Initialize the database
        myAssetService.save(myAsset);

        int databaseSizeBeforeDelete = myAssetRepository.findAll().size();

        // Get the myAsset
        restMyAssetMockMvc.perform(delete("/api/my-assets/{id}", myAsset.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean myAssetExistsInEs = myAssetSearchRepository.exists(myAsset.getId());
        assertThat(myAssetExistsInEs).isFalse();

        // Validate the database is empty
        List<MyAsset> myAssetList = myAssetRepository.findAll();
        assertThat(myAssetList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMyAsset() throws Exception {
        // Initialize the database
        myAssetService.save(myAsset);

        // Search the myAsset
        restMyAssetMockMvc.perform(get("/api/_search/my-assets?query=id:" + myAsset.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myAsset.getId().intValue())))
            .andExpect(jsonPath("$.[*].magnitude").value(hasItem(DEFAULT_MAGNITUDE.toString())))
            .andExpect(jsonPath("$.[*].ranking").value(hasItem(DEFAULT_RANKING)))
            .andExpect(jsonPath("$.[*].estimated").value(hasItem(DEFAULT_ESTIMATED.booleanValue())))
            .andExpect(jsonPath("$.[*].economicValue").value(hasItem(DEFAULT_ECONOMIC_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyAsset.class);
        MyAsset myAsset1 = new MyAsset();
        myAsset1.setId(1L);
        MyAsset myAsset2 = new MyAsset();
        myAsset2.setId(myAsset1.getId());
        assertThat(myAsset1).isEqualTo(myAsset2);
        myAsset2.setId(2L);
        assertThat(myAsset1).isNotEqualTo(myAsset2);
        myAsset1.setId(null);
        assertThat(myAsset1).isNotEqualTo(myAsset2);
    }
}
