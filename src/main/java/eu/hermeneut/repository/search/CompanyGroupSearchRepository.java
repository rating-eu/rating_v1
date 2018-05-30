package eu.hermeneut.repository.search;

import eu.hermeneut.domain.CompanyGroup;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CompanyGroup entity.
 */
public interface CompanyGroupSearchRepository extends ElasticsearchRepository<CompanyGroup, Long> {
}
