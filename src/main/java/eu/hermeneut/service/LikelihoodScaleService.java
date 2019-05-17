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

package eu.hermeneut.service;

import eu.hermeneut.domain.LikelihoodScale;
import java.util.List;

/**
 * Service Interface for managing LikelihoodScale.
 */
public interface LikelihoodScaleService {

    /**
     * Save a likelihoodScale.
     *
     * @param likelihoodScale the entity to save
     * @return the persisted entity
     */
    LikelihoodScale save(LikelihoodScale likelihoodScale);

    /**
     * Get all the likelihoodScales.
     *
     * @return the list of entities
     */
    List<LikelihoodScale> findAll();

    /**
     * Get the "id" likelihoodScale.
     *
     * @param id the id of the entity
     * @return the entity
     */
    LikelihoodScale findOne(Long id);

    /**
     * Delete the "id" likelihoodScale.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get all the likelihoodScales by SelfAssessment
     *
     * @Param selfAssessmentID the SelfAssessment ID
     * @return the list of entities
     */
    List<LikelihoodScale> findAllBySelfAssessment(Long selfAssessmentID);
}
