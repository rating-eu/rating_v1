package eu.hermeneut.repository;

import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.Questionnaire;
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
    @Query("SELECT question FROM Question question WHERE question.questionnaire = :questionnaire")
    List<Question> findAllByQuestionnaire(@Param("questionnaire") Questionnaire questionnaire);
}
