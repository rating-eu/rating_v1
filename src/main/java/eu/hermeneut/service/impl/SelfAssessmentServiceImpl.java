package eu.hermeneut.service.impl;

import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.repository.SelfAssessmentRepository;
import eu.hermeneut.repository.search.SelfAssessmentSearchRepository;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing SelfAssessment.
 */
@Service
@Transactional
public class SelfAssessmentServiceImpl implements SelfAssessmentService {

	private final Logger log = LoggerFactory.getLogger(SelfAssessmentServiceImpl.class);

	private final SelfAssessmentRepository selfAssessmentRepository;

	private final SelfAssessmentSearchRepository selfAssessmentSearchRepository;

	public SelfAssessmentServiceImpl(SelfAssessmentRepository selfAssessmentRepository, SelfAssessmentSearchRepository selfAssessmentSearchRepository) {
		this.selfAssessmentRepository = selfAssessmentRepository;
		this.selfAssessmentSearchRepository = selfAssessmentSearchRepository;
	}

	/**
	 * Save a selfAssessment.
	 *
	 * @param selfAssessment the entity to save
	 * @return the persisted entity
	 */
	@Override
	public SelfAssessment save(SelfAssessment selfAssessment) {
		log.debug("Request to save SelfAssessment : {}", selfAssessment);
		SelfAssessment result = selfAssessmentRepository.save(selfAssessment);
		selfAssessmentSearchRepository.save(result);
		return result;
	}

	/**
	 * Get all the selfAssessments.
	 *
	 * @return the list of entities
	 */
	@Override
	@Transactional(readOnly = true)
	public List<SelfAssessment> findAll() {
		log.debug("Request to get all SelfAssessments");

		String logged_user = SecurityUtils.getCurrentUserLogin().get();

		System.out.println("CURRENT " + logged_user);
		List<SelfAssessment> rr = selfAssessmentRepository.findAll();    
		List<SelfAssessment> toReturn = new ArrayList<SelfAssessment>();
		if(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
			return selfAssessmentRepository.findAllWithEagerRelationships();

		}else {
			for (SelfAssessment selfAssessment : rr) {
				
				String self_owner=selfAssessment.getUser().getLogin();
				
				if(self_owner.equalsIgnoreCase(logged_user)){
					if(!toReturn.contains(selfAssessment)) {
					System.out.println("SIZE "+selfAssessment.getCompanyprofiles().size());
					System.out.println("SIZE external "+selfAssessment.getExternalaudits().size());
					System.out.println("SIZE questionnaires "+selfAssessment.getQuestionnaires().size());
					System.out.println("SIZE sectors "+selfAssessment.getCompanysectors().size());

					toReturn.add(selfAssessment);}
				}else {
					Iterator<CompanyProfile> companyProfiles_iterator = selfAssessment.getCompanyprofiles().iterator();
					
					
					while(companyProfiles_iterator.hasNext()) {
						
						CompanyProfile cc = companyProfiles_iterator.next();
						String company_owner = cc.getUser().getLogin();
						
						System.out.println("company owner user "+ company_owner);
						if(company_owner.equalsIgnoreCase(logged_user)){
							System.out.println("SIZE "+selfAssessment.getCompanyprofiles());
							System.out.println("SIZE sectors "+selfAssessment.getCompanysectors());

							System.out.println("SIZE external "+selfAssessment.getExternalaudits().size());
							System.out.println("SIZE questionnaires "+selfAssessment.getQuestionnaires().size());
							if(!toReturn.contains(selfAssessment)) {toReturn.add(selfAssessment);}
						}

					}
					
				} 
			
				

			}


			return toReturn;
		}
	}

	/**
	 * Get one selfAssessment by id.
	 *
	 * @param id the id of the entity
	 * @return the entity
	 */
	@Override
	@Transactional(readOnly = true)
	public SelfAssessment findOne(Long id) {
		log.debug("Request to get SelfAssessment : {}", id);
		return selfAssessmentRepository.findOneWithEagerRelationships(id);
	}

	/**
	 * Delete the selfAssessment by id.
	 *
	 * @param id the id of the entity
	 */
	@Override
	public void delete(Long id) {
		log.debug("Request to delete SelfAssessment : {}", id);
		selfAssessmentRepository.delete(id);
		selfAssessmentSearchRepository.delete(id);
	}

	/**
	 * Search for the selfAssessment corresponding to the query.
	 *
	 * @param query the query of the search
	 * @return the list of entities
	 */
	@Override
	@Transactional(readOnly = true)
	public List<SelfAssessment> search(String query) {
		log.debug("Request to search SelfAssessments for query {}", query);
		return StreamSupport
				.stream(selfAssessmentSearchRepository.search(queryStringQuery(query)).spliterator(), false)
				.collect(Collectors.toList());
	}
}
