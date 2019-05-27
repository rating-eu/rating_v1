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

import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.Questionnaire;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the Question entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("SELECT DISTINCT question FROM Question question left join fetch question.attackStrategies as attacks left join fetch attacks.levels as levels left join fetch levels.container left join fetch question.answers WHERE question.questionnaire = :questionnaire ORDER BY question.order ASC")
    List<Question> findAllByQuestionnaire(@Param("questionnaire") Questionnaire questionnaire);

    @Query("select distinct question from Question question left join fetch question.attackStrategies as attacks left join fetch attacks.levels as levels left join fetch levels.container left join fetch question.answers")
    List<Question> findAllWithEagerRelationships();

    @Query("select question from Question question left join fetch question.attackStrategies as attacks left join fetch attacks.levels as levels left join fetch levels.container left join fetch question.answers where question.id =:id")
    Question findOneWithEagerRelationships(@Param("id") Long id);

}
