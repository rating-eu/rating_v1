package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Phase;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Phase entity.
 */
public interface PhaseSearchRepository extends ElasticsearchRepository<Phase, Long> {
}
