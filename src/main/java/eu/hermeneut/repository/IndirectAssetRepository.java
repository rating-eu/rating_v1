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

    @Query("SELECT DISTINCT indirectAsset from IndirectAsset indirectAsset WHERE indirectAsset.directAsset.id = :directAssetID")
    List<IndirectAsset> findAllbyDirectAsset(@Param("directAssetID") Long directAssetID);

    @Query("SELECT DISTINCT indirectAsset FROM IndirectAsset indirectAsset LEFT JOIN FETCH indirectAsset.myAsset as myAsset LEFT JOIN FETCH myAsset.asset WHERE myAsset.selfAssessment.id = :selfAssessmentID")
    List<IndirectAsset> findAllbySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);

    /**
     * A MyAsset can be the Indirect of multiple direct assets.
     *
     * @param selfAssessmentID
     * @param myAssetID
     * @return
     */
    @Query("SELECT DISTINCT indirectAsset FROM IndirectAsset indirectAsset LEFT JOIN FETCH indirectAsset.myAsset as myAsset " +
        "LEFT JOIN FETCH myAsset.asset LEFT JOIN FETCH myAsset.costs " +
        "WHERE myAsset.id = :myAssetID AND myAsset.selfAssessment.id = :selfAssessmentID"
    )
    List<IndirectAsset> findAllByMyAssetID(@Param("selfAssessmentID") Long selfAssessmentID, @Param("myAssetID") Long myAssetID);
}
