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

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.Level;
import eu.hermeneut.domain.Phase;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the AttackStrategy entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttackStrategyRepository extends JpaRepository<AttackStrategy, Long> {
    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.levels LEFT JOIN FETCH attack_strategy.phases")
    List<AttackStrategy> findAllWithEagerRelationships();

    @Query("SELECT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.levels LEFT JOIN FETCH attack_strategy.phases where attack_strategy.id =:id")
    AttackStrategy findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.levels levels  WHERE levels.id = :levelID")
    List<AttackStrategy> findAllByLevel(@Param("levelID") Long levelID);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.phases phases  WHERE phases.id = :phaseID")
    List<AttackStrategy> findAllByPhase(@Param("phaseID") Long phaseID);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.levels levels INNER JOIN FETCH attack_strategy.phases phases WHERE levels.id = :levelID AND phases.id = :phaseID")
    List<AttackStrategy> findAllByLevelAndPhase(@Param("levelID") Long levelID, @Param("phaseID") Long phaseID);

    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.levels levels INNER JOIN FETCH attack_strategy.phases phases WHERE levels.container.id = :containerID")
    List<AttackStrategy> findAllByContainer(@Param("containerID") Long containerID);
}
