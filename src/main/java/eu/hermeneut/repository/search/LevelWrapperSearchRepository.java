package eu.hermeneut.repository.search;

import eu.hermeneut.domain.LevelWrapper;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the LevelWrapper entity.
 */
public interface LevelWrapperSearchRepository extends ElasticsearchRepository<LevelWrapper, Long> {
}
