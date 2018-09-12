package eu.hermeneut.repository.search;

import eu.hermeneut.domain.MyCompany;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the MyCompany entity.
 */
public interface MyCompanySearchRepository extends ElasticsearchRepository<MyCompany, Long> {
}
