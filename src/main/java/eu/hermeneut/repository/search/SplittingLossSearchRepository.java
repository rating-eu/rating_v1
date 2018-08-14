package eu.hermeneut.repository.search;

import eu.hermeneut.domain.SplittingLoss;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SplittingLoss entity.
 */
public interface SplittingLossSearchRepository extends ElasticsearchRepository<SplittingLoss, Long> {
}
