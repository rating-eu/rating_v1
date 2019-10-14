package eu.hermeneut.repository;

import eu.hermeneut.domain.DataRecipient;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DataRecipient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataRecipientRepository extends JpaRepository<DataRecipient, Long> {

}
