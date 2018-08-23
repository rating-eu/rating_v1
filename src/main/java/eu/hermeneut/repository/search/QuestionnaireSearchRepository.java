package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Questionnaire;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Questionnaire entity.
 */
public interface QuestionnaireSearchRepository extends ElasticsearchRepository<Questionnaire, Long> {
}
