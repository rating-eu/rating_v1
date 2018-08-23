package eu.hermeneut.repository.search;

import eu.hermeneut.domain.AssetCategory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the AssetCategory entity.
 */
public interface AssetCategorySearchRepository extends ElasticsearchRepository<AssetCategory, Long> {
}
