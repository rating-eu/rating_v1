package eu.hermeneut.service.impl;

import eu.hermeneut.service.CompanySectorService;
import springfox.documentation.spi.service.contexts.SecurityContext;
import eu.hermeneut.domain.CompanySector;
import eu.hermeneut.domain.User;
import eu.hermeneut.repository.CompanySectorRepository;
import eu.hermeneut.repository.UserRepository;
import eu.hermeneut.repository.search.CompanySectorSearchRepository;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing CompanySector.
 */
@Service
@Transactional
public class CompanySectorServiceImpl implements CompanySectorService {

    private final Logger log = LoggerFactory.getLogger(CompanySectorServiceImpl.class);

    private final CompanySectorRepository companySectorRepository;

    private final CompanySectorSearchRepository companySectorSearchRepository;

    public CompanySectorServiceImpl(CompanySectorRepository companySectorRepository, CompanySectorSearchRepository companySectorSearchRepository) {
        this.companySectorRepository = companySectorRepository;
        this.companySectorSearchRepository = companySectorSearchRepository;
    }

    /**
     * Save a companySector.
     *
     * @param companySector the entity to save
     * @return the persisted entity
     */
    @Override
    public CompanySector save(CompanySector companySector) {
        log.debug("Request to save CompanySector : {}", companySector);
        CompanySector result = companySectorRepository.save(companySector);
        companySectorSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the companySectors.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<CompanySector> findAll() {
        log.debug("Request to get all CompanySectors");
        
        String logged_user = SecurityUtils.getCurrentUserLogin().get();
         
        System.out.println("CURRENT " + logged_user);
        
        List<CompanySector> rr=companySectorRepository.findAll();
        if(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
        	return companySectorRepository.findAll();
        }else {
        	
        	List<CompanySector> toReturn= new ArrayList<CompanySector>();
        	
        	for (CompanySector companySector : rr) {
				String owner = companySector.getUser().getLogin();
				System.out.println("owner sector user "+ owner);
				
				if(owner.equalsIgnoreCase(logged_user)) {
					if(!toReturn.contains(companySector))toReturn.add(companySector);
				}else {
					System.out.println("ofner company "+ companySector
							.getCompanyprofile().getUser().getLogin());
					
					if(logged_user.equalsIgnoreCase(companySector
							.getCompanyprofile().getUser().getLogin())){
						if(!toReturn.contains(companySector)) {
							
							toReturn.add(companySector);
						}

					}
				}
					
				
				
			}
        	
        	return toReturn;
        }
        
    }

    /**
     * Get one companySector by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public CompanySector findOne(Long id) {
        log.debug("Request to get CompanySector : {}", id);
        return companySectorRepository.findOne(id);
    }

    /**
     * Delete the companySector by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete CompanySector : {}", id);
        companySectorRepository.delete(id);
        companySectorSearchRepository.delete(id);
    }

    /**
     * Search for the companySector corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<CompanySector> search(String query) {
        log.debug("Request to search CompanySectors for query {}", query);
        return StreamSupport
            .stream(companySectorSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
