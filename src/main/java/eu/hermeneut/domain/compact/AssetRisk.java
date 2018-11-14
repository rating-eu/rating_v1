package eu.hermeneut.domain.compact;

import eu.hermeneut.domain.Asset;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.Serializable;

public class AssetRisk implements Serializable {
    private static final long serialVersionUID = 1L;

    private Asset asset;

    /**
     * The risk value that the asset could cause
     * to the company if under attack.
     * This field represents a percentage value,
     * hence it assumes values between 0 and 1.
     */
    @Min(0)
    @Max(1)
    private Float risk;

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public Float getRisk() {
        return risk;
    }

    public void setRisk(Float risk) {
        this.risk = risk;
    }
}
