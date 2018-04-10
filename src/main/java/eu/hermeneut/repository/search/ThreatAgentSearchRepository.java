package eu.hermeneut.repository.search;

import eu.hermeneut.domain.ThreatAgent;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ThreatAgent entity.
 */
public interface ThreatAgentSearchRepository extends ElasticsearchRepository<ThreatAgent, Long> {
}
