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

package eu.hermeneut.domain.enumeration;

/**
 * The Intent enumeration.
 * This defines whether the @{@link eu.hermeneut.domain.ThreatAgent} intends to cause harm.
 */
public enum Intent {
    /**
     * The @{@link eu.hermeneut.domain.ThreatAgent} starts with the intent to harm or
     * inappropriately use Intel assets, and the agent takes deliberate actions to achieve that result.
     */
    HOSTILE,
    /**
     * The @{@link eu.hermeneut.domain.ThreatAgent} is friendly and intends to protect Intel assets,
     * but accidentally or mistakenly takes actions that result in harm.
     */
    NON_HOSTILE
}
