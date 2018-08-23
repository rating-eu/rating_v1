package eu.hermeneut.repository.search;

import eu.hermeneut.domain.Answer;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Answer entity.
 */
public interface AnswerSearchRepository extends ElasticsearchRepository<Answer, Long> {
}
