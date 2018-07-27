package eu.hermeneut.repository;

import eu.hermeneut.domain.IndirectAsset;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the IndirectAsset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IndirectAssetRepository extends JpaRepository<IndirectAsset, Long> {

}
