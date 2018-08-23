package eu.hermeneut.repository.search;

import eu.hermeneut.domain.DomainOfInfluence;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the DomainOfInfluence entity.
 */
public interface DomainOfInfluenceSearchRepository extends ElasticsearchRepository<DomainOfInfluence, Long> {
}
