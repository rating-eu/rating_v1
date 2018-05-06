package eu.hermeneut.repository;

import eu.hermeneut.domain.Answer;
import eu.hermeneut.domain.Question;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Answer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    @Query("select distinct answer from Answer answer left join fetch answer.threatAgents left join fetch answer.attacks")
    List<Answer> findAllWithEagerRelationships();

    @Query("select answer from Answer answer left join fetch answer.threatAgents left join fetch answer.attacks where answer.id =:id")
    Answer findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select distinct answer from Answer answer left join fetch answer.threatAgents left join fetch answer.attacks where answer.question = :question")
    List<Answer> findAllByQuestion(@Param("question") Question question);
}
