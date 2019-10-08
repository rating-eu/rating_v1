package eu.hermeneut.repository;

import eu.hermeneut.domain.DataThreat;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the DataThreat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataThreatRepository extends JpaRepository<DataThreat, Long> {

    @Query("SELECT data_threat FROM DataThreat data_threat WHERE data_threat.operation.id = :operationID")
    List<DataThreat> findAllByDataOperation(@Param("operationID") Long operationID);
}
