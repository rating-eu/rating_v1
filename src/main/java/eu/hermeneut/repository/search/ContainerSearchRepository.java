package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Container;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Container entity.
 */
public interface ContainerSearchRepository extends ElasticsearchRepository<Container, Long> {
}
