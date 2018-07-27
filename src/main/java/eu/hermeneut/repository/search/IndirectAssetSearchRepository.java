package eu.hermeneut.repository.search;

import eu.hermeneut.domain.IndirectAsset;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the IndirectAsset entity.
 */
public interface IndirectAssetSearchRepository extends ElasticsearchRepository<IndirectAsset, Long> {
}
