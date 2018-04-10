package eu.hermeneut.repository.search;

import eu.hermeneut.domain.CompanySector;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CompanySector entity.
 */
public interface CompanySectorSearchRepository extends ElasticsearchRepository<CompanySector, Long> {
}
