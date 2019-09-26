package eu.hermeneut.repository;

import eu.hermeneut.domain.DataOperation;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the DataOperation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataOperationRepository extends JpaRepository<DataOperation, Long> {

    @Query("SELECT dataOperation FROM DataOperation dataOperation WHERE dataOperation.companyProfile.id = :companyProfileID")
    List<DataOperation> findAllByCompanyProfile(@Param("companyProfileID") Long companyProfileID);
}
