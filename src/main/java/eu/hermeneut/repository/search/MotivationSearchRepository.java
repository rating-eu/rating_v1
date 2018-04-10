package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Motivation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Motivation entity.
 */
public interface MotivationSearchRepository extends ElasticsearchRepository<Motivation, Long> {
}
