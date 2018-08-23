package eu.hermeneut.repository;

import eu.hermeneut.domain.MyAsset;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the MyAsset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyAssetRepository extends JpaRepository<MyAsset, Long> {

}
