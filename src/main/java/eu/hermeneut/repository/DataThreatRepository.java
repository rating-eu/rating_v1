package eu.hermeneut.repository;

import eu.hermeneut.domain.DataThreat;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DataThreat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataThreatRepository extends JpaRepository<DataThreat, Long> {

}
