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

import eu.hermeneut.domain.Asset;
import eu.hermeneut.domain.AssetCategory;

import java.io.Serializable;

public class AssetDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public AssetDTO(Asset asset) {
        this.id = asset.getId();
        this.name = asset.getName();
        this.description = asset.getDescription();
        this.assetcategory = asset.getAssetcategory();
        this.directlyVulnerable = asset.getDirectlyVulnerable();
        this.indirectlyVulnerable = asset.getIndirectlyVulnerable();
    }

    private Long id;

    private String name;

    private String description;

    private AssetCategory assetcategory;

    private Boolean directlyVulnerable = false;

    private Boolean indirectlyVulnerable = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AssetCategory getAssetcategory() {
        return assetcategory;
    }

    public void setAssetcategory(AssetCategory assetcategory) {
        this.assetcategory = assetcategory;
    }

    public Boolean getDirectlyVulnerable() {
        return directlyVulnerable;
    }

    public void setDirectlyVulnerable(Boolean directlyVulnerable) {
        this.directlyVulnerable = directlyVulnerable;
    }

    public Boolean getIndirectlyVulnerable() {
        return indirectlyVulnerable;
    }

    public void setIndirectlyVulnerable(Boolean indirectlyVulnerable) {
        this.indirectlyVulnerable = indirectlyVulnerable;
    }
}
