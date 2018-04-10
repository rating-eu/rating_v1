package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Asset;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Asset entity.
 */
public interface AssetSearchRepository extends ElasticsearchRepository<Asset, Long> {
}
