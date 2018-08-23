package eu.hermeneut.repository.search;

import eu.hermeneut.domain.SelfAssessment;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SelfAssessment entity.
 */
public interface SelfAssessmentSearchRepository extends ElasticsearchRepository<SelfAssessment, Long> {
}
