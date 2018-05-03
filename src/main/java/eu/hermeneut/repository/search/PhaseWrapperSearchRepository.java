package eu.hermeneut.repository.search;

import eu.hermeneut.domain.PhaseWrapper;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the PhaseWrapper entity.
 */
public interface PhaseWrapperSearchRepository extends ElasticsearchRepository<PhaseWrapper, Long> {
}
