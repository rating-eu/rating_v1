package eu.hermeneut.repository;

import eu.hermeneut.domain.CompanyGroup;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the CompanyGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyGroupRepository extends JpaRepository<CompanyGroup, Long> {

    @Query("select company_group from CompanyGroup company_group where company_group.user.login = ?#{principal.username}")
    List<CompanyGroup> findByUserIsCurrentUser();

}
