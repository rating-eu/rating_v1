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

import eu.hermeneut.domain.MyAnswer;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the MyAnswer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyAnswerRepository extends JpaRepository<MyAnswer, Long> {

    @Query("select my_answer from MyAnswer my_answer where my_answer.user.login = ?#{principal.username}")
    List<MyAnswer> findByUserIsCurrentUser();

    @Query("SELECT my_answer FROM MyAnswer my_answer WHERE my_answer.questionnaire.id = :questionnaireID AND my_answer.user.id = :userID")
    List<MyAnswer> findAllByQuestionnaireAndUser(@Param("questionnaireID") Long questionnaireID, @Param("userID") Long userID);

    @Query("SELECT my_answer FROM MyAnswer my_answer WHERE my_answer.questionnaireStatus.id =:questionnaireStatusID")
    List<MyAnswer> findAllByQuestionnaireStatus(@Param("questionnaireStatusID") Long questionnaireStatusID);
}
