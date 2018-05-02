package eu.hermeneut.repository.search;

import eu.hermeneut.domain.AnswerWeight;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the AnswerWeight entity.
 */
public interface AnswerWeightSearchRepository extends ElasticsearchRepository<AnswerWeight, Long> {
}
