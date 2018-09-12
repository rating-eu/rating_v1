package eu.hermeneut.service.impl;

import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.domain.MyCompany;
import eu.hermeneut.repository.MyCompanyRepository;
import eu.hermeneut.repository.search.MyCompanySearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing MyCompany.
 */
@Service
@Transactional
public class MyCompanyServiceImpl implements MyCompanyService {

    private final Logger log = LoggerFactory.getLogger(MyCompanyServiceImpl.class);

    private final MyCompanyRepository myCompanyRepository;

    private final MyCompanySearchRepository myCompanySearchRepository;

    public MyCompanyServiceImpl(MyCompanyRepository myCompanyRepository, MyCompanySearchRepository myCompanySearchRepository) {
        this.myCompanyRepository = myCompanyRepository;
        this.myCompanySearchRepository = myCompanySearchRepository;
    }

    /**
     * Save a myCompany.
     *
     * @param myCompany the entity to save
     * @return the persisted entity
     */
    @Override
    public MyCompany save(MyCompany myCompany) {
        log.debug("Request to save MyCompany : {}", myCompany);
        MyCompany result = myCompanyRepository.save(myCompany);
        myCompanySearchRepository.save(result);
        return result;
    }

    /**
     * Get all the myCompanies.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyCompany> findAll() {
        log.debug("Request to get all MyCompanies");
        return myCompanyRepository.findAll();
    }

    /**
     * Get one myCompany by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public MyCompany findOne(Long id) {
        log.debug("Request to get MyCompany : {}", id);
        return myCompanyRepository.findOne(id);
    }

    /**
     * Delete the myCompany by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete MyCompany : {}", id);
        myCompanyRepository.delete(id);
        myCompanySearchRepository.delete(id);
    }

    /**
     * Search for the myCompany corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyCompany> search(String query) {
        log.debug("Request to search MyCompanies for query {}", query);
        return StreamSupport
            .stream(myCompanySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public MyCompany findOneByUser(Long userID) {
        log.debug("Request to get MyCompany by user: {}", userID);
        return myCompanyRepository.findOneByUser(userID);
    }
}
