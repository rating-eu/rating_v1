package eu.hermeneut.repository;

import eu.hermeneut.domain.CompanyProfile;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the CompanyProfile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {

    @Query("select company_profile from CompanyProfile company_profile where company_profile.user.login = ?#{principal.username}")
    List<CompanyProfile> findByUserIsCurrentUser();
    @Query("select distinct company_profile from CompanyProfile company_profile left join fetch company_profile.containers")
    List<CompanyProfile> findAllWithEagerRelationships();

    @Query("select DISTINCT company_profile from CompanyProfile company_profile left join fetch company_profile.containers where company_profile.id =:id")
    CompanyProfile findOneWithEagerRelationships(@Param("id") Long id);

}
