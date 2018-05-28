package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Level;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Level entity.
 */
public interface LevelSearchRepository extends ElasticsearchRepository<Level, Long> {
}
