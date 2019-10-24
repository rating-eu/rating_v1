package eu.hermeneut.repository;

import eu.hermeneut.domain.SystemConfig;
import eu.hermeneut.domain.enumeration.ConfigKey;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the SystemConfig entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {

    @Query("SELECT config FROM SystemConfig config WHERE config.key = :key")
    SystemConfig findOneByKey(@Param("key") ConfigKey key);
}
