package eu.hermeneut.repository;

import eu.hermeneut.domain.ExternalAudit;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the ExternalAudit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExternalAuditRepository extends JpaRepository<ExternalAudit, Long> {

    @Query("select external_audit from ExternalAudit external_audit where external_audit.user.login = ?#{principal.username}")
    List<ExternalAudit> findByUserIsCurrentUser();

}
