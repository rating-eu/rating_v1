package eu.hermeneut.repository;

import eu.hermeneut.domain.AnswerWeight;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the AnswerWeight entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnswerWeightRepository extends JpaRepository<AnswerWeight, Long> {

}
