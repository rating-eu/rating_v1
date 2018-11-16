package eu.hermeneut.domain.compact;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.Asset;
import eu.hermeneut.domain.AssetCategory;
import org.apache.commons.math3.util.Precision;

import java.io.Serializable;

public class AssetRisk implements Serializable, MaxValues {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String description;

    private AssetCategory assetCategory;

    /**
     * The risk value that the asset could cause
     * to the company if under attack.
     * This field represents a percentage value,
     * hence it assumes values between 0 and 1.
     */
    private Float risk;


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

    public AssetCategory getAssetCategory() {
        return assetCategory;
    }

    public void setAssetCategory(AssetCategory assetCategory) {
        this.assetCategory = assetCategory;
    }

    public Float getRisk() {
        return risk;
    }

    public void setRisk(Float risk) {
        if (risk < 0 || risk > 1) {
            throw new IllegalArgumentException("Risk must be normalized to a value between 0 and 1");
        }

        this.risk = Precision.round(risk, 2);
    }
}
