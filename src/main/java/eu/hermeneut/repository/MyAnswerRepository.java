package eu.hermeneut.repository;

import eu.hermeneut.domain.MyAnswer;
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

}
