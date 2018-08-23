package eu.hermeneut.repository;

import eu.hermeneut.domain.DirectAsset;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DirectAsset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DirectAssetRepository extends JpaRepository<DirectAsset, Long> {

}
