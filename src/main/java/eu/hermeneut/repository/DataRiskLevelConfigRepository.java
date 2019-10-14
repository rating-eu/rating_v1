package eu.hermeneut.repository;

import eu.hermeneut.domain.DataRiskLevelConfig;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the DataRiskLevelConfig entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataRiskLevelConfigRepository extends JpaRepository<DataRiskLevelConfig, Long> {

    @Query("SELECT config FROm DataRiskLevelConfig  config WHERE config.operation.id = :operationID")
    List<DataRiskLevelConfig> findAllByDataOperation(@Param("operationID") Long operationID);
}
