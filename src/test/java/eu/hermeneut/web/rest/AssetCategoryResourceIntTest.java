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

import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.repository.AssetCategoryRepository;
import eu.hermeneut.service.AssetCategoryService;
import eu.hermeneut.repository.search.AssetCategorySearchRepository;
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

import eu.hermeneut.domain.enumeration.AssetType;
/**
 * Test class for the AssetCategoryResource REST controller.
 *
 * @see AssetCategoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class AssetCategoryResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final AssetType DEFAULT_TYPE = AssetType.TANGIBLE;
    private static final AssetType UPDATED_TYPE = AssetType.INTANGIBLE;

    @Autowired
    private AssetCategoryRepository assetCategoryRepository;

    @Autowired
    private AssetCategoryService assetCategoryService;

    @Autowired
    private AssetCategorySearchRepository assetCategorySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAssetCategoryMockMvc;

    private AssetCategory assetCategory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AssetCategoryResource assetCategoryResource = new AssetCategoryResource(assetCategoryService);
        this.restAssetCategoryMockMvc = MockMvcBuilders.standaloneSetup(assetCategoryResource)
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
    public static AssetCategory createEntity(EntityManager em) {
        AssetCategory assetCategory = new AssetCategory()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .type(DEFAULT_TYPE);
        return assetCategory;
    }

    @Before
    public void initTest() {
        assetCategorySearchRepository.deleteAll();
        assetCategory = createEntity(em);
    }

    @Test
    @Transactional
    public void createAssetCategory() throws Exception {
        int databaseSizeBeforeCreate = assetCategoryRepository.findAll().size();

        // Create the AssetCategory
        restAssetCategoryMockMvc.perform(post("/api/asset-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assetCategory)))
            .andExpect(status().isCreated());

        // Validate the AssetCategory in the database
        List<AssetCategory> assetCategoryList = assetCategoryRepository.findAll();
        assertThat(assetCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        AssetCategory testAssetCategory = assetCategoryList.get(assetCategoryList.size() - 1);
        assertThat(testAssetCategory.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAssetCategory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAssetCategory.getType()).isEqualTo(DEFAULT_TYPE);

        // Validate the AssetCategory in Elasticsearch
        AssetCategory assetCategoryEs = assetCategorySearchRepository.findOne(testAssetCategory.getId());
        assertThat(assetCategoryEs).isEqualToIgnoringGivenFields(testAssetCategory);
    }

    @Test
    @Transactional
    public void createAssetCategoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = assetCategoryRepository.findAll().size();

        // Create the AssetCategory with an existing ID
        assetCategory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssetCategoryMockMvc.perform(post("/api/asset-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assetCategory)))
            .andExpect(status().isBadRequest());

        // Validate the AssetCategory in the database
        List<AssetCategory> assetCategoryList = assetCategoryRepository.findAll();
        assertThat(assetCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = assetCategoryRepository.findAll().size();
        // set the field null
        assetCategory.setName(null);

        // Create the AssetCategory, which fails.

        restAssetCategoryMockMvc.perform(post("/api/asset-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assetCategory)))
            .andExpect(status().isBadRequest());

        List<AssetCategory> assetCategoryList = assetCategoryRepository.findAll();
        assertThat(assetCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = assetCategoryRepository.findAll().size();
        // set the field null
        assetCategory.setType(null);

        // Create the AssetCategory, which fails.

        restAssetCategoryMockMvc.perform(post("/api/asset-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assetCategory)))
            .andExpect(status().isBadRequest());

        List<AssetCategory> assetCategoryList = assetCategoryRepository.findAll();
        assertThat(assetCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAssetCategories() throws Exception {
        // Initialize the database
        assetCategoryRepository.saveAndFlush(assetCategory);

        // Get all the assetCategoryList
        restAssetCategoryMockMvc.perform(get("/api/asset-categories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(assetCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void getAssetCategory() throws Exception {
        // Initialize the database
        assetCategoryRepository.saveAndFlush(assetCategory);

        // Get the assetCategory
        restAssetCategoryMockMvc.perform(get("/api/asset-categories/{id}", assetCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(assetCategory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAssetCategory() throws Exception {
        // Get the assetCategory
        restAssetCategoryMockMvc.perform(get("/api/asset-categories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAssetCategory() throws Exception {
        // Initialize the database
        assetCategoryService.save(assetCategory);

        int databaseSizeBeforeUpdate = assetCategoryRepository.findAll().size();

        // Update the assetCategory
        AssetCategory updatedAssetCategory = assetCategoryRepository.findOne(assetCategory.getId());
        // Disconnect from session so that the updates on updatedAssetCategory are not directly saved in db
        em.detach(updatedAssetCategory);
        updatedAssetCategory
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .type(UPDATED_TYPE);

        restAssetCategoryMockMvc.perform(put("/api/asset-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAssetCategory)))
            .andExpect(status().isOk());

        // Validate the AssetCategory in the database
        List<AssetCategory> assetCategoryList = assetCategoryRepository.findAll();
        assertThat(assetCategoryList).hasSize(databaseSizeBeforeUpdate);
        AssetCategory testAssetCategory = assetCategoryList.get(assetCategoryList.size() - 1);
        assertThat(testAssetCategory.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAssetCategory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAssetCategory.getType()).isEqualTo(UPDATED_TYPE);

        // Validate the AssetCategory in Elasticsearch
        AssetCategory assetCategoryEs = assetCategorySearchRepository.findOne(testAssetCategory.getId());
        assertThat(assetCategoryEs).isEqualToIgnoringGivenFields(testAssetCategory);
    }

    @Test
    @Transactional
    public void updateNonExistingAssetCategory() throws Exception {
        int databaseSizeBeforeUpdate = assetCategoryRepository.findAll().size();

        // Create the AssetCategory

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAssetCategoryMockMvc.perform(put("/api/asset-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assetCategory)))
            .andExpect(status().isCreated());

        // Validate the AssetCategory in the database
        List<AssetCategory> assetCategoryList = assetCategoryRepository.findAll();
        assertThat(assetCategoryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAssetCategory() throws Exception {
        // Initialize the database
        assetCategoryService.save(assetCategory);

        int databaseSizeBeforeDelete = assetCategoryRepository.findAll().size();

        // Get the assetCategory
        restAssetCategoryMockMvc.perform(delete("/api/asset-categories/{id}", assetCategory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean assetCategoryExistsInEs = assetCategorySearchRepository.exists(assetCategory.getId());
        assertThat(assetCategoryExistsInEs).isFalse();

        // Validate the database is empty
        List<AssetCategory> assetCategoryList = assetCategoryRepository.findAll();
        assertThat(assetCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchAssetCategory() throws Exception {
        // Initialize the database
        assetCategoryService.save(assetCategory);

        // Search the assetCategory
        restAssetCategoryMockMvc.perform(get("/api/_search/asset-categories?query=id:" + assetCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(assetCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AssetCategory.class);
        AssetCategory assetCategory1 = new AssetCategory();
        assetCategory1.setId(1L);
        AssetCategory assetCategory2 = new AssetCategory();
        assetCategory2.setId(assetCategory1.getId());
        assertThat(assetCategory1).isEqualTo(assetCategory2);
        assetCategory2.setId(2L);
        assertThat(assetCategory1).isNotEqualTo(assetCategory2);
        assetCategory1.setId(null);
        assertThat(assetCategory1).isNotEqualTo(assetCategory2);
    }
}
