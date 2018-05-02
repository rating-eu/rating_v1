package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.LevelWrapper;
import eu.hermeneut.repository.LevelWrapperRepository;
import eu.hermeneut.service.LevelWrapperService;
import eu.hermeneut.repository.search.LevelWrapperSearchRepository;
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

import eu.hermeneut.domain.enumeration.Level;
/**
 * Test class for the LevelWrapperResource REST controller.
 *
 * @see LevelWrapperResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class LevelWrapperResourceIntTest {

    private static final Level DEFAULT_LEVEL = Level.HUMAN;
    private static final Level UPDATED_LEVEL = Level.IT;

    @Autowired
    private LevelWrapperRepository levelWrapperRepository;

    @Autowired
    private LevelWrapperService levelWrapperService;

    @Autowired
    private LevelWrapperSearchRepository levelWrapperSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLevelWrapperMockMvc;

    private LevelWrapper levelWrapper;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LevelWrapperResource levelWrapperResource = new LevelWrapperResource(levelWrapperService);
        this.restLevelWrapperMockMvc = MockMvcBuilders.standaloneSetup(levelWrapperResource)
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
    public static LevelWrapper createEntity(EntityManager em) {
        LevelWrapper levelWrapper = new LevelWrapper()
            .level(DEFAULT_LEVEL);
        return levelWrapper;
    }

    @Before
    public void initTest() {
        levelWrapperSearchRepository.deleteAll();
        levelWrapper = createEntity(em);
    }

    @Test
    @Transactional
    public void createLevelWrapper() throws Exception {
        int databaseSizeBeforeCreate = levelWrapperRepository.findAll().size();

        // Create the LevelWrapper
        restLevelWrapperMockMvc.perform(post("/api/level-wrappers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(levelWrapper)))
            .andExpect(status().isCreated());

        // Validate the LevelWrapper in the database
        List<LevelWrapper> levelWrapperList = levelWrapperRepository.findAll();
        assertThat(levelWrapperList).hasSize(databaseSizeBeforeCreate + 1);
        LevelWrapper testLevelWrapper = levelWrapperList.get(levelWrapperList.size() - 1);
        assertThat(testLevelWrapper.getLevel()).isEqualTo(DEFAULT_LEVEL);

        // Validate the LevelWrapper in Elasticsearch
        LevelWrapper levelWrapperEs = levelWrapperSearchRepository.findOne(testLevelWrapper.getId());
        assertThat(levelWrapperEs).isEqualToIgnoringGivenFields(testLevelWrapper);
    }

    @Test
    @Transactional
    public void createLevelWrapperWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = levelWrapperRepository.findAll().size();

        // Create the LevelWrapper with an existing ID
        levelWrapper.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLevelWrapperMockMvc.perform(post("/api/level-wrappers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(levelWrapper)))
            .andExpect(status().isBadRequest());

        // Validate the LevelWrapper in the database
        List<LevelWrapper> levelWrapperList = levelWrapperRepository.findAll();
        assertThat(levelWrapperList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllLevelWrappers() throws Exception {
        // Initialize the database
        levelWrapperRepository.saveAndFlush(levelWrapper);

        // Get all the levelWrapperList
        restLevelWrapperMockMvc.perform(get("/api/level-wrappers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(levelWrapper.getId().intValue())))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.toString())));
    }

    @Test
    @Transactional
    public void getLevelWrapper() throws Exception {
        // Initialize the database
        levelWrapperRepository.saveAndFlush(levelWrapper);

        // Get the levelWrapper
        restLevelWrapperMockMvc.perform(get("/api/level-wrappers/{id}", levelWrapper.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(levelWrapper.getId().intValue()))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLevelWrapper() throws Exception {
        // Get the levelWrapper
        restLevelWrapperMockMvc.perform(get("/api/level-wrappers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLevelWrapper() throws Exception {
        // Initialize the database
        levelWrapperService.save(levelWrapper);

        int databaseSizeBeforeUpdate = levelWrapperRepository.findAll().size();

        // Update the levelWrapper
        LevelWrapper updatedLevelWrapper = levelWrapperRepository.findOne(levelWrapper.getId());
        // Disconnect from session so that the updates on updatedLevelWrapper are not directly saved in db
        em.detach(updatedLevelWrapper);
        updatedLevelWrapper
            .level(UPDATED_LEVEL);

        restLevelWrapperMockMvc.perform(put("/api/level-wrappers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLevelWrapper)))
            .andExpect(status().isOk());

        // Validate the LevelWrapper in the database
        List<LevelWrapper> levelWrapperList = levelWrapperRepository.findAll();
        assertThat(levelWrapperList).hasSize(databaseSizeBeforeUpdate);
        LevelWrapper testLevelWrapper = levelWrapperList.get(levelWrapperList.size() - 1);
        assertThat(testLevelWrapper.getLevel()).isEqualTo(UPDATED_LEVEL);

        // Validate the LevelWrapper in Elasticsearch
        LevelWrapper levelWrapperEs = levelWrapperSearchRepository.findOne(testLevelWrapper.getId());
        assertThat(levelWrapperEs).isEqualToIgnoringGivenFields(testLevelWrapper);
    }

    @Test
    @Transactional
    public void updateNonExistingLevelWrapper() throws Exception {
        int databaseSizeBeforeUpdate = levelWrapperRepository.findAll().size();

        // Create the LevelWrapper

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLevelWrapperMockMvc.perform(put("/api/level-wrappers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(levelWrapper)))
            .andExpect(status().isCreated());

        // Validate the LevelWrapper in the database
        List<LevelWrapper> levelWrapperList = levelWrapperRepository.findAll();
        assertThat(levelWrapperList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLevelWrapper() throws Exception {
        // Initialize the database
        levelWrapperService.save(levelWrapper);

        int databaseSizeBeforeDelete = levelWrapperRepository.findAll().size();

        // Get the levelWrapper
        restLevelWrapperMockMvc.perform(delete("/api/level-wrappers/{id}", levelWrapper.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean levelWrapperExistsInEs = levelWrapperSearchRepository.exists(levelWrapper.getId());
        assertThat(levelWrapperExistsInEs).isFalse();

        // Validate the database is empty
        List<LevelWrapper> levelWrapperList = levelWrapperRepository.findAll();
        assertThat(levelWrapperList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchLevelWrapper() throws Exception {
        // Initialize the database
        levelWrapperService.save(levelWrapper);

        // Search the levelWrapper
        restLevelWrapperMockMvc.perform(get("/api/_search/level-wrappers?query=id:" + levelWrapper.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(levelWrapper.getId().intValue())))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LevelWrapper.class);
        LevelWrapper levelWrapper1 = new LevelWrapper();
        levelWrapper1.setId(1L);
        LevelWrapper levelWrapper2 = new LevelWrapper();
        levelWrapper2.setId(levelWrapper1.getId());
        assertThat(levelWrapper1).isEqualTo(levelWrapper2);
        levelWrapper2.setId(2L);
        assertThat(levelWrapper1).isNotEqualTo(levelWrapper2);
        levelWrapper1.setId(null);
        assertThat(levelWrapper1).isNotEqualTo(levelWrapper2);
    }
}
