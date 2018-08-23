package eu.hermeneut.repository;

import eu.hermeneut.domain.Question;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Question entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("select distinct question from Question question left join fetch question.attackStrategies left join fetch question.answers")
    List<Question> findAllWithEagerRelationships();

    @Query("select question from Question question left join fetch question.attackStrategies left join fetch question.answers where question.id =:id")
    Question findOneWithEagerRelationships(@Param("id") Long id);

}
