package eu.hermeneut.repository.search;

import eu.hermeneut.domain.LikelihoodScale;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the LikelihoodScale entity.
 */
public interface LikelihoodScaleSearchRepository extends ElasticsearchRepository<LikelihoodScale, Long> {
}
