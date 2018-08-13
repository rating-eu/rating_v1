package eu.hermeneut.repository.search;

import eu.hermeneut.domain.EBIT;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the EBIT entity.
 */
public interface EBITSearchRepository extends ElasticsearchRepository<EBIT, Long> {
}
