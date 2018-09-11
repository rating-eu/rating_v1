package eu.hermeneut.repository;

import eu.hermeneut.domain.ExternalAudit;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ExternalAudit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExternalAuditRepository extends JpaRepository<ExternalAudit, Long> {

}
