package eu.hermeneut.repository.search;

import eu.hermeneut.domain.CompanyProfile;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CompanyProfile entity.
 */
public interface CompanyProfileSearchRepository extends ElasticsearchRepository<CompanyProfile, Long> {
}
