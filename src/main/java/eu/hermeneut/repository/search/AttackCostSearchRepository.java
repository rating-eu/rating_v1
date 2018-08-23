package eu.hermeneut.repository.search;

import eu.hermeneut.domain.AttackCost;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the AttackCost entity.
 */
public interface AttackCostSearchRepository extends ElasticsearchRepository<AttackCost, Long> {
}
