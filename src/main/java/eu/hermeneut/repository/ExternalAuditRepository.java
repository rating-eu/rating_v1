package eu.hermeneut.repository;

import eu.hermeneut.domain.ExternalAudit;
import eu.hermeneut.domain.User;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ExternalAudit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExternalAuditRepository extends JpaRepository<ExternalAudit, Long> {

    @Query("SELECT external_audit FROM ExternalAudit external_audit WHERE external_audit.user = :user")
    ExternalAudit findByUser(@Param("user") User user);
}
