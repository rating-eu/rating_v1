package eu.hermeneut.repository.search;

import eu.hermeneut.domain.CriticalLevel;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CriticalLevel entity.
 */
public interface CriticalLevelSearchRepository extends ElasticsearchRepository<CriticalLevel, Long> {
}
