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

    @Query("SELECT dataOperation FROM DataOperation dataOperation LEFT JOIN FETCH dataOperation.recipients LEFT JOIN FETCH dataOperation.impacts LEFT JOIN FETCH dataOperation.threats WHERE dataOperation.companyProfile.id = :companyProfileID")
    List<DataOperation> findAllByCompanyProfile(@Param("companyProfileID") Long companyProfileID);

    @Query("SELECT dataOperation FROM DataOperation dataOperation LEFT JOIN FETCH dataOperation.recipients LEFT JOIN FETCH dataOperation.impacts LEFT JOIN FETCH dataOperation.threats WHERE dataOperation.companyProfile.id = :companyProfileID AND dataOperation.id = :operationID")
    DataOperation findOneByCompanyProfileAndOperationID(@Param("companyProfileID") Long companyProfileID, @Param("operationID") Long operationID);
}
