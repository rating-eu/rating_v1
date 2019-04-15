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

package eu.hermeneut.domain.assets;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.domain.MyAsset;

import java.util.List;

public class AssetsOneShot {
    private List<MyAsset> myAssets;
    private List<DirectAsset> directAssets;
    private List<IndirectAsset> indirectAssets;
    private List<AttackCost> attackCosts;

    public List<MyAsset> getMyAssets() {
        return myAssets;
    }

    public void setMyAssets(List<MyAsset> myAssets) {
        this.myAssets = myAssets;
    }

    public List<DirectAsset> getDirectAssets() {
        return directAssets;
    }

    public void setDirectAssets(List<DirectAsset> directAssets) {
        this.directAssets = directAssets;
    }

    public List<IndirectAsset> getIndirectAssets() {
        return indirectAssets;
    }

    public void setIndirectAssets(List<IndirectAsset> indirectAssets) {
        this.indirectAssets = indirectAssets;
    }

    public List<AttackCost> getAttackCosts() {
        return attackCosts;
    }

    public void setAttackCosts(List<AttackCost> attackCosts) {
        this.attackCosts = attackCosts;
    }
}
