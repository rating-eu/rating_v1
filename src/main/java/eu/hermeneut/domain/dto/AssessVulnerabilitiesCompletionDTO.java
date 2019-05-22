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

package eu.hermeneut.domain.dto;

import java.io.Serializable;

public class AssessVulnerabilitiesCompletionDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private float human;
    private float it;
    private float physical;

    public float getHuman() {
        return human;
    }

    public void setHuman(float human) {
        this.human = human;
    }

    public float getIt() {
        return it;
    }

    public void setIt(float it) {
        this.it = it;
    }

    public float getPhysical() {
        return physical;
    }

    public void setPhysical(float physical) {
        this.physical = physical;
    }
}
