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

package eu.hermeneut.service.attackmap;

import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;

import javax.validation.constraints.NotNull;
import java.util.Map;

public interface AugmentedAttackStrategyService {
    /**
     * Returns the MAP of Augmented AttackStrategies with their likelihoods and vulnerabilities.
     * The key is the ID of the AttackStrategy, while the value is the Augmented AttackStrategy.
     *
     * @param companyProfileID The id of the CompanyProfile for which we want to calculate the Augmented AttackStrategies.
     * @return The MAP of Augmented AttackStrategies with their likelihoods and vulnerabilities.
     * @throws NotFoundException
     */
    Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> getAugmentedAttackStrategyMap(@NotNull Long companyProfileID) throws NotFoundException;
}
