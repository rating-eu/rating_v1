/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.enumeration.AttackStrategyLikelihood;
import eu.hermeneut.repository.AttackStrategyRepository;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.service.LevelService;
import eu.hermeneut.service.PhaseService;
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

import eu.hermeneut.domain.enumeration.Frequency;
import eu.hermeneut.domain.enumeration.SkillLevel;
import eu.hermeneut.domain.enumeration.ResourceLevel;

/**
 * Test class for the AttackStrategyResource REST controller.
 *
 * @see AttackStrategyResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class AttackStrategyResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Frequency DEFAULT_FREQUENCY = Frequency.LOW;
    private static final Frequency UPDATED_FREQUENCY = Frequency.MEDIUM;

    private static final SkillLevel DEFAULT_SKILL = SkillLevel.HIGH;
    private static final SkillLevel UPDATED_SKILL = SkillLevel.MEDIUM;

    private static final ResourceLevel DEFAULT_RESOURCES = ResourceLevel.LOW;
    private static final ResourceLevel UPDATED_RESOURCES = ResourceLevel.MEDIUM;

    private static final AttackStrategyLikelihood DEFAULT_ATTACK_STRATEGY_LIKELIHOOD = AttackStrategyLikelihood.LOW;
    private static final AttackStrategyLikelihood UPDATED_ATTACK_STRATEGY_LIKELIHOOD = AttackStrategyLikelihood.LOW_MEDIUM;

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private AttackStrategyRepository attackStrategyRepository;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private LevelService levelService;

    @Autowired
    private PhaseService phaseService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAttackStrategyMockMvc;

    private AttackStrategy attackStrategy;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AttackStrategyResource attackStrategyResource = new AttackStrategyResource(attackStrategyService, levelService, phaseService);
        this.restAttackStrategyMockMvc = MockMvcBuilders.standaloneSetup(attackStrategyResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AttackStrategy createEntity(EntityManager em) {
        AttackStrategy attackStrategy = new AttackStrategy()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .frequency(DEFAULT_FREQUENCY)
            .skill(DEFAULT_SKILL)
            .resources(DEFAULT_RESOURCES)
            .likelihood(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED);
        return attackStrategy;
    }

    @Before
    public void initTest() {
        attackStrategy = createEntity(em);
    }

    @Test
    @Transactional
    public void createAttackStrategy() throws Exception {
        int databaseSizeBeforeCreate = attackStrategyRepository.findAll().size();

        // Create the AttackStrategy
        restAttackStrategyMockMvc.perform(post("/api/attack-strategies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackStrategy)))
            .andExpect(status().isCreated());

        // Validate the AttackStrategy in the database
        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeCreate + 1);
        AttackStrategy testAttackStrategy = attackStrategyList.get(attackStrategyList.size() - 1);
        assertThat(testAttackStrategy.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAttackStrategy.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAttackStrategy.getFrequency()).isEqualTo(DEFAULT_FREQUENCY);
        assertThat(testAttackStrategy.getSkill()).isEqualTo(DEFAULT_SKILL);
        assertThat(testAttackStrategy.getResources()).isEqualTo(DEFAULT_RESOURCES);
        assertThat(testAttackStrategy.getLikelihood()).isEqualTo(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD);
        assertThat(testAttackStrategy.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testAttackStrategy.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    @Transactional
    public void createAttackStrategyWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = attackStrategyRepository.findAll().size();

        // Create the AttackStrategy with an existing ID
        attackStrategy.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttackStrategyMockMvc.perform(post("/api/attack-strategies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackStrategy)))
            .andExpect(status().isBadRequest());

        // Validate the AttackStrategy in the database
        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = attackStrategyRepository.findAll().size();
        // set the field null
        attackStrategy.setName(null);

        // Create the AttackStrategy, which fails.

        restAttackStrategyMockMvc.perform(post("/api/attack-strategies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackStrategy)))
            .andExpect(status().isBadRequest());

        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkFrequencyIsRequired() throws Exception {
        int databaseSizeBeforeTest = attackStrategyRepository.findAll().size();
        // set the field null
        attackStrategy.setFrequency(null);

        // Create the AttackStrategy, which fails.

        restAttackStrategyMockMvc.perform(post("/api/attack-strategies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackStrategy)))
            .andExpect(status().isBadRequest());

        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSkillIsRequired() throws Exception {
        int databaseSizeBeforeTest = attackStrategyRepository.findAll().size();
        // set the field null
        attackStrategy.setSkill(null);

        // Create the AttackStrategy, which fails.

        restAttackStrategyMockMvc.perform(post("/api/attack-strategies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackStrategy)))
            .andExpect(status().isBadRequest());

        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkResourcesIsRequired() throws Exception {
        int databaseSizeBeforeTest = attackStrategyRepository.findAll().size();
        // set the field null
        attackStrategy.setResources(null);

        // Create the AttackStrategy, which fails.

        restAttackStrategyMockMvc.perform(post("/api/attack-strategies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackStrategy)))
            .andExpect(status().isBadRequest());

        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAttackStrategies() throws Exception {
        // Initialize the database
        attackStrategyRepository.saveAndFlush(attackStrategy);

        // Get all the attackStrategyList
        restAttackStrategyMockMvc.perform(get("/api/attack-strategies?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attackStrategy.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].frequency").value(hasItem(DEFAULT_FREQUENCY.toString())))
            .andExpect(jsonPath("$.[*].skill").value(hasItem(DEFAULT_SKILL.toString())))
            .andExpect(jsonPath("$.[*].resources").value(hasItem(DEFAULT_RESOURCES.toString())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    @Transactional
    public void getAttackStrategy() throws Exception {
        // Initialize the database
        attackStrategyRepository.saveAndFlush(attackStrategy);

        // Get the attackStrategy
        restAttackStrategyMockMvc.perform(get("/api/attack-strategies/{id}", attackStrategy.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(attackStrategy.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.frequency").value(DEFAULT_FREQUENCY.toString()))
            .andExpect(jsonPath("$.skill").value(DEFAULT_SKILL.toString()))
            .andExpect(jsonPath("$.resources").value(DEFAULT_RESOURCES.toString()))
            .andExpect(jsonPath("$.likelihood").value(DEFAULT_ATTACK_STRATEGY_LIKELIHOOD.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    @Transactional
    public void getNonExistingAttackStrategy() throws Exception {
        // Get the attackStrategy
        restAttackStrategyMockMvc.perform(get("/api/attack-strategies/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAttackStrategy() throws Exception {
        // Initialize the database
        attackStrategyService.save(attackStrategy);

        int databaseSizeBeforeUpdate = attackStrategyRepository.findAll().size();

        // Update the attackStrategy
        AttackStrategy updatedAttackStrategy = attackStrategyRepository.findOne(attackStrategy.getId());
        // Disconnect from session so that the updates on updatedAttackStrategy are not directly saved in db
        em.detach(updatedAttackStrategy);
        updatedAttackStrategy
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .frequency(UPDATED_FREQUENCY)
            .skill(UPDATED_SKILL)
            .resources(UPDATED_RESOURCES)
            .likelihood(UPDATED_ATTACK_STRATEGY_LIKELIHOOD)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED);

        restAttackStrategyMockMvc.perform(put("/api/attack-strategies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAttackStrategy)))
            .andExpect(status().isOk());

        // Validate the AttackStrategy in the database
        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeUpdate);
        AttackStrategy testAttackStrategy = attackStrategyList.get(attackStrategyList.size() - 1);
        assertThat(testAttackStrategy.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAttackStrategy.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAttackStrategy.getFrequency()).isEqualTo(UPDATED_FREQUENCY);
        assertThat(testAttackStrategy.getSkill()).isEqualTo(UPDATED_SKILL);
        assertThat(testAttackStrategy.getResources()).isEqualTo(UPDATED_RESOURCES);
        assertThat(testAttackStrategy.getLikelihood()).isEqualTo(UPDATED_ATTACK_STRATEGY_LIKELIHOOD);
        assertThat(testAttackStrategy.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testAttackStrategy.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    @Transactional
    public void updateNonExistingAttackStrategy() throws Exception {
        int databaseSizeBeforeUpdate = attackStrategyRepository.findAll().size();

        // Create the AttackStrategy

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAttackStrategyMockMvc.perform(put("/api/attack-strategies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackStrategy)))
            .andExpect(status().isCreated());

        // Validate the AttackStrategy in the database
        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAttackStrategy() throws Exception {
        // Initialize the database
        attackStrategyService.save(attackStrategy);

        int databaseSizeBeforeDelete = attackStrategyRepository.findAll().size();

        // Get the attackStrategy
        restAttackStrategyMockMvc.perform(delete("/api/attack-strategies/{id}", attackStrategy.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AttackStrategy> attackStrategyList = attackStrategyRepository.findAll();
        assertThat(attackStrategyList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttackStrategy.class);
        AttackStrategy attackStrategy1 = new AttackStrategy();
        attackStrategy1.setId(1L);
        AttackStrategy attackStrategy2 = new AttackStrategy();
        attackStrategy2.setId(attackStrategy1.getId());
        assertThat(attackStrategy1).isEqualTo(attackStrategy2);
        attackStrategy2.setId(2L);
        assertThat(attackStrategy1).isNotEqualTo(attackStrategy2);
        attackStrategy1.setId(null);
        assertThat(attackStrategy1).isNotEqualTo(attackStrategy2);
    }
}
