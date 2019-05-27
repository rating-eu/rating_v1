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

import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.repository.DirectAssetRepository;
import eu.hermeneut.service.DirectAssetService;
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
 * Test class for the DirectAssetResource REST controller.
 *
 * @see DirectAssetResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class DirectAssetResourceIntTest {

    @Autowired
    private DirectAssetRepository directAssetRepository;

    @Autowired
    private DirectAssetService directAssetService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDirectAssetMockMvc;

    private DirectAsset directAsset;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DirectAssetResource directAssetResource = new DirectAssetResource(directAssetService);
        this.restDirectAssetMockMvc = MockMvcBuilders.standaloneSetup(directAssetResource)
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
    public static DirectAsset createEntity(EntityManager em) {
        DirectAsset directAsset = new DirectAsset();
        return directAsset;
    }

    @Before
    public void initTest() {
        directAsset = createEntity(em);
    }

    @Test
    @Transactional
    public void createDirectAsset() throws Exception {
        int databaseSizeBeforeCreate = directAssetRepository.findAll().size();

        // Create the DirectAsset
        restDirectAssetMockMvc.perform(post("/api/direct-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(directAsset)))
            .andExpect(status().isCreated());

        // Validate the DirectAsset in the database
        List<DirectAsset> directAssetList = directAssetRepository.findAll();
        assertThat(directAssetList).hasSize(databaseSizeBeforeCreate + 1);
        DirectAsset testDirectAsset = directAssetList.get(directAssetList.size() - 1);
    }

    @Test
    @Transactional
    public void createDirectAssetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = directAssetRepository.findAll().size();

        // Create the DirectAsset with an existing ID
        directAsset.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDirectAssetMockMvc.perform(post("/api/direct-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(directAsset)))
            .andExpect(status().isBadRequest());

        // Validate the DirectAsset in the database
        List<DirectAsset> directAssetList = directAssetRepository.findAll();
        assertThat(directAssetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDirectAssets() throws Exception {
        // Initialize the database
        directAssetRepository.saveAndFlush(directAsset);

        // Get all the directAssetList
        restDirectAssetMockMvc.perform(get("/api/direct-assets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(directAsset.getId().intValue())));
    }

    @Test
    @Transactional
    public void getDirectAsset() throws Exception {
        // Initialize the database
        directAssetRepository.saveAndFlush(directAsset);

        // Get the directAsset
        restDirectAssetMockMvc.perform(get("/api/direct-assets/{id}", directAsset.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(directAsset.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingDirectAsset() throws Exception {
        // Get the directAsset
        restDirectAssetMockMvc.perform(get("/api/direct-assets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDirectAsset() throws Exception {
        // Initialize the database
        directAssetService.save(directAsset);

        int databaseSizeBeforeUpdate = directAssetRepository.findAll().size();

        // Update the directAsset
        DirectAsset updatedDirectAsset = directAssetRepository.findOne(directAsset.getId());
        // Disconnect from session so that the updates on updatedDirectAsset are not directly saved in db
        em.detach(updatedDirectAsset);

        restDirectAssetMockMvc.perform(put("/api/direct-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDirectAsset)))
            .andExpect(status().isOk());

        // Validate the DirectAsset in the database
        List<DirectAsset> directAssetList = directAssetRepository.findAll();
        assertThat(directAssetList).hasSize(databaseSizeBeforeUpdate);
        DirectAsset testDirectAsset = directAssetList.get(directAssetList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingDirectAsset() throws Exception {
        int databaseSizeBeforeUpdate = directAssetRepository.findAll().size();

        // Create the DirectAsset

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDirectAssetMockMvc.perform(put("/api/direct-assets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(directAsset)))
            .andExpect(status().isCreated());

        // Validate the DirectAsset in the database
        List<DirectAsset> directAssetList = directAssetRepository.findAll();
        assertThat(directAssetList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDirectAsset() throws Exception {
        // Initialize the database
        directAssetService.save(directAsset);

        int databaseSizeBeforeDelete = directAssetRepository.findAll().size();

        // Get the directAsset
        restDirectAssetMockMvc.perform(delete("/api/direct-assets/{id}", directAsset.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DirectAsset> directAssetList = directAssetRepository.findAll();
        assertThat(directAssetList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DirectAsset.class);
        DirectAsset directAsset1 = new DirectAsset();
        directAsset1.setId(1L);
        DirectAsset directAsset2 = new DirectAsset();
        directAsset2.setId(directAsset1.getId());
        assertThat(directAsset1).isEqualTo(directAsset2);
        directAsset2.setId(2L);
        assertThat(directAsset1).isNotEqualTo(directAsset2);
        directAsset1.setId(null);
        assertThat(directAsset1).isNotEqualTo(directAsset2);
    }
}
