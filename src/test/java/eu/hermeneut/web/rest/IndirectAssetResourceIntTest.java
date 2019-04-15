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

import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.repository.IndirectAssetRepository;
import eu.hermeneut.service.IndirectAssetService;
import eu.hermeneut.repository.search.IndirectAssetSearchRepository;
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
 * Test class for the IndirectAssetResource REST controller.
 *
 * @see IndirectAssetResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class IndirectAssetResourceIntTest {

    @Autowired
    private IndirectAssetRepository indirectAssetRepository;

    @Autowired
    private IndirectAssetService indirectAssetService;

    @Autowired
    private IndirectAssetSearchRepository indirectAssetSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restIndirectAssetMockMvc;

    private IndirectAsset indirectAsset;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final IndirectAssetResource indirectAssetResource = new IndirectAssetResource(indirectAssetService);
        this.restIndirectAssetMockMvc = MockMvcBuilders.standaloneSetup(indirectAssetResource)
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
    public static IndirectAsset createEntity(EntityManager em) {
        IndirectAsset indirectAsset = new IndirectAsset();
        return indirectAsset;
    }

    @Before
    public void initTest() {
        indirectAssetSearchRepository.deleteAll();
        indirectAsset = createEntity(em);
    }

    @Test
    @Transactional
    public void createIndirectAsset() throws Exception {
        int databaseSizeBeforeCreate = indirectAssetRepository.findAll().size();

        // Create the IndirectAsset
        restIndirectAssetMockMvc.perform(post("/api/indirect-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(indirectAsset)))
            .andExpect(status().isCreated());

        // Validate the IndirectAsset in the database
        List<IndirectAsset> indirectAssetList = indirectAssetRepository.findAll();
        assertThat(indirectAssetList).hasSize(databaseSizeBeforeCreate + 1);
        IndirectAsset testIndirectAsset = indirectAssetList.get(indirectAssetList.size() - 1);

        // Validate the IndirectAsset in Elasticsearch
        IndirectAsset indirectAssetEs = indirectAssetSearchRepository.findOne(testIndirectAsset.getId());
        assertThat(indirectAssetEs).isEqualToIgnoringGivenFields(testIndirectAsset);
    }

    @Test
    @Transactional
    public void createIndirectAssetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = indirectAssetRepository.findAll().size();

        // Create the IndirectAsset with an existing ID
        indirectAsset.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restIndirectAssetMockMvc.perform(post("/api/indirect-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(indirectAsset)))
            .andExpect(status().isBadRequest());

        // Validate the IndirectAsset in the database
        List<IndirectAsset> indirectAssetList = indirectAssetRepository.findAll();
        assertThat(indirectAssetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllIndirectAssets() throws Exception {
        // Initialize the database
        indirectAssetRepository.saveAndFlush(indirectAsset);

        // Get all the indirectAssetList
        restIndirectAssetMockMvc.perform(get("/api/indirect-assets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(indirectAsset.getId().intValue())));
    }

    @Test
    @Transactional
    public void getIndirectAsset() throws Exception {
        // Initialize the database
        indirectAssetRepository.saveAndFlush(indirectAsset);

        // Get the indirectAsset
        restIndirectAssetMockMvc.perform(get("/api/indirect-assets/{id}", indirectAsset.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(indirectAsset.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingIndirectAsset() throws Exception {
        // Get the indirectAsset
        restIndirectAssetMockMvc.perform(get("/api/indirect-assets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateIndirectAsset() throws Exception {
        // Initialize the database
        indirectAssetService.save(indirectAsset);

        int databaseSizeBeforeUpdate = indirectAssetRepository.findAll().size();

        // Update the indirectAsset
        IndirectAsset updatedIndirectAsset = indirectAssetRepository.findOne(indirectAsset.getId());
        // Disconnect from session so that the updates on updatedIndirectAsset are not directly saved in db
        em.detach(updatedIndirectAsset);

        restIndirectAssetMockMvc.perform(put("/api/indirect-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedIndirectAsset)))
            .andExpect(status().isOk());

        // Validate the IndirectAsset in the database
        List<IndirectAsset> indirectAssetList = indirectAssetRepository.findAll();
        assertThat(indirectAssetList).hasSize(databaseSizeBeforeUpdate);
        IndirectAsset testIndirectAsset = indirectAssetList.get(indirectAssetList.size() - 1);

        // Validate the IndirectAsset in Elasticsearch
        IndirectAsset indirectAssetEs = indirectAssetSearchRepository.findOne(testIndirectAsset.getId());
        assertThat(indirectAssetEs).isEqualToIgnoringGivenFields(testIndirectAsset);
    }

    @Test
    @Transactional
    public void updateNonExistingIndirectAsset() throws Exception {
        int databaseSizeBeforeUpdate = indirectAssetRepository.findAll().size();

        // Create the IndirectAsset

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restIndirectAssetMockMvc.perform(put("/api/indirect-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(indirectAsset)))
            .andExpect(status().isCreated());

        // Validate the IndirectAsset in the database
        List<IndirectAsset> indirectAssetList = indirectAssetRepository.findAll();
        assertThat(indirectAssetList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteIndirectAsset() throws Exception {
        // Initialize the database
        indirectAssetService.save(indirectAsset);

        int databaseSizeBeforeDelete = indirectAssetRepository.findAll().size();

        // Get the indirectAsset
        restIndirectAssetMockMvc.perform(delete("/api/indirect-assets/{id}", indirectAsset.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean indirectAssetExistsInEs = indirectAssetSearchRepository.exists(indirectAsset.getId());
        assertThat(indirectAssetExistsInEs).isFalse();

        // Validate the database is empty
        List<IndirectAsset> indirectAssetList = indirectAssetRepository.findAll();
        assertThat(indirectAssetList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchIndirectAsset() throws Exception {
        // Initialize the database
        indirectAssetService.save(indirectAsset);

        // Search the indirectAsset
        restIndirectAssetMockMvc.perform(get("/api/_search/indirect-assets?query=id:" + indirectAsset.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(indirectAsset.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IndirectAsset.class);
        IndirectAsset indirectAsset1 = new IndirectAsset();
        indirectAsset1.setId(1L);
        IndirectAsset indirectAsset2 = new IndirectAsset();
        indirectAsset2.setId(indirectAsset1.getId());
        assertThat(indirectAsset1).isEqualTo(indirectAsset2);
        indirectAsset2.setId(2L);
        assertThat(indirectAsset1).isNotEqualTo(indirectAsset2);
        indirectAsset1.setId(null);
        assertThat(indirectAsset1).isNotEqualTo(indirectAsset2);
    }
}
