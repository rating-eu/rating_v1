package eu.hermeneut.domain.attackmap;

import eu.hermeneut.domain.Level;
import eu.hermeneut.domain.Phase;

import java.util.*;

public class AttackCKC7Matrix implements Map<Long, Map<Long, Set<AugmentedAttackStrategy>>> {

    private Map<Long, Map<Long, Set<AugmentedAttackStrategy>>> attackCKC7Matrix;
    /**
     * Map used to update an AugmentedAttackStrategy in time O(1).
     * The Key is the ID of the AttackStrategy and the Value is the AugmentedAttackStrategy itself.
     */
    private Map<Long/*AttackStrategy ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap;

    public AttackCKC7Matrix(Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap) {
        this.augmentedAttackStrategyMap = augmentedAttackStrategyMap;
        this.attackCKC7Matrix = new HashMap<>();

        for (Map.Entry<Long, AugmentedAttackStrategy> entry : this.augmentedAttackStrategyMap.entrySet()) {
            AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();

            for (Level level : augmentedAttackStrategy.getLevels()) {
                Map<Long, Set<AugmentedAttackStrategy>> internalMap = null;

                if (this.attackCKC7Matrix.containsKey(level.getId())) {
                    internalMap = this.attackCKC7Matrix.get(level.getId());
                } else {
                    internalMap = new HashMap<>();
                    this.attackCKC7Matrix.put(level.getId(), internalMap);
                }

                for (Phase phase : augmentedAttackStrategy.getPhases()) {
                    Set<AugmentedAttackStrategy> attackStrategySet = null;

                    if (internalMap.containsKey(phase.getId())) {
                        attackStrategySet = internalMap.get(phase.getId());
                    } else {
                        attackStrategySet = new HashSet<>();
                        internalMap.put(phase.getId(), attackStrategySet);
                    }

                    attackStrategySet.add(augmentedAttackStrategy);
                }
            }
        }
    }

    @Override
    public int size() {
        return this.attackCKC7Matrix.size();
    }

    @Override
    public boolean isEmpty() {
        return this.attackCKC7Matrix.isEmpty();
    }

    @Override
    public boolean containsKey(Object key) {
        return this.attackCKC7Matrix.containsKey(key);
    }

    @Override
    public boolean containsValue(Object value) {
        return this.attackCKC7Matrix.containsValue(value);
    }

    @Override
    public Map<Long, Set<AugmentedAttackStrategy>> get(Object key) {
        return this.attackCKC7Matrix.get(key);
    }

    @Override
    public Map<Long, Set<AugmentedAttackStrategy>> put(Long key, Map<Long, Set<AugmentedAttackStrategy>> value) {
        return this.attackCKC7Matrix.put(key, value);
    }

    @Override
    public Map<Long, Set<AugmentedAttackStrategy>> remove(Object key) {
        return this.attackCKC7Matrix.remove(key);
    }

    @Override
    public void putAll(Map<? extends Long, ? extends Map<Long, Set<AugmentedAttackStrategy>>> m) {
        this.attackCKC7Matrix.putAll(m);
    }

    @Override
    public void clear() {
        this.attackCKC7Matrix.clear();
    }

    @Override
    public Set<Long> keySet() {
        return this.attackCKC7Matrix.keySet();
    }

    @Override
    public Collection<Map<Long, Set<AugmentedAttackStrategy>>> values() {
        return this.attackCKC7Matrix.values();
    }

    @Override
    public Set<Entry<Long, Map<Long, Set<AugmentedAttackStrategy>>>> entrySet() {
        return this.attackCKC7Matrix.entrySet();
    }
}
