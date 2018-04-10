package eu.hermeneut.repository;

import eu.hermeneut.domain.AssetCategory;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the AssetCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long> {

}
