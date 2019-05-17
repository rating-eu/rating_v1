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

import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.repository.AttackCostParamRepository;
import eu.hermeneut.service.AttackCostParamService;
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

import eu.hermeneut.domain.enumeration.AttackCostParamType;
/**
 * Test class for the AttackCostParamResource REST controller.
 *
 * @see AttackCostParamResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class AttackCostParamResourceIntTest {

    private static final AttackCostParamType DEFAULT_TYPE = AttackCostParamType.NUMBER_OF_CUSTOMERS;
    private static final AttackCostParamType UPDATED_TYPE = AttackCostParamType.PROTECTION_COST_PER_CUSTOMER;

    private static final BigDecimal DEFAULT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE = new BigDecimal(2);

    @Autowired
    private AttackCostParamRepository attackCostParamRepository;

    @Autowired
    private AttackCostParamService attackCostParamService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAttackCostParamMockMvc;

    private AttackCostParam attackCostParam;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AttackCostParamResource attackCostParamResource = new AttackCostParamResource(attackCostParamService);
        this.restAttackCostParamMockMvc = MockMvcBuilders.standaloneSetup(attackCostParamResource)
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
    public static AttackCostParam createEntity(EntityManager em) {
        AttackCostParam attackCostParam = new AttackCostParam()
            .type(DEFAULT_TYPE)
            .value(DEFAULT_VALUE);
        return attackCostParam;
    }

    @Before
    public void initTest() {
        attackCostParam = createEntity(em);
    }

    @Test
    @Transactional
    public void createAttackCostParam() throws Exception {
        int databaseSizeBeforeCreate = attackCostParamRepository.findAll().size();

        // Create the AttackCostParam
        restAttackCostParamMockMvc.perform(post("/api/attack-cost-params")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackCostParam)))
            .andExpect(status().isCreated());

        // Validate the AttackCostParam in the database
        List<AttackCostParam> attackCostParamList = attackCostParamRepository.findAll();
        assertThat(attackCostParamList).hasSize(databaseSizeBeforeCreate + 1);
        AttackCostParam testAttackCostParam = attackCostParamList.get(attackCostParamList.size() - 1);
        assertThat(testAttackCostParam.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAttackCostParam.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    public void createAttackCostParamWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = attackCostParamRepository.findAll().size();

        // Create the AttackCostParam with an existing ID
        attackCostParam.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttackCostParamMockMvc.perform(post("/api/attack-cost-params")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackCostParam)))
            .andExpect(status().isBadRequest());

        // Validate the AttackCostParam in the database
        List<AttackCostParam> attackCostParamList = attackCostParamRepository.findAll();
        assertThat(attackCostParamList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = attackCostParamRepository.findAll().size();
        // set the field null
        attackCostParam.setType(null);

        // Create the AttackCostParam, which fails.

        restAttackCostParamMockMvc.perform(post("/api/attack-cost-params")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackCostParam)))
            .andExpect(status().isBadRequest());

        List<AttackCostParam> attackCostParamList = attackCostParamRepository.findAll();
        assertThat(attackCostParamList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAttackCostParams() throws Exception {
        // Initialize the database
        attackCostParamRepository.saveAndFlush(attackCostParam);

        // Get all the attackCostParamList
        restAttackCostParamMockMvc.perform(get("/api/attack-cost-params?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attackCostParam.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())));
    }

    @Test
    @Transactional
    public void getAttackCostParam() throws Exception {
        // Initialize the database
        attackCostParamRepository.saveAndFlush(attackCostParam);

        // Get the attackCostParam
        restAttackCostParamMockMvc.perform(get("/api/attack-cost-params/{id}", attackCostParam.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(attackCostParam.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAttackCostParam() throws Exception {
        // Get the attackCostParam
        restAttackCostParamMockMvc.perform(get("/api/attack-cost-params/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAttackCostParam() throws Exception {
        // Initialize the database
        attackCostParamService.save(attackCostParam);

        int databaseSizeBeforeUpdate = attackCostParamRepository.findAll().size();

        // Update the attackCostParam
        AttackCostParam updatedAttackCostParam = attackCostParamRepository.findOne(attackCostParam.getId());
        // Disconnect from session so that the updates on updatedAttackCostParam are not directly saved in db
        em.detach(updatedAttackCostParam);
        updatedAttackCostParam
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE);

        restAttackCostParamMockMvc.perform(put("/api/attack-cost-params")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAttackCostParam)))
            .andExpect(status().isOk());

        // Validate the AttackCostParam in the database
        List<AttackCostParam> attackCostParamList = attackCostParamRepository.findAll();
        assertThat(attackCostParamList).hasSize(databaseSizeBeforeUpdate);
        AttackCostParam testAttackCostParam = attackCostParamList.get(attackCostParamList.size() - 1);
        assertThat(testAttackCostParam.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAttackCostParam.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    public void updateNonExistingAttackCostParam() throws Exception {
        int databaseSizeBeforeUpdate = attackCostParamRepository.findAll().size();

        // Create the AttackCostParam

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAttackCostParamMockMvc.perform(put("/api/attack-cost-params")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attackCostParam)))
            .andExpect(status().isCreated());

        // Validate the AttackCostParam in the database
        List<AttackCostParam> attackCostParamList = attackCostParamRepository.findAll();
        assertThat(attackCostParamList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAttackCostParam() throws Exception {
        // Initialize the database
        attackCostParamService.save(attackCostParam);

        int databaseSizeBeforeDelete = attackCostParamRepository.findAll().size();

        // Get the attackCostParam
        restAttackCostParamMockMvc.perform(delete("/api/attack-cost-params/{id}", attackCostParam.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AttackCostParam> attackCostParamList = attackCostParamRepository.findAll();
        assertThat(attackCostParamList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttackCostParam.class);
        AttackCostParam attackCostParam1 = new AttackCostParam();
        attackCostParam1.setId(1L);
        AttackCostParam attackCostParam2 = new AttackCostParam();
        attackCostParam2.setId(attackCostParam1.getId());
        assertThat(attackCostParam1).isEqualTo(attackCostParam2);
        attackCostParam2.setId(2L);
        assertThat(attackCostParam1).isNotEqualTo(attackCostParam2);
        attackCostParam1.setId(null);
        assertThat(attackCostParam1).isNotEqualTo(attackCostParam2);
    }
}
