package eu.hermeneut.domain.assets;

import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.domain.MyAsset;

import java.util.List;

public class AssetsOneShot {
    private List<MyAsset> myAssets;
    private List<DirectAsset> directAssets;
    private List<IndirectAsset> indirectAssets;

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
}
