package eu.hermeneut.repository;

import eu.hermeneut.domain.SplittingValue;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the SplittingValue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SplittingValueRepository extends JpaRepository<SplittingValue, Long> {

}
