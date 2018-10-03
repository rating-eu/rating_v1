package eu.hermeneut.repository.search;

import eu.hermeneut.domain.ImpactLevelDescription;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ImpactLevelDescription entity.
 */
public interface ImpactLevelDescriptionSearchRepository extends ElasticsearchRepository<ImpactLevelDescription, Long> {
}
