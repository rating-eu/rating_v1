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

import eu.hermeneut.domain.ThreatAgent;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the ThreatAgent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ThreatAgentRepository extends JpaRepository<ThreatAgent, Long> {
    @Query("select distinct threat_agent from ThreatAgent threat_agent left join fetch threat_agent.motivations")
    List<ThreatAgent> findAllWithEagerRelationships();

    @Query("select threat_agent from ThreatAgent threat_agent left join fetch threat_agent.motivations where threat_agent.id =:id")
    ThreatAgent findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select distinct threat_agent from ThreatAgent threat_agent left join fetch threat_agent.motivations where threat_agent.identifiedByDefault = true")
    List<ThreatAgent> findAllDefault();
}
