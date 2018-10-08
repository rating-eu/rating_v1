package eu.hermeneut.repository.search;

import eu.hermeneut.domain.ImpactLevel;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ImpactLevel entity.
 */
public interface ImpactLevelSearchRepository extends ElasticsearchRepository<ImpactLevel, Long> {
}
