package eu.hermeneut.web.rest;

import eu.hermeneut.HermeneutApp;

import eu.hermeneut.domain.MyCompany;
import eu.hermeneut.repository.MyCompanyRepository;
import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.repository.search.MyCompanySearchRepository;
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
 * Test class for the MyCompanyResource REST controller.
 *
 * @see MyCompanyResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HermeneutApp.class)
public class MyCompanyResourceIntTest {

    @Autowired
    private MyCompanyRepository myCompanyRepository;

    @Autowired
    private MyCompanyService myCompanyService;

    @Autowired
    private MyCompanySearchRepository myCompanySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMyCompanyMockMvc;

    private MyCompany myCompany;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MyCompanyResource myCompanyResource = new MyCompanyResource(myCompanyService);
        this.restMyCompanyMockMvc = MockMvcBuilders.standaloneSetup(myCompanyResource)
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
    public static MyCompany createEntity(EntityManager em) {
        MyCompany myCompany = new MyCompany();
        return myCompany;
    }

    @Before
    public void initTest() {
        myCompanySearchRepository.deleteAll();
        myCompany = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyCompany() throws Exception {
        int databaseSizeBeforeCreate = myCompanyRepository.findAll().size();

        // Create the MyCompany
        restMyCompanyMockMvc.perform(post("/api/my-companies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myCompany)))
            .andExpect(status().isCreated());

        // Validate the MyCompany in the database
        List<MyCompany> myCompanyList = myCompanyRepository.findAll();
        assertThat(myCompanyList).hasSize(databaseSizeBeforeCreate + 1);
        MyCompany testMyCompany = myCompanyList.get(myCompanyList.size() - 1);

        // Validate the MyCompany in Elasticsearch
        MyCompany myCompanyEs = myCompanySearchRepository.findOne(testMyCompany.getId());
        assertThat(myCompanyEs).isEqualToIgnoringGivenFields(testMyCompany);
    }

    @Test
    @Transactional
    public void createMyCompanyWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = myCompanyRepository.findAll().size();

        // Create the MyCompany with an existing ID
        myCompany.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyCompanyMockMvc.perform(post("/api/my-companies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myCompany)))
            .andExpect(status().isBadRequest());

        // Validate the MyCompany in the database
        List<MyCompany> myCompanyList = myCompanyRepository.findAll();
        assertThat(myCompanyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMyCompanies() throws Exception {
        // Initialize the database
        myCompanyRepository.saveAndFlush(myCompany);

        // Get all the myCompanyList
        restMyCompanyMockMvc.perform(get("/api/my-companies?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myCompany.getId().intValue())));
    }

    @Test
    @Transactional
    public void getMyCompany() throws Exception {
        // Initialize the database
        myCompanyRepository.saveAndFlush(myCompany);

        // Get the myCompany
        restMyCompanyMockMvc.perform(get("/api/my-companies/{id}", myCompany.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(myCompany.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingMyCompany() throws Exception {
        // Get the myCompany
        restMyCompanyMockMvc.perform(get("/api/my-companies/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMyCompany() throws Exception {
        // Initialize the database
        myCompanyService.save(myCompany);

        int databaseSizeBeforeUpdate = myCompanyRepository.findAll().size();

        // Update the myCompany
        MyCompany updatedMyCompany = myCompanyRepository.findOne(myCompany.getId());
        // Disconnect from session so that the updates on updatedMyCompany are not directly saved in db
        em.detach(updatedMyCompany);

        restMyCompanyMockMvc.perform(put("/api/my-companies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMyCompany)))
            .andExpect(status().isOk());

        // Validate the MyCompany in the database
        List<MyCompany> myCompanyList = myCompanyRepository.findAll();
        assertThat(myCompanyList).hasSize(databaseSizeBeforeUpdate);
        MyCompany testMyCompany = myCompanyList.get(myCompanyList.size() - 1);

        // Validate the MyCompany in Elasticsearch
        MyCompany myCompanyEs = myCompanySearchRepository.findOne(testMyCompany.getId());
        assertThat(myCompanyEs).isEqualToIgnoringGivenFields(testMyCompany);
    }

    @Test
    @Transactional
    public void updateNonExistingMyCompany() throws Exception {
        int databaseSizeBeforeUpdate = myCompanyRepository.findAll().size();

        // Create the MyCompany

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMyCompanyMockMvc.perform(put("/api/my-companies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myCompany)))
            .andExpect(status().isCreated());

        // Validate the MyCompany in the database
        List<MyCompany> myCompanyList = myCompanyRepository.findAll();
        assertThat(myCompanyList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMyCompany() throws Exception {
        // Initialize the database
        myCompanyService.save(myCompany);

        int databaseSizeBeforeDelete = myCompanyRepository.findAll().size();

        // Get the myCompany
        restMyCompanyMockMvc.perform(delete("/api/my-companies/{id}", myCompany.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean myCompanyExistsInEs = myCompanySearchRepository.exists(myCompany.getId());
        assertThat(myCompanyExistsInEs).isFalse();

        // Validate the database is empty
        List<MyCompany> myCompanyList = myCompanyRepository.findAll();
        assertThat(myCompanyList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMyCompany() throws Exception {
        // Initialize the database
        myCompanyService.save(myCompany);

        // Search the myCompany
        restMyCompanyMockMvc.perform(get("/api/_search/my-companies?query=id:" + myCompany.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myCompany.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyCompany.class);
        MyCompany myCompany1 = new MyCompany();
        myCompany1.setId(1L);
        MyCompany myCompany2 = new MyCompany();
        myCompany2.setId(myCompany1.getId());
        assertThat(myCompany1).isEqualTo(myCompany2);
        myCompany2.setId(2L);
        assertThat(myCompany1).isNotEqualTo(myCompany2);
        myCompany1.setId(null);
        assertThat(myCompany1).isNotEqualTo(myCompany2);
    }
}
