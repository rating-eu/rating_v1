package eu.hermeneut.repository;

import eu.hermeneut.domain.Logo;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Logo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LogoRepository extends JpaRepository<Logo, Long> {

    @Query("SELECT logo from Logo logo WHERE logo.primary=false")
    Logo findSecondaryLogo();
}
