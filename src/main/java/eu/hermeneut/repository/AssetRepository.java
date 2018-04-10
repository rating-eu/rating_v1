package eu.hermeneut.repository;

import eu.hermeneut.domain.Asset;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Asset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    @Query("select distinct asset from Asset asset left join fetch asset.containers left join fetch asset.domains")
    List<Asset> findAllWithEagerRelationships();

    @Query("select asset from Asset asset left join fetch asset.containers left join fetch asset.domains where asset.id =:id")
    Asset findOneWithEagerRelationships(@Param("id") Long id);

}
