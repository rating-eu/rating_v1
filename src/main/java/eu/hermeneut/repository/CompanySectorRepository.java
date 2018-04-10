package eu.hermeneut.repository;

import eu.hermeneut.domain.CompanySector;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the CompanySector entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanySectorRepository extends JpaRepository<CompanySector, Long> {

    @Query("select company_sector from CompanySector company_sector where company_sector.user.login = ?#{principal.username}")
    List<CompanySector> findByUserIsCurrentUser();

}
