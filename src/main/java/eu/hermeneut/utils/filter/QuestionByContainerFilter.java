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

package eu.hermeneut.utils.filter;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.Container;
import eu.hermeneut.domain.Level;
import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.enumeration.ContainerType;

import java.util.Set;
import java.util.function.Predicate;

public class QuestionByContainerFilter implements Predicate<Question> {

    private ContainerType containerType;

    public QuestionByContainerFilter(ContainerType containerType) {
        this.containerType = containerType;
    }

    @Override
    public boolean test(Question question) {
        Set<AttackStrategy> attackStrategies = question.getAttackStrategies();
        boolean accepted = false;

        if (attackStrategies != null && !attackStrategies.isEmpty()) {
            for (AttackStrategy attackStrategy : attackStrategies) {
                Set<Level> levels = attackStrategy.getLevels();

                if (levels != null && !levels.isEmpty()) {
                    for (Level level : levels) {
                        Container container = level.getContainer();

                        if (container != null) {
                            ContainerType type = container.getContainerType();

                            if (type.equals(this.containerType)) {
                                accepted = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return accepted;
    }
}
