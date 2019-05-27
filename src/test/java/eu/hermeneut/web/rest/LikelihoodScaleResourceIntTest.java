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

import eu.hermeneut.domain.LikelihoodScale;
import eu.hermeneut.repository.LikelihoodScaleRepository;
import eu.hermeneut.service.LikelihoodScaleService;
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
 * Test class for the LikelihoodScaleResource REST controller.
 *
 * @see LikelihoodScaleResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class LikelihoodScaleResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_LIKELIHOOD = 1;
    private static final Integer UPDATED_LIKELIHOOD = 2;

    private static final Integer DEFAULT_FREQUENCY = 1;
    private static final Integer UPDATED_FREQUENCY = 2;

    @Autowired
    private LikelihoodScaleRepository likelihoodScaleRepository;

    @Autowired
    private LikelihoodScaleService likelihoodScaleService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLikelihoodScaleMockMvc;

    private LikelihoodScale likelihoodScale;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LikelihoodScaleResource likelihoodScaleResource = new LikelihoodScaleResource(likelihoodScaleService);
        this.restLikelihoodScaleMockMvc = MockMvcBuilders.standaloneSetup(likelihoodScaleResource)
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
    public static LikelihoodScale createEntity(EntityManager em) {
        LikelihoodScale likelihoodScale = new LikelihoodScale()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .likelihood(DEFAULT_LIKELIHOOD)
            .frequency(DEFAULT_FREQUENCY);
        return likelihoodScale;
    }

    @Before
    public void initTest() {
        likelihoodScale = createEntity(em);
    }

    @Test
    @Transactional
    public void createLikelihoodScale() throws Exception {
        int databaseSizeBeforeCreate = likelihoodScaleRepository.findAll().size();

        // Create the LikelihoodScale
        restLikelihoodScaleMockMvc.perform(post("/api/likelihood-scales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodScale)))
            .andExpect(status().isCreated());

        // Validate the LikelihoodScale in the database
        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeCreate + 1);
        LikelihoodScale testLikelihoodScale = likelihoodScaleList.get(likelihoodScaleList.size() - 1);
        assertThat(testLikelihoodScale.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLikelihoodScale.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLikelihoodScale.getLikelihood()).isEqualTo(DEFAULT_LIKELIHOOD);
        assertThat(testLikelihoodScale.getFrequency()).isEqualTo(DEFAULT_FREQUENCY);
    }

    @Test
    @Transactional
    public void createLikelihoodScaleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = likelihoodScaleRepository.findAll().size();

        // Create the LikelihoodScale with an existing ID
        likelihoodScale.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLikelihoodScaleMockMvc.perform(post("/api/likelihood-scales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodScale)))
            .andExpect(status().isBadRequest());

        // Validate the LikelihoodScale in the database
        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = likelihoodScaleRepository.findAll().size();
        // set the field null
        likelihoodScale.setName(null);

        // Create the LikelihoodScale, which fails.

        restLikelihoodScaleMockMvc.perform(post("/api/likelihood-scales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodScale)))
            .andExpect(status().isBadRequest());

        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = likelihoodScaleRepository.findAll().size();
        // set the field null
        likelihoodScale.setDescription(null);

        // Create the LikelihoodScale, which fails.

        restLikelihoodScaleMockMvc.perform(post("/api/likelihood-scales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodScale)))
            .andExpect(status().isBadRequest());

        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLikelihoodIsRequired() throws Exception {
        int databaseSizeBeforeTest = likelihoodScaleRepository.findAll().size();
        // set the field null
        likelihoodScale.setLikelihood(null);

        // Create the LikelihoodScale, which fails.

        restLikelihoodScaleMockMvc.perform(post("/api/likelihood-scales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodScale)))
            .andExpect(status().isBadRequest());

        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkFrequencyIsRequired() throws Exception {
        int databaseSizeBeforeTest = likelihoodScaleRepository.findAll().size();
        // set the field null
        likelihoodScale.setFrequency(null);

        // Create the LikelihoodScale, which fails.

        restLikelihoodScaleMockMvc.perform(post("/api/likelihood-scales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodScale)))
            .andExpect(status().isBadRequest());

        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLikelihoodScales() throws Exception {
        // Initialize the database
        likelihoodScaleRepository.saveAndFlush(likelihoodScale);

        // Get all the likelihoodScaleList
        restLikelihoodScaleMockMvc.perform(get("/api/likelihood-scales?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(likelihoodScale.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].likelihood").value(hasItem(DEFAULT_LIKELIHOOD)))
            .andExpect(jsonPath("$.[*].frequency").value(hasItem(DEFAULT_FREQUENCY)));
    }

    @Test
    @Transactional
    public void getLikelihoodScale() throws Exception {
        // Initialize the database
        likelihoodScaleRepository.saveAndFlush(likelihoodScale);

        // Get the likelihoodScale
        restLikelihoodScaleMockMvc.perform(get("/api/likelihood-scales/{id}", likelihoodScale.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(likelihoodScale.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.likelihood").value(DEFAULT_LIKELIHOOD))
            .andExpect(jsonPath("$.frequency").value(DEFAULT_FREQUENCY));
    }

    @Test
    @Transactional
    public void getNonExistingLikelihoodScale() throws Exception {
        // Get the likelihoodScale
        restLikelihoodScaleMockMvc.perform(get("/api/likelihood-scales/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLikelihoodScale() throws Exception {
        // Initialize the database
        likelihoodScaleService.save(likelihoodScale);

        int databaseSizeBeforeUpdate = likelihoodScaleRepository.findAll().size();

        // Update the likelihoodScale
        LikelihoodScale updatedLikelihoodScale = likelihoodScaleRepository.findOne(likelihoodScale.getId());
        // Disconnect from session so that the updates on updatedLikelihoodScale are not directly saved in db
        em.detach(updatedLikelihoodScale);
        updatedLikelihoodScale
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .likelihood(UPDATED_LIKELIHOOD)
            .frequency(UPDATED_FREQUENCY);

        restLikelihoodScaleMockMvc.perform(put("/api/likelihood-scales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLikelihoodScale)))
            .andExpect(status().isOk());

        // Validate the LikelihoodScale in the database
        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeUpdate);
        LikelihoodScale testLikelihoodScale = likelihoodScaleList.get(likelihoodScaleList.size() - 1);
        assertThat(testLikelihoodScale.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLikelihoodScale.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLikelihoodScale.getLikelihood()).isEqualTo(UPDATED_LIKELIHOOD);
        assertThat(testLikelihoodScale.getFrequency()).isEqualTo(UPDATED_FREQUENCY);
    }

    @Test
    @Transactional
    public void updateNonExistingLikelihoodScale() throws Exception {
        int databaseSizeBeforeUpdate = likelihoodScaleRepository.findAll().size();

        // Create the LikelihoodScale

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLikelihoodScaleMockMvc.perform(put("/api/likelihood-scales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(likelihoodScale)))
            .andExpect(status().isCreated());

        // Validate the LikelihoodScale in the database
        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLikelihoodScale() throws Exception {
        // Initialize the database
        likelihoodScaleService.save(likelihoodScale);

        int databaseSizeBeforeDelete = likelihoodScaleRepository.findAll().size();

        // Get the likelihoodScale
        restLikelihoodScaleMockMvc.perform(delete("/api/likelihood-scales/{id}", likelihoodScale.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LikelihoodScale> likelihoodScaleList = likelihoodScaleRepository.findAll();
        assertThat(likelihoodScaleList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LikelihoodScale.class);
        LikelihoodScale likelihoodScale1 = new LikelihoodScale();
        likelihoodScale1.setId(1L);
        LikelihoodScale likelihoodScale2 = new LikelihoodScale();
        likelihoodScale2.setId(likelihoodScale1.getId());
        assertThat(likelihoodScale1).isEqualTo(likelihoodScale2);
        likelihoodScale2.setId(2L);
        assertThat(likelihoodScale1).isNotEqualTo(likelihoodScale2);
        likelihoodScale1.setId(null);
        assertThat(likelihoodScale1).isNotEqualTo(likelihoodScale2);
    }
}
