package eu.hermeneut.repository;

import eu.hermeneut.domain.SplittingLoss;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the SplittingLoss entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SplittingLossRepository extends JpaRepository<SplittingLoss, Long> {

}
