package eu.hermeneut.repository;

import eu.hermeneut.domain.Asset;
import eu.hermeneut.domain.Question;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the Question entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT question from Question question LEFT JOIN FETCH question.answers WHERE question.id =:id")
    Question findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT question FROM Question question LEFT JOIN FETCH question.answers")
    List<Question> findAllWithEagerRelationships();
}
