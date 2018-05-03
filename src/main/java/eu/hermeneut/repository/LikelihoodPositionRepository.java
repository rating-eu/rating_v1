package eu.hermeneut.repository;

import eu.hermeneut.domain.LikelihoodPosition;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LikelihoodPosition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LikelihoodPositionRepository extends JpaRepository<LikelihoodPosition, Long> {

}
