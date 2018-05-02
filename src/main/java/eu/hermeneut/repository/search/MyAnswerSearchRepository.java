package eu.hermeneut.repository.search;

import eu.hermeneut.domain.MyAnswer;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the MyAnswer entity.
 */
public interface MyAnswerSearchRepository extends ElasticsearchRepository<MyAnswer, Long> {
}
