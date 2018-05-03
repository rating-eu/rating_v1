package eu.hermeneut.repository.search;

import eu.hermeneut.domain.LikelihoodPosition;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the LikelihoodPosition entity.
 */
public interface LikelihoodPositionSearchRepository extends ElasticsearchRepository<LikelihoodPosition, Long> {
}
