package eu.hermeneut.repository;

import eu.hermeneut.domain.DataOperation;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DataOperation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataOperationRepository extends JpaRepository<DataOperation, Long> {

}
