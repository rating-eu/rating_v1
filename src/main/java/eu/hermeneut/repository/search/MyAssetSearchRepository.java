package eu.hermeneut.repository.search;

import eu.hermeneut.domain.MyAsset;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the MyAsset entity.
 */
public interface MyAssetSearchRepository extends ElasticsearchRepository<MyAsset, Long> {
}
