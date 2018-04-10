package eu.hermeneut.repository;

import eu.hermeneut.domain.Container;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Container entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContainerRepository extends JpaRepository<Container, Long> {

}
