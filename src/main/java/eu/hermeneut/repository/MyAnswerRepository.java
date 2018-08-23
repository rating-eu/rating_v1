package eu.hermeneut.repository;

import eu.hermeneut.domain.MyAnswer;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the MyAnswer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyAnswerRepository extends JpaRepository<MyAnswer, Long> {

}
