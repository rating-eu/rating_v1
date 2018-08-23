package eu.hermeneut.repository;

import eu.hermeneut.domain.LikelihoodScale;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LikelihoodScale entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LikelihoodScaleRepository extends JpaRepository<LikelihoodScale, Long> {

}
