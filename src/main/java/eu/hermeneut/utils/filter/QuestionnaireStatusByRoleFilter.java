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

import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.enumeration.Role;

import java.util.function.Predicate;

public class QuestionnaireStatusByRoleFilter implements Predicate<QuestionnaireStatus> {

    private Role role;

    public QuestionnaireStatusByRoleFilter(Role role) {
        this.role = role;
    }

    @Override
    public boolean test(QuestionnaireStatus questionnaireStatus) {
        boolean accepted = false;

        if (questionnaireStatus != null && questionnaireStatus.getRole() != null && questionnaireStatus.getRole().equals(this.role)) {
            accepted = true;
        }

        return accepted;
    }
}
