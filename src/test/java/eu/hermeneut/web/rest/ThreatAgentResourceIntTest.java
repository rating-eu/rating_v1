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

import eu.hermeneut.domain.ThreatAgent;
import eu.hermeneut.repository.ThreatAgentRepository;
import eu.hermeneut.service.ThreatAgentService;
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
import org.springframework.util.Base64Utils;

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

import eu.hermeneut.domain.enumeration.SkillLevel;
import eu.hermeneut.domain.enumeration.Intent;
import eu.hermeneut.domain.enumeration.TA_Access;
/**
 * Test class for the ThreatAgentResource REST controller.
 *
 * @see ThreatAgentResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class ThreatAgentResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final SkillLevel DEFAULT_SKILL_LEVEL = SkillLevel.HIGH;
    private static final SkillLevel UPDATED_SKILL_LEVEL = SkillLevel.MEDIUM;

    private static final Intent DEFAULT_INTENT = Intent.HOSTILE;
    private static final Intent UPDATED_INTENT = Intent.NON_HOSTILE;

    private static final TA_Access DEFAULT_ACCESS = TA_Access.INSIDER;
    private static final TA_Access UPDATED_ACCESS = TA_Access.OUTSIDER;

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_IDENTIFIED_BY_DEFAULT = false;
    private static final Boolean UPDATED_IDENTIFIED_BY_DEFAULT = true;

    @Autowired
    private ThreatAgentRepository threatAgentRepository;

    @Autowired
    private ThreatAgentService threatAgentService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restThreatAgentMockMvc;

    private ThreatAgent threatAgent;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ThreatAgentResource threatAgentResource = new ThreatAgentResource(threatAgentService);
        this.restThreatAgentMockMvc = MockMvcBuilders.standaloneSetup(threatAgentResource)
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
    public static ThreatAgent createEntity(EntityManager em) {
        ThreatAgent threatAgent = new ThreatAgent()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .skillLevel(DEFAULT_SKILL_LEVEL)
            .intent(DEFAULT_INTENT)
            .access(DEFAULT_ACCESS)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED)
            .identifiedByDefault(DEFAULT_IDENTIFIED_BY_DEFAULT);
        return threatAgent;
    }

    @Before
    public void initTest() {
        threatAgent = createEntity(em);
    }

    @Test
    @Transactional
    public void createThreatAgent() throws Exception {
        int databaseSizeBeforeCreate = threatAgentRepository.findAll().size();

        // Create the ThreatAgent
        restThreatAgentMockMvc.perform(post("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isCreated());

        // Validate the ThreatAgent in the database
        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeCreate + 1);
        ThreatAgent testThreatAgent = threatAgentList.get(threatAgentList.size() - 1);
        assertThat(testThreatAgent.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testThreatAgent.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testThreatAgent.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testThreatAgent.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testThreatAgent.getSkillLevel()).isEqualTo(DEFAULT_SKILL_LEVEL);
        assertThat(testThreatAgent.getIntent()).isEqualTo(DEFAULT_INTENT);
        assertThat(testThreatAgent.getAccess()).isEqualTo(DEFAULT_ACCESS);
        assertThat(testThreatAgent.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testThreatAgent.getModified()).isEqualTo(DEFAULT_MODIFIED);
        assertThat(testThreatAgent.isIdentifiedByDefault()).isEqualTo(DEFAULT_IDENTIFIED_BY_DEFAULT);
    }

    @Test
    @Transactional
    public void createThreatAgentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = threatAgentRepository.findAll().size();

        // Create the ThreatAgent with an existing ID
        threatAgent.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restThreatAgentMockMvc.perform(post("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isBadRequest());

        // Validate the ThreatAgent in the database
        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = threatAgentRepository.findAll().size();
        // set the field null
        threatAgent.setName(null);

        // Create the ThreatAgent, which fails.

        restThreatAgentMockMvc.perform(post("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isBadRequest());

        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = threatAgentRepository.findAll().size();
        // set the field null
        threatAgent.setDescription(null);

        // Create the ThreatAgent, which fails.

        restThreatAgentMockMvc.perform(post("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isBadRequest());

        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSkillLevelIsRequired() throws Exception {
        int databaseSizeBeforeTest = threatAgentRepository.findAll().size();
        // set the field null
        threatAgent.setSkillLevel(null);

        // Create the ThreatAgent, which fails.

        restThreatAgentMockMvc.perform(post("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isBadRequest());

        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkIntentIsRequired() throws Exception {
        int databaseSizeBeforeTest = threatAgentRepository.findAll().size();
        // set the field null
        threatAgent.setIntent(null);

        // Create the ThreatAgent, which fails.

        restThreatAgentMockMvc.perform(post("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isBadRequest());

        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAccessIsRequired() throws Exception {
        int databaseSizeBeforeTest = threatAgentRepository.findAll().size();
        // set the field null
        threatAgent.setAccess(null);

        // Create the ThreatAgent, which fails.

        restThreatAgentMockMvc.perform(post("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isBadRequest());

        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkIdentifiedByDefaultIsRequired() throws Exception {
        int databaseSizeBeforeTest = threatAgentRepository.findAll().size();
        // set the field null
        threatAgent.setIdentifiedByDefault(null);

        // Create the ThreatAgent, which fails.

        restThreatAgentMockMvc.perform(post("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isBadRequest());

        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllThreatAgents() throws Exception {
        // Initialize the database
        threatAgentRepository.saveAndFlush(threatAgent);

        // Get all the threatAgentList
        restThreatAgentMockMvc.perform(get("/api/threat-agents?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(threatAgent.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].skillLevel").value(hasItem(DEFAULT_SKILL_LEVEL.toString())))
            .andExpect(jsonPath("$.[*].intent").value(hasItem(DEFAULT_INTENT.toString())))
            .andExpect(jsonPath("$.[*].access").value(hasItem(DEFAULT_ACCESS.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))))
            .andExpect(jsonPath("$.[*].identifiedByDefault").value(hasItem(DEFAULT_IDENTIFIED_BY_DEFAULT.booleanValue())));
    }

    @Test
    @Transactional
    public void getThreatAgent() throws Exception {
        // Initialize the database
        threatAgentRepository.saveAndFlush(threatAgent);

        // Get the threatAgent
        restThreatAgentMockMvc.perform(get("/api/threat-agents/{id}", threatAgent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(threatAgent.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.skillLevel").value(DEFAULT_SKILL_LEVEL.toString()))
            .andExpect(jsonPath("$.intent").value(DEFAULT_INTENT.toString()))
            .andExpect(jsonPath("$.access").value(DEFAULT_ACCESS.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)))
            .andExpect(jsonPath("$.identifiedByDefault").value(DEFAULT_IDENTIFIED_BY_DEFAULT.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingThreatAgent() throws Exception {
        // Get the threatAgent
        restThreatAgentMockMvc.perform(get("/api/threat-agents/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateThreatAgent() throws Exception {
        // Initialize the database
        threatAgentService.save(threatAgent);

        int databaseSizeBeforeUpdate = threatAgentRepository.findAll().size();

        // Update the threatAgent
        ThreatAgent updatedThreatAgent = threatAgentRepository.findOne(threatAgent.getId());
        // Disconnect from session so that the updates on updatedThreatAgent are not directly saved in db
        em.detach(updatedThreatAgent);
        updatedThreatAgent
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .skillLevel(UPDATED_SKILL_LEVEL)
            .intent(UPDATED_INTENT)
            .access(UPDATED_ACCESS)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .identifiedByDefault(UPDATED_IDENTIFIED_BY_DEFAULT);

        restThreatAgentMockMvc.perform(put("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedThreatAgent)))
            .andExpect(status().isOk());

        // Validate the ThreatAgent in the database
        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeUpdate);
        ThreatAgent testThreatAgent = threatAgentList.get(threatAgentList.size() - 1);
        assertThat(testThreatAgent.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testThreatAgent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testThreatAgent.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testThreatAgent.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testThreatAgent.getSkillLevel()).isEqualTo(UPDATED_SKILL_LEVEL);
        assertThat(testThreatAgent.getIntent()).isEqualTo(UPDATED_INTENT);
        assertThat(testThreatAgent.getAccess()).isEqualTo(UPDATED_ACCESS);
        assertThat(testThreatAgent.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testThreatAgent.getModified()).isEqualTo(UPDATED_MODIFIED);
        assertThat(testThreatAgent.isIdentifiedByDefault()).isEqualTo(UPDATED_IDENTIFIED_BY_DEFAULT);
    }

    @Test
    @Transactional
    public void updateNonExistingThreatAgent() throws Exception {
        int databaseSizeBeforeUpdate = threatAgentRepository.findAll().size();

        // Create the ThreatAgent

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restThreatAgentMockMvc.perform(put("/api/threat-agents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(threatAgent)))
            .andExpect(status().isCreated());

        // Validate the ThreatAgent in the database
        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteThreatAgent() throws Exception {
        // Initialize the database
        threatAgentService.save(threatAgent);

        int databaseSizeBeforeDelete = threatAgentRepository.findAll().size();

        // Get the threatAgent
        restThreatAgentMockMvc.perform(delete("/api/threat-agents/{id}", threatAgent.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ThreatAgent> threatAgentList = threatAgentRepository.findAll();
        assertThat(threatAgentList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ThreatAgent.class);
        ThreatAgent threatAgent1 = new ThreatAgent();
        threatAgent1.setId(1L);
        ThreatAgent threatAgent2 = new ThreatAgent();
        threatAgent2.setId(threatAgent1.getId());
        assertThat(threatAgent1).isEqualTo(threatAgent2);
        threatAgent2.setId(2L);
        assertThat(threatAgent1).isNotEqualTo(threatAgent2);
        threatAgent1.setId(null);
        assertThat(threatAgent1).isNotEqualTo(threatAgent2);
    }
}
