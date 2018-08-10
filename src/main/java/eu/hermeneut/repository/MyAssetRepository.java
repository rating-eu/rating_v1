package eu.hermeneut.repository;

import eu.hermeneut.domain.MyAsset;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the MyAsset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyAssetRepository extends JpaRepository<MyAsset, Long> {

    @Query("SELECT my_asset from MyAsset my_asset WHERE my_asset.selfAssessment.id = :selfAssessmentID")
    List<MyAsset> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
