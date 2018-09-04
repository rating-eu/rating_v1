package eu.hermeneut.repository;

import eu.hermeneut.domain.IndirectAsset;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the IndirectAsset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IndirectAssetRepository extends JpaRepository<IndirectAsset, Long> {

    @Query("SELECT indirectAsset from IndirectAsset indirectAsset WHERE indirectAsset.directAsset.id = :directAssetID")
    List<IndirectAsset> findAllbyDirectAsset(@Param("directAssetID") Long directAssetID);

    @Query("SELECT indirectAsset FROM IndirectAsset indirectAsset LEFT JOIN FETCH indirectAsset.myAsset as myAsset LEFT JOIN FETCH myAsset.asset LEFT JOIN FETCH indirectAsset.costs WHERE myAsset.selfAssessment.id = :selfAssessmentID")
    List<IndirectAsset> findAllbySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
