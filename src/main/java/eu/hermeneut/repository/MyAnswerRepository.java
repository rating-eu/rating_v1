package eu.hermeneut.repository;

import eu.hermeneut.domain.MyAnswer;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the MyAnswer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyAnswerRepository extends JpaRepository<MyAnswer, Long> {

    @Query("select my_answer from MyAnswer my_answer where my_answer.user.login = ?#{principal.username}")
    List<MyAnswer> findByUserIsCurrentUser();

    @Query("SELECT my_answer FROM MyAnswer my_answer WHERE my_answer.questionnaire.id = :questionnaireID AND my_answer.user.id = :userID")
    List<MyAnswer> findAllByQuestionnaireAndUser(@Param("questionnaireID") Long questionnaireID, @Param("userID") Long userID);
}
