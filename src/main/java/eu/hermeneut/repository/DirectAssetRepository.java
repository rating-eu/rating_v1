package eu.hermeneut.repository;

import eu.hermeneut.domain.DirectAsset;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the DirectAsset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DirectAssetRepository extends JpaRepository<DirectAsset, Long> {

    @Query("SELECT DISTINCT directAsset FROM DirectAsset directAsset LEFT JOIN FETCH directAsset.myAsset as myAsset LEFT JOIN FETCH myAsset.asset LEFT JOIN FETCH directAsset.effects LEFT JOIN FETCH directAsset.costs WHERE myAsset.selfAssessment.id = :selfAssessmentID")
    List<DirectAsset> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
