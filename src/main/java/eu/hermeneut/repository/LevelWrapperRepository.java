package eu.hermeneut.repository;

import eu.hermeneut.domain.LevelWrapper;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LevelWrapper entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LevelWrapperRepository extends JpaRepository<LevelWrapper, Long> {

}
