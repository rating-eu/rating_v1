package eu.hermeneut.repository;

import eu.hermeneut.domain.SecurityImpact;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the SecurityImpact entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SecurityImpactRepository extends JpaRepository<SecurityImpact, Long> {

    @Query("SELECT impact FROM SecurityImpact  impact WHERE impact.operation.id = :operationID")
    List<SecurityImpact> findAllByDataOperation(@Param("operationID") Long operationID);
}
