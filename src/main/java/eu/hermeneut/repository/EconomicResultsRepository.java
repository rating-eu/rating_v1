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

import eu.hermeneut.domain.EconomicResults;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the EconomicResults entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EconomicResultsRepository extends JpaRepository<EconomicResults, Long> {

    @Query("SELECT economicResults FROM EconomicResults economicResults WHERE economicResults.selfAssessment.id = :selfAssessmentID")
    EconomicResults findOneBySelfAssessmentID(@Param("selfAssessmentID") Long selfAssessmentID);
}
