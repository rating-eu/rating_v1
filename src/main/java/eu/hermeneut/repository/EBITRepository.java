package eu.hermeneut.repository;

import eu.hermeneut.domain.EBIT;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the EBIT entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EBITRepository extends JpaRepository<EBIT, Long> {

}
