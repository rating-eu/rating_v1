package eu.hermeneut.repository;

import eu.hermeneut.domain.DataRiskLevelConfig;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DataRiskLevelConfig entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataRiskLevelConfigRepository extends JpaRepository<DataRiskLevelConfig, Long> {

}
