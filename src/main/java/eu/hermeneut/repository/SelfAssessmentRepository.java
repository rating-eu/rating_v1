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

import eu.hermeneut.domain.ExternalAudit;
import eu.hermeneut.domain.SelfAssessment;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the SelfAssessment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SelfAssessmentRepository extends JpaRepository<SelfAssessment, Long> {

    @Query("select self_assessment from SelfAssessment self_assessment where self_assessment.user.login = ?#{principal.username}")
    List<SelfAssessment> findByUserIsCurrentUser();

    @Query("select distinct self_assessment from SelfAssessment self_assessment left join fetch self_assessment.companyGroups left join fetch self_assessment.threatagents")
    List<SelfAssessment> findAllWithEagerRelationships();

    @Query("select DISTINCT self_assessment from SelfAssessment self_assessment left join fetch self_assessment.companyGroups left join fetch self_assessment.threatagents where self_assessment.id =:id")
    SelfAssessment findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT self_assessment FROM SelfAssessment self_assessment left join fetch self_assessment.companyGroups left join fetch self_assessment.threatagents WHERE self_assessment.companyProfile.id =:companyProfileID")
    List<SelfAssessment> findAllByCompanyProfile(@Param("companyProfileID") Long companyProfileID);

    @Query("SELECT DISTINCT self_assessment FROM SelfAssessment self_assessment left join fetch self_assessment.companyGroups left join fetch self_assessment.threatagents WHERE self_assessment.externalAudit =:externalAudit")
    List<SelfAssessment> findAllByExternalAudit(@Param("externalAudit") ExternalAudit externalAudit);
}
