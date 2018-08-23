package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Mitigation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Mitigation entity.
 */
public interface MitigationSearchRepository extends ElasticsearchRepository<Mitigation, Long> {
}
