package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Logo;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Logo entity.
 */
public interface LogoSearchRepository extends ElasticsearchRepository<Logo, Long> {
}
