package eu.hermeneut.repository.search;

import eu.hermeneut.domain.EconomicResults;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the EconomicResults entity.
 */
public interface EconomicResultsSearchRepository extends ElasticsearchRepository<EconomicResults, Long> {
}
