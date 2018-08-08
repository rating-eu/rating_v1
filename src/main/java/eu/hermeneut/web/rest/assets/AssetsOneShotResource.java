package eu.hermeneut.web.rest.assets;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.assets.AssetsOneShot;
import eu.hermeneut.service.MyAssetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AssetsOneShotResource {
    private final Logger log = LoggerFactory.getLogger(AssetsOneShotResource.class);

    @Autowired
    private MyAssetService myAssetService;

    @PostMapping("/my-assets-one-shot/")
    @Timed
    public AssetsOneShot creteMyAssetsOneShot(@RequestBody AssetsOneShot assetsOneShot) {
        //===================MY ASSETS======================
        List<MyAsset> myAssets = assetsOneShot.getMyAssets();
        //ATTENTION: we are assuming that no two MyAssets linked to the same Asset are passed.
        //The only way to persist all the MyAssets at once
        //and still keep the link with the temporary ID
        //is to also map the underlying asset.ID to the temporary ID.
        //This way, once saved, will be possible to link back
        //each MyAsset to its original temp ID via its underlying asset.ID

        //Using the Asset.ID as a JOIN column
        Map<Long/*Asset.ID*/, Long/*Temp MyAsset.ID*/> myAssetsTempIDsByAssetIDMap = myAssets
            .stream()
            .collect(Collectors.toMap(
                myAsset -> myAsset.getAsset().getId(),//KeyMapper
                myAsset -> myAsset.getId()//ValueMapper (TempID)
            ));

        //Get the updated IDs
        myAssets = this.myAssetService.saveAll(myAssets);

        //Using the Asset.ID as a JOIN column
        Map<Long/*Asset.ID*/, Long/*Real MyAsset.ID*/> myAssetsRealIDsByAssetIDMap = myAssets
            .stream()
            .collect(Collectors.toMap(
                myAsset -> myAsset.getAsset().getId(),//KeyMapper
                myAsset -> myAsset.getId()//ValueMapper (RealID)
            ));

        //JOIN of Real and Temp IDs Maps
        Map<Long/*Temp MyAsset.ID*/, Long/*Real MyAsset.ID*/> myAssetsRealIDsByTempIDMap =
            myAssetsTempIDsByAssetIDMap
                .entrySet()
                .stream()
                .collect(
                    Collectors.toMap(
                        entry -> entry.getValue(),//KeyMapper (Temp ID)
                        entry -> myAssetsRealIDsByAssetIDMap.get(entry.getKey()) //(Real ID)
                    ));

        //Map each MyAsset to its Real ID
        Map<Long/*Real MyAsset.ID*/, MyAsset> myAssetsByRealIDMap = myAssets
            .stream()
            .collect(
                Collectors.toMap(
                    MyAsset::getId,
                    Function.identity()
                )
            );

        //=====================DIRECT ASSETS=====================
        List<DirectAsset> directAssets = assetsOneShot.getDirectAssets();
        //Update the DirectAsset reference to MyAsset

        for (DirectAsset directAsset : directAssets) {
            Long myAssetTempID = directAsset.getAsset().getId();
            Long myAssetRealID = myAssetsRealIDsByTempIDMap.get(myAssetTempID);

            //Update the reference to MyAsset with the Real ID one
            MyAsset myAsset = myAssetsByRealIDMap.get(myAssetRealID);
            directAsset.setAsset(myAsset);
        }




        return null;
    }
}
