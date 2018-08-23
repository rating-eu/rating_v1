package eu.hermeneut.repository.search;

import eu.hermeneut.domain.DirectAsset;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the DirectAsset entity.
 */
public interface DirectAssetSearchRepository extends ElasticsearchRepository<DirectAsset, Long> {
}
