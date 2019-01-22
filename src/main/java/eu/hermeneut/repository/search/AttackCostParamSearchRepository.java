package eu.hermeneut.repository.search;

import eu.hermeneut.domain.AttackCostParam;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the AttackCostParam entity.
 */
public interface AttackCostParamSearchRepository extends ElasticsearchRepository<AttackCostParam, Long> {
}
