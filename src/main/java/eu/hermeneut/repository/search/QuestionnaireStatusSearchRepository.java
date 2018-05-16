package eu.hermeneut.repository.search;

import eu.hermeneut.domain.QuestionnaireStatus;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the QuestionnaireStatus entity.
 */
public interface QuestionnaireStatusSearchRepository extends ElasticsearchRepository<QuestionnaireStatus, Long> {
}
