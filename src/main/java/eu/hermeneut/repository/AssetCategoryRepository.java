package eu.hermeneut.repository;

import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.enumeration.AssetType;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the AssetCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long> {

    @Query("SELECT asset_category from AssetCategory asset_category WHERE asset_category.type = :assetType")
    List<AssetCategory> findAllByAssetType(@Param("assetType") AssetType assetType);
}
