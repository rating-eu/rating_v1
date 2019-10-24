package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.SystemConfig;
import eu.hermeneut.repository.SystemConfigRepository;
import eu.hermeneut.service.SystemConfigService;
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

import eu.hermeneut.domain.enumeration.ConfigKey;
/**
 * Test class for the SystemConfigResource REST controller.
 *
 * @see SystemConfigResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class SystemConfigResourceIntTest {

    private static final ConfigKey DEFAULT_KEY = ConfigKey.SERVICE_EMAIL;
    private static final ConfigKey UPDATED_KEY = ConfigKey.SERVICE_EMAIL;

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @Autowired
    private SystemConfigService systemConfigService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSystemConfigMockMvc;

    private SystemConfig systemConfig;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SystemConfigResource systemConfigResource = new SystemConfigResource(systemConfigService);
        this.restSystemConfigMockMvc = MockMvcBuilders.standaloneSetup(systemConfigResource)
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
    public static SystemConfig createEntity(EntityManager em) {
        SystemConfig systemConfig = new SystemConfig()
            .key(DEFAULT_KEY)
            .value(DEFAULT_VALUE);
        return systemConfig;
    }

    @Before
    public void initTest() {
        systemConfig = createEntity(em);
    }

    @Test
    @Transactional
    public void createSystemConfig() throws Exception {
        int databaseSizeBeforeCreate = systemConfigRepository.findAll().size();

        // Create the SystemConfig
        restSystemConfigMockMvc.perform(post("/api/system-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemConfig)))
            .andExpect(status().isCreated());

        // Validate the SystemConfig in the database
        List<SystemConfig> systemConfigList = systemConfigRepository.findAll();
        assertThat(systemConfigList).hasSize(databaseSizeBeforeCreate + 1);
        SystemConfig testSystemConfig = systemConfigList.get(systemConfigList.size() - 1);
        assertThat(testSystemConfig.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testSystemConfig.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    public void createSystemConfigWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = systemConfigRepository.findAll().size();

        // Create the SystemConfig with an existing ID
        systemConfig.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSystemConfigMockMvc.perform(post("/api/system-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemConfig)))
            .andExpect(status().isBadRequest());

        // Validate the SystemConfig in the database
        List<SystemConfig> systemConfigList = systemConfigRepository.findAll();
        assertThat(systemConfigList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkKeyIsRequired() throws Exception {
        int databaseSizeBeforeTest = systemConfigRepository.findAll().size();
        // set the field null
        systemConfig.setKey(null);

        // Create the SystemConfig, which fails.

        restSystemConfigMockMvc.perform(post("/api/system-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemConfig)))
            .andExpect(status().isBadRequest());

        List<SystemConfig> systemConfigList = systemConfigRepository.findAll();
        assertThat(systemConfigList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = systemConfigRepository.findAll().size();
        // set the field null
        systemConfig.setValue(null);

        // Create the SystemConfig, which fails.

        restSystemConfigMockMvc.perform(post("/api/system-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemConfig)))
            .andExpect(status().isBadRequest());

        List<SystemConfig> systemConfigList = systemConfigRepository.findAll();
        assertThat(systemConfigList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSystemConfigs() throws Exception {
        // Initialize the database
        systemConfigRepository.saveAndFlush(systemConfig);

        // Get all the systemConfigList
        restSystemConfigMockMvc.perform(get("/api/system-configs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(systemConfig.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.toString())));
    }

    @Test
    @Transactional
    public void getSystemConfig() throws Exception {
        // Initialize the database
        systemConfigRepository.saveAndFlush(systemConfig);

        // Get the systemConfig
        restSystemConfigMockMvc.perform(get("/api/system-configs/{id}", systemConfig.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(systemConfig.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSystemConfig() throws Exception {
        // Get the systemConfig
        restSystemConfigMockMvc.perform(get("/api/system-configs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSystemConfig() throws Exception {
        // Initialize the database
        systemConfigService.save(systemConfig);

        int databaseSizeBeforeUpdate = systemConfigRepository.findAll().size();

        // Update the systemConfig
        SystemConfig updatedSystemConfig = systemConfigRepository.findOne(systemConfig.getId());
        // Disconnect from session so that the updates on updatedSystemConfig are not directly saved in db
        em.detach(updatedSystemConfig);
        updatedSystemConfig
            .key(UPDATED_KEY)
            .value(UPDATED_VALUE);

        restSystemConfigMockMvc.perform(put("/api/system-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSystemConfig)))
            .andExpect(status().isOk());

        // Validate the SystemConfig in the database
        List<SystemConfig> systemConfigList = systemConfigRepository.findAll();
        assertThat(systemConfigList).hasSize(databaseSizeBeforeUpdate);
        SystemConfig testSystemConfig = systemConfigList.get(systemConfigList.size() - 1);
        assertThat(testSystemConfig.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testSystemConfig.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    public void updateNonExistingSystemConfig() throws Exception {
        int databaseSizeBeforeUpdate = systemConfigRepository.findAll().size();

        // Create the SystemConfig

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSystemConfigMockMvc.perform(put("/api/system-configs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemConfig)))
            .andExpect(status().isCreated());

        // Validate the SystemConfig in the database
        List<SystemConfig> systemConfigList = systemConfigRepository.findAll();
        assertThat(systemConfigList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSystemConfig() throws Exception {
        // Initialize the database
        systemConfigService.save(systemConfig);

        int databaseSizeBeforeDelete = systemConfigRepository.findAll().size();

        // Get the systemConfig
        restSystemConfigMockMvc.perform(delete("/api/system-configs/{id}", systemConfig.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SystemConfig> systemConfigList = systemConfigRepository.findAll();
        assertThat(systemConfigList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SystemConfig.class);
        SystemConfig systemConfig1 = new SystemConfig();
        systemConfig1.setId(1L);
        SystemConfig systemConfig2 = new SystemConfig();
        systemConfig2.setId(systemConfig1.getId());
        assertThat(systemConfig1).isEqualTo(systemConfig2);
        systemConfig2.setId(2L);
        assertThat(systemConfig1).isNotEqualTo(systemConfig2);
        systemConfig1.setId(null);
        assertThat(systemConfig1).isNotEqualTo(systemConfig2);
    }
}
