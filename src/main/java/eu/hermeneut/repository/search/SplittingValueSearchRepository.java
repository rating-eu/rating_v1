package eu.hermeneut.repository.search;

import eu.hermeneut.domain.SplittingValue;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SplittingValue entity.
 */
public interface SplittingValueSearchRepository extends ElasticsearchRepository<SplittingValue, Long> {
}
