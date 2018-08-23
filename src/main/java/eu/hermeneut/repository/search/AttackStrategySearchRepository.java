package eu.hermeneut.repository.search;

import eu.hermeneut.domain.AttackStrategy;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the AttackStrategy entity.
 */
public interface AttackStrategySearchRepository extends ElasticsearchRepository<AttackStrategy, Long> {
}
