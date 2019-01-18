package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.repository.AttackCostRepository;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.repository.search.AttackCostSearchRepository;
import eu.hermeneut.service.SelfAssessmentService;
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

import eu.hermeneut.domain.enumeration.CostType;
/**
 * Test class for the AttackCostResource REST controller.
 *
 * @see AttackCostResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class AttackCostResourceIntTest {

    private static final CostType DEFAULT_TYPE = CostType.BEFORE_THE_ATTACK_STATUS_RESTORATION;
    private static final CostType UPDATED_TYPE = CostType.INCREASED_SECURITY;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_COSTS = new BigDecimal(1);
    private static final BigDecimal UPDATED_COSTS = new BigDecimal(2);

    @Autowired
    private AttackCostRepository attackCostRepository;

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AttackCostSearchRepository attackCostSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAttackCostMockMvc;

    private AttackCost attackCost;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AttackCostResource attackCostResource = new AttackCostResource(attackCostService, selfAssessmentService);
        this.restAttackCostMockMvc = MockMvcBuilders.standaloneSetup(attackCostResource)
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
    public static AttackCost createEntity(EntityManager em) {
        AttackCost attackCost = new AttackCost()
            .type(DEFAULT_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .costs(DEFAULT_COSTS);
        return attackCost;
    }

    @Before
    public void initTest() {
        attackCostSearchRepository.deleteAll();
        attackCost = createEntity(em);
    }

    @Test
    @Transactional
    public void createAttackCost() throws Exception {
        int databaseSizeBeforeCreate = attackCostRepository.findAll().size();

        // Create the AttackCost
        restAttackCostMockMvc.perform(post("/api/attack-costs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackCost)))
            .andExpect(status().isCreated());

        // Validate the AttackCost in the database
        List<AttackCost> attackCostList = attackCostRepository.findAll();
        assertThat(attackCostList).hasSize(databaseSizeBeforeCreate + 1);
        AttackCost testAttackCost = attackCostList.get(attackCostList.size() - 1);
        assertThat(testAttackCost.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAttackCost.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAttackCost.getCosts()).isEqualTo(DEFAULT_COSTS);

        // Validate the AttackCost in Elasticsearch
        AttackCost attackCostEs = attackCostSearchRepository.findOne(testAttackCost.getId());
        assertThat(attackCostEs).isEqualToIgnoringGivenFields(testAttackCost);
    }

    @Test
    @Transactional
    public void createAttackCostWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = attackCostRepository.findAll().size();

        // Create the AttackCost with an existing ID
        attackCost.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttackCostMockMvc.perform(post("/api/attack-costs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackCost)))
            .andExpect(status().isBadRequest());

        // Validate the AttackCost in the database
        List<AttackCost> attackCostList = attackCostRepository.findAll();
        assertThat(attackCostList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = attackCostRepository.findAll().size();
        // set the field null
        attackCost.setType(null);

        // Create the AttackCost, which fails.

        restAttackCostMockMvc.perform(post("/api/attack-costs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackCost)))
            .andExpect(status().isBadRequest());

        List<AttackCost> attackCostList = attackCostRepository.findAll();
        assertThat(attackCostList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAttackCosts() throws Exception {
        // Initialize the database
        attackCostRepository.saveAndFlush(attackCost);

        // Get all the attackCostList
        restAttackCostMockMvc.perform(get("/api/attack-costs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attackCost.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].costs").value(hasItem(DEFAULT_COSTS.intValue())));
    }

    @Test
    @Transactional
    public void getAttackCost() throws Exception {
        // Initialize the database
        attackCostRepository.saveAndFlush(attackCost);

        // Get the attackCost
        restAttackCostMockMvc.perform(get("/api/attack-costs/{id}", attackCost.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(attackCost.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.costs").value(DEFAULT_COSTS.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAttackCost() throws Exception {
        // Get the attackCost
        restAttackCostMockMvc.perform(get("/api/attack-costs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAttackCost() throws Exception {
        // Initialize the database
        attackCostService.save(attackCost);

        int databaseSizeBeforeUpdate = attackCostRepository.findAll().size();

        // Update the attackCost
        AttackCost updatedAttackCost = attackCostRepository.findOne(attackCost.getId());
        // Disconnect from session so that the updates on updatedAttackCost are not directly saved in db
        em.detach(updatedAttackCost);
        updatedAttackCost
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION)
            .costs(UPDATED_COSTS);

        restAttackCostMockMvc.perform(put("/api/attack-costs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAttackCost)))
            .andExpect(status().isOk());

        // Validate the AttackCost in the database
        List<AttackCost> attackCostList = attackCostRepository.findAll();
        assertThat(attackCostList).hasSize(databaseSizeBeforeUpdate);
        AttackCost testAttackCost = attackCostList.get(attackCostList.size() - 1);
        assertThat(testAttackCost.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAttackCost.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAttackCost.getCosts()).isEqualTo(UPDATED_COSTS);

        // Validate the AttackCost in Elasticsearch
        AttackCost attackCostEs = attackCostSearchRepository.findOne(testAttackCost.getId());
        assertThat(attackCostEs).isEqualToIgnoringGivenFields(testAttackCost);
    }

    @Test
    @Transactional
    public void updateNonExistingAttackCost() throws Exception {
        int databaseSizeBeforeUpdate = attackCostRepository.findAll().size();

        // Create the AttackCost

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAttackCostMockMvc.perform(put("/api/attack-costs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackCost)))
            .andExpect(status().isCreated());

        // Validate the AttackCost in the database
        List<AttackCost> attackCostList = attackCostRepository.findAll();
        assertThat(attackCostList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAttackCost() throws Exception {
        // Initialize the database
        attackCostService.save(attackCost);

        int databaseSizeBeforeDelete = attackCostRepository.findAll().size();

        // Get the attackCost
        restAttackCostMockMvc.perform(delete("/api/attack-costs/{id}", attackCost.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean attackCostExistsInEs = attackCostSearchRepository.exists(attackCost.getId());
        assertThat(attackCostExistsInEs).isFalse();

        // Validate the database is empty
        List<AttackCost> attackCostList = attackCostRepository.findAll();
        assertThat(attackCostList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchAttackCost() throws Exception {
        // Initialize the database
        attackCostService.save(attackCost);

        // Search the attackCost
        restAttackCostMockMvc.perform(get("/api/_search/attack-costs?query=id:" + attackCost.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attackCost.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].costs").value(hasItem(DEFAULT_COSTS.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttackCost.class);
        AttackCost attackCost1 = new AttackCost();
        attackCost1.setId(1L);
        AttackCost attackCost2 = new AttackCost();
        attackCost2.setId(attackCost1.getId());
        assertThat(attackCost1).isEqualTo(attackCost2);
        attackCost2.setId(2L);
        assertThat(attackCost1).isNotEqualTo(attackCost2);
        attackCost1.setId(null);
        assertThat(attackCost1).isNotEqualTo(attackCost2);
    }
}
