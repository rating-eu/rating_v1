package eu.hermeneut.repository.search;

import eu.hermeneut.domain.EconomicCoefficients;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the EconomicCoefficients entity.
 */
public interface EconomicCoefficientsSearchRepository extends ElasticsearchRepository<EconomicCoefficients, Long> {
}
