package eu.hermeneut.repository;

import eu.hermeneut.domain.DataImpactDescription;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DataImpactDescription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataImpactDescriptionRepository extends JpaRepository<DataImpactDescription, Long> {

}
