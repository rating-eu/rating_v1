package eu.hermeneut.domain.compact;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.Asset;

import java.io.Serializable;

public class AssetRisk implements Serializable, MaxValues {
    private static final long serialVersionUID = 1L;

    private Asset asset;

    /**
     * The risk value that the asset could cause
     * to the company if under attack.
     * This field represents a percentage value,
     * hence it assumes values between 0 and 1.
     */
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
        if (risk > 1) {
            risk = risk / MAX_LIKELIHOOD;
        }

        this.risk = risk;
    }
}
