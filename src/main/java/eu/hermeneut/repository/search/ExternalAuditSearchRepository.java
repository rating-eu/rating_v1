package eu.hermeneut.repository.search;

import eu.hermeneut.domain.ExternalAudit;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ExternalAudit entity.
 */
public interface ExternalAuditSearchRepository extends ElasticsearchRepository<ExternalAudit, Long> {
}
