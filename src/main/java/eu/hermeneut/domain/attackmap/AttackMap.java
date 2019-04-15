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

package eu.hermeneut.domain.attackmap;

import eu.hermeneut.domain.Level;
import eu.hermeneut.domain.Phase;

import java.util.*;

public class AttackMap implements Map<Level, Map<Phase, Set<AugmentedAttackStrategy>>> {

    private Map<Level, Map<Phase, Set<AugmentedAttackStrategy>>> attackMap;
    /**
     * Map used to update an AugmentedAttackStrategy in time O(1).
     * The Key is the ID of the AttackStrategy and the Value is the AugmentedAttackStrategy itself.
     */
    private Map<Long/*AttackStrategy ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap;

    public AttackMap(Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap) {
        this.augmentedAttackStrategyMap = augmentedAttackStrategyMap;
        this.attackMap = new HashMap<>();

        for (Map.Entry<Long, AugmentedAttackStrategy> entry : this.augmentedAttackStrategyMap.entrySet()) {
            AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();

            for (Level level : augmentedAttackStrategy.getLevels()) {
                Map<Phase, Set<AugmentedAttackStrategy>> internalMap = null;

                if (this.attackMap.containsKey(level)) {
                    internalMap = this.attackMap.get(level);
                } else {
                    internalMap = new HashMap<>();
                    this.attackMap.put(level, internalMap);
                }

                for (Phase phase : augmentedAttackStrategy.getPhases()) {
                    Set<AugmentedAttackStrategy> attackStrategySet = null;

                    if (internalMap.containsKey(phase)) {
                        attackStrategySet = internalMap.get(phase);
                    } else {
                        attackStrategySet = new HashSet<>();
                        internalMap.put(phase, attackStrategySet);
                    }

                    attackStrategySet.add(augmentedAttackStrategy);
                }
            }
        }
    }

    public Set<AugmentedAttackStrategy> get(Level level, Phase phase) {
        if (this.attackMap.containsKey(level)) {
            return this.attackMap.get(level).get(phase);
        } else {
            return null;
        }
    }

    public boolean containsKeys(Level level, Phase phase) {
        return this.attackMap.containsKey(level) && this.attackMap.get(level).containsKey(phase);
    }

    @Override
    public int size() {
        return this.attackMap.size();
    }

    @Override
    public boolean isEmpty() {
        return this.attackMap.isEmpty();
    }

    @Override
    public boolean containsKey(Object key) {
        return this.attackMap.containsKey(key);
    }

    @Override
    public boolean containsValue(Object value) {
        return this.attackMap.containsValue(value);
    }

    @Override
    public Map<Phase, Set<AugmentedAttackStrategy>> get(Object key) {
        return this.attackMap.get(key);
    }

    @Override
    public Map<Phase, Set<AugmentedAttackStrategy>> put(Level key, Map<Phase, Set<AugmentedAttackStrategy>> value) {
        return this.attackMap.put(key, value);
    }

    @Override
    public Map<Phase, Set<AugmentedAttackStrategy>> remove(Object key) {
        return this.attackMap.remove(key);
    }

    @Override
    public void putAll(Map<? extends Level, ? extends Map<Phase, Set<AugmentedAttackStrategy>>> m) {
        this.attackMap.putAll(m);
    }

    @Override
    public void clear() {
        this.attackMap.clear();
    }

    @Override
    public Set<Level> keySet() {
        return this.attackMap.keySet();
    }

    @Override
    public Collection<Map<Phase, Set<AugmentedAttackStrategy>>> values() {
        return this.attackMap.values();
    }

    @Override
    public Set<Entry<Level, Map<Phase, Set<AugmentedAttackStrategy>>>> entrySet() {
        return this.attackMap.entrySet();
    }
}
