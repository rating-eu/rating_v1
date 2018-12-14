package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.Logo;
import eu.hermeneut.repository.LogoRepository;
import eu.hermeneut.service.LogoService;
import eu.hermeneut.repository.search.LogoSearchRepository;
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
import java.util.List;

import static eu.hermeneut.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the LogoResource REST controller.
 *
 * @see LogoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class LogoResourceIntTest {

    private static final Boolean DEFAULT_PRIMARY = false;
    private static final Boolean UPDATED_PRIMARY = true;

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    @Autowired
    private LogoRepository logoRepository;

    @Autowired
    private LogoService logoService;

    @Autowired
    private LogoSearchRepository logoSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLogoMockMvc;

    private Logo logo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LogoResource logoResource = new LogoResource(logoService);
        this.restLogoMockMvc = MockMvcBuilders.standaloneSetup(logoResource)
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
    public static Logo createEntity(EntityManager em) {
        Logo logo = new Logo()
            .primary(DEFAULT_PRIMARY)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return logo;
    }

    @Before
    public void initTest() {
        logoSearchRepository.deleteAll();
        logo = createEntity(em);
    }

    @Test
    @Transactional
    public void createLogo() throws Exception {
        int databaseSizeBeforeCreate = logoRepository.findAll().size();

        // Create the Logo
        restLogoMockMvc.perform(post("/api/logos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(logo)))
            .andExpect(status().isCreated());

        // Validate the Logo in the database
        List<Logo> logoList = logoRepository.findAll();
        assertThat(logoList).hasSize(databaseSizeBeforeCreate + 1);
        Logo testLogo = logoList.get(logoList.size() - 1);
        assertThat(testLogo.isPrimary()).isEqualTo(DEFAULT_PRIMARY);
        assertThat(testLogo.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testLogo.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);

        // Validate the Logo in Elasticsearch
        Logo logoEs = logoSearchRepository.findOne(testLogo.getId());
        assertThat(logoEs).isEqualToIgnoringGivenFields(testLogo);
    }

    @Test
    @Transactional
    public void createLogoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = logoRepository.findAll().size();

        // Create the Logo with an existing ID
        logo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLogoMockMvc.perform(post("/api/logos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(logo)))
            .andExpect(status().isBadRequest());

        // Validate the Logo in the database
        List<Logo> logoList = logoRepository.findAll();
        assertThat(logoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkImageIsRequired() throws Exception {
        int databaseSizeBeforeTest = logoRepository.findAll().size();
        // set the field null
        logo.setImage(null);

        // Create the Logo, which fails.

        restLogoMockMvc.perform(post("/api/logos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(logo)))
            .andExpect(status().isBadRequest());

        List<Logo> logoList = logoRepository.findAll();
        assertThat(logoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLogos() throws Exception {
        // Initialize the database
        logoRepository.saveAndFlush(logo);

        // Get all the logoList
        restLogoMockMvc.perform(get("/api/logos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(logo.getId().intValue())))
            .andExpect(jsonPath("$.[*].primary").value(hasItem(DEFAULT_PRIMARY.booleanValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void getLogo() throws Exception {
        // Initialize the database
        logoRepository.saveAndFlush(logo);

        // Get the logo
        restLogoMockMvc.perform(get("/api/logos/{id}", logo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(logo.getId().intValue()))
            .andExpect(jsonPath("$.primary").value(DEFAULT_PRIMARY.booleanValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    public void getNonExistingLogo() throws Exception {
        // Get the logo
        restLogoMockMvc.perform(get("/api/logos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLogo() throws Exception {
        // Initialize the database
        logoService.save(logo);

        int databaseSizeBeforeUpdate = logoRepository.findAll().size();

        // Update the logo
        Logo updatedLogo = logoRepository.findOne(logo.getId());
        // Disconnect from session so that the updates on updatedLogo are not directly saved in db
        em.detach(updatedLogo);
        updatedLogo
            .primary(UPDATED_PRIMARY)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restLogoMockMvc.perform(put("/api/logos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLogo)))
            .andExpect(status().isOk());

        // Validate the Logo in the database
        List<Logo> logoList = logoRepository.findAll();
        assertThat(logoList).hasSize(databaseSizeBeforeUpdate);
        Logo testLogo = logoList.get(logoList.size() - 1);
        assertThat(testLogo.isPrimary()).isEqualTo(UPDATED_PRIMARY);
        assertThat(testLogo.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testLogo.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);

        // Validate the Logo in Elasticsearch
        Logo logoEs = logoSearchRepository.findOne(testLogo.getId());
        assertThat(logoEs).isEqualToIgnoringGivenFields(testLogo);
    }

    @Test
    @Transactional
    public void updateNonExistingLogo() throws Exception {
        int databaseSizeBeforeUpdate = logoRepository.findAll().size();

        // Create the Logo

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLogoMockMvc.perform(put("/api/logos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(logo)))
            .andExpect(status().isCreated());

        // Validate the Logo in the database
        List<Logo> logoList = logoRepository.findAll();
        assertThat(logoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLogo() throws Exception {
        // Initialize the database
        logoService.save(logo);

        int databaseSizeBeforeDelete = logoRepository.findAll().size();

        // Get the logo
        restLogoMockMvc.perform(delete("/api/logos/{id}", logo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean logoExistsInEs = logoSearchRepository.exists(logo.getId());
        assertThat(logoExistsInEs).isFalse();

        // Validate the database is empty
        List<Logo> logoList = logoRepository.findAll();
        assertThat(logoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchLogo() throws Exception {
        // Initialize the database
        logoService.save(logo);

        // Search the logo
        restLogoMockMvc.perform(get("/api/_search/logos?query=id:" + logo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(logo.getId().intValue())))
            .andExpect(jsonPath("$.[*].primary").value(hasItem(DEFAULT_PRIMARY.booleanValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Logo.class);
        Logo logo1 = new Logo();
        logo1.setId(1L);
        Logo logo2 = new Logo();
        logo2.setId(logo1.getId());
        assertThat(logo1).isEqualTo(logo2);
        logo2.setId(2L);
        assertThat(logo1).isNotEqualTo(logo2);
        logo1.setId(null);
        assertThat(logo1).isNotEqualTo(logo2);
    }
}
