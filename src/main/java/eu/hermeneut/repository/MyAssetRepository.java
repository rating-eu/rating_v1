/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.repository;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.enumeration.AssetType;
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

    @Query(
        "SELECT DISTINCT my_asset from MyAsset my_asset LEFT JOIN FETCH my_asset.costs LEFT JOIN FETCH my_asset.asset asset " +
            "LEFT JOIN FETCH asset.containers WHERE my_asset.id = :myAssetID")
    MyAsset findOne(@Param("myAssetID") Long myAssetID);

    @Query(
        "SELECT DISTINCT my_asset from MyAsset my_asset LEFT JOIN FETCH my_asset.costs LEFT JOIN FETCH my_asset.asset asset " +
            "LEFT JOIN FETCH asset.containers WHERE my_asset.selfAssessment.id = :selfAssessmentID")
    List<MyAsset> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);

    @Query(
        "SELECT DISTINCT my_asset from MyAsset my_asset LEFT JOIN FETCH my_asset.costs LEFT JOIN FETCH my_asset.asset asset " +
            "LEFT JOIN FETCH asset.containers LEFT JOIN FETCH asset.assetcategory assetCategory WHERE my_asset" +
            ".selfAssessment.id = " +
            ":selfAssessmentID " +
            "AND assetCategory.type = :assetType")
    List<MyAsset> findAllBySelfAssessmentAndAssetType(@Param("selfAssessmentID") Long selfAssessmentID, @Param
        ("assetType") AssetType assetType);

    @Query(
        "SELECT DISTINCT my_asset from MyAsset my_asset LEFT JOIN FETCH my_asset.costs LEFT JOIN FETCH my_asset.asset asset " +
            "LEFT JOIN FETCH asset.containers WHERE my_asset.id = :myAssetID AND my_asset.selfAssessment.id = :selfAssessmentID")
    MyAsset findOneByIDAndSelfAssessment(@Param("myAssetID") Long myAssetID, @Param("selfAssessmentID") Long selfAssessmentID);

    @Query(
        "SELECT DISTINCT my_asset from MyAsset my_asset LEFT JOIN FETCH my_asset.costs LEFT JOIN FETCH my_asset.asset asset " +
            "LEFT JOIN FETCH asset.containers WHERE my_asset.selfAssessment.id = :selfAssessmentID AND my_asset.asset.assetcategory.name = :assetCategory")
    List<MyAsset> findAllBySelfAssessmentAndAssetCategory(@Param("selfAssessmentID") Long selfAssessmentID, @Param("assetCategory") String assetCategory);
}
