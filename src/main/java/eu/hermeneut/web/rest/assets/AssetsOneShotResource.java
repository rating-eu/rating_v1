package eu.hermeneut.web.rest.assets;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.assets.AssetsOneShot;
import eu.hermeneut.service.DirectAssetService;
import eu.hermeneut.service.IndirectAssetService;
import eu.hermeneut.service.MyAssetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AssetsOneShotResource {
    private final Logger log = LoggerFactory.getLogger(AssetsOneShotResource.class);

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private DirectAssetService directAssetService;

    @Autowired
    private IndirectAssetService indirectAssetService;

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

        //Remove the temp ID of each MyAsset before saving it
        for (MyAsset myAsset : myAssets) {
            myAsset.setId(null);
        }

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
        Map<Long/*TempID*/, DirectAsset> directAssetsByTempIDMap = directAssets
            .stream()
            .collect(
                Collectors.toMap(
                    DirectAsset::getId,//Temp ID
                    Function.identity()
                )
            );

        Map<Long/*TempID*/, Long/*RealID*/> directAssetsRealIDsByTempIDsMap = new HashMap<>();
        Map<Long/*RealID*/, DirectAsset> directAssetByRealIDMap = new HashMap<>();

        Map<Long/*TempID*/, Set<IndirectAsset>> effectsByDirectTempIDMap =
            directAssets
                .stream()
                .collect(
                    Collectors.toMap(
                        DirectAsset::getId,//Temp ID
                        directAsset -> directAsset.getEffects()
                    )
                );

        //Effects
        Map<Long/*DirectAsset.TempID*/, Set<Long>/*EffectsRealID*/> indirectEffectsRealIDsByDirectTempIDsMap = new HashMap<>();
        Map<Long/*DirectAsset.RealID*/, Set<IndirectAsset>> indirectEffectsByDirectRealIDMap = new HashMap<>();

        //Costs
        Map<Long/*DirectAsset.TempID*/, Set<AttackCost>> costsByDirectAssetTempID = new HashMap<>();
        //TODO
        //Map the costs by direct assets

        //=====================INDIRECT ASSETS=====================
        List<IndirectAsset> indirectAssets = assetsOneShot.getIndirectAssets();
        Map<Long/*TempID*/, IndirectAsset> indirectAssetsByTemMap = indirectAssets
            .stream()
            .collect(Collectors.toMap(
                IndirectAsset::getId,
                Function.identity()
            ));

        Map<Long/*TempID*/, Long/*RealID*/> indirectAssetsRealIDsByTempIDsMap = new HashMap<>();
        Map<Long/*RealID*/, IndirectAsset> indirectAssetByRealIDMap = new HashMap<>();

        //Costs
        Map<Long/*DirectAsset.TempID*/, Set<AttackCost>> costsByIndirectAssetTempID = new HashMap<>();
        //TODO
        //Map the costs by indirect assets

        for (IndirectAsset indirectAsset : indirectAssets) {
            Long myAssetTempID = indirectAsset.getAsset().getId();
            Long myAssetRealID = myAssetsRealIDsByTempIDMap.get(myAssetTempID);

            //Update the reference to MyAsset with the Real ID one
            MyAsset myAsset = myAssetsByRealIDMap.get(myAssetRealID);
            indirectAsset.setAsset(myAsset);

            //TODO remove effect from parent DirectAsset
            DirectAsset directAsset = indirectAsset.getDirectAsset();
            Long directTempID = directAsset.getId();
            directAsset.setEffects(null);

            Long myAssetTempIDForDirect = directAsset.getAsset().getId();//MyAsset TempID
            Long myAssetRealIDForDirect = myAssetsRealIDsByAssetIDMap.get(myAssetTempIDForDirect);


            //Update the reference to MyAsset with the Real ID one
            MyAsset myAssetForDirect = myAssetsByRealIDMap.get(myAssetRealIDForDirect);
            directAsset.setAsset(myAssetForDirect);

            //TODO Save the underlying DirectAsset if not done yet
            if (directAssetsRealIDsByTempIDsMap.containsKey(directTempID)) {//Direct already persisted
                Long directAssetRealID = directAssetsRealIDsByTempIDsMap.get(directTempID);
                directAsset = directAssetByRealIDMap.get(directAssetRealID);
            } else {
                //NOT saved yet
                directAsset.setId(null);
                directAsset = this.directAssetService.save(directAsset);

                //Temp ID --> Real ID mapping
                directAssetsRealIDsByTempIDsMap.put(directTempID, directAsset.getId());

                directAssetByRealIDMap.put(directAsset.getId(), directAsset);
            }

            //TODO Update the Direct reference of the IndirectAsset
            indirectAsset.setDirectAsset(directAsset);

            //TODO
            //Save the indirectAsset
            Long indirectAssetTempID = indirectAsset.getId();
            indirectAsset.setId(null);
            indirectAsset = this.indirectAssetService.save(indirectAsset);

            //Update Maps
            indirectAssetsRealIDsByTempIDsMap.put(indirectAssetTempID, indirectAsset.getId());
            indirectAssetByRealIDMap.put(indirectAsset.getId(), indirectAsset);


            //Map<Long/*DirectTempID*/, Set<Long>/*EffectsRealID*/> indirectEffectsRealIDsByDirectTempIDsMap = new HashMap<>();
            //Map<Long/*RealID*/, Set<IndirectAsset>> indirectAssetByDirectRealIDMap = new HashMap<>();

            //Update IDs maps
            if (indirectEffectsRealIDsByDirectTempIDsMap.containsKey(directTempID)) {
                Set<Long> effectsRealIDs = indirectEffectsRealIDsByDirectTempIDsMap.get(directTempID);
                effectsRealIDs.add(indirectAsset.getId());
            } else {
                Set<Long> effectsRealIDs = new HashSet<>();
                effectsRealIDs.add(indirectAsset.getId());
                indirectEffectsRealIDsByDirectTempIDsMap.put(directTempID, effectsRealIDs);
            }

            //Update Values maps
            if (indirectEffectsByDirectRealIDMap.containsKey(directAsset.getId())) {
                Set<IndirectAsset> effects = indirectEffectsByDirectRealIDMap.get(directAsset.getId());
                effects.add(indirectAsset);
            } else {
                Set<IndirectAsset> effects = new HashSet<>();
                effects.add(indirectAsset);
                indirectEffectsByDirectRealIDMap.put(directAsset.getId(), effects);
            }
        }

        for (DirectAsset directAsset : directAssets) {
            Long directTempID = directAsset.getId();
            Long realDirectID;

            if (directAssetsRealIDsByTempIDsMap.containsKey(directTempID)) {//Already Saved
                realDirectID = directAssetsRealIDsByTempIDsMap.get(directTempID);

                //Get the persisted DirectAsset
                DirectAsset updatedDirectAsset = directAssetByRealIDMap.get(realDirectID);

                //Link effects (Indirects)
                Set<IndirectAsset> effects = indirectEffectsByDirectRealIDMap.get(realDirectID);
                updatedDirectAsset.setEffects(effects);

                //Update
                //TODO BUG
                updatedDirectAsset = this.directAssetService.save(updatedDirectAsset);
            } else {//Not saved yet
                //Save Direct Asset
                //When here, it means that this direct has no indirect assets as effects

                //Update the reference to MyAsset with the Real ID one
                Long myAssetTempID = directAsset.getAsset().getId();//MyAsset temp ID
                Long myAssetRealID = myAssetsRealIDsByTempIDMap.get(myAssetTempID);

                MyAsset myAsset = myAssetsByRealIDMap.get(myAssetRealID);
                directAsset.setAsset(myAsset);

                directAsset.setId(null);
                directAsset = this.directAssetService.save(directAsset);

                realDirectID = directAsset.getId();

                directAssetsRealIDsByTempIDsMap.put(directTempID, realDirectID);
                directAssetByRealIDMap.put(realDirectID, directAsset);
            }
        }


        //Get updated values
        List<MyAsset> updatedMyAssets = myAssetsByRealIDMap
            .values()
            .stream()
            .collect(Collectors.toList());

        List<DirectAsset> updatedDirectAssets = directAssetByRealIDMap
            .values()
            .stream()
            .collect(Collectors.toList());

        List<IndirectAsset> updatedIndirectAssets = indirectAssetByRealIDMap
            .values()
            .stream()
            .collect(Collectors.toList());


        AssetsOneShot result = new AssetsOneShot();
        result.setMyAssets(updatedMyAssets);
        result.setDirectAssets(updatedDirectAssets);
        result.setIndirectAssets(updatedIndirectAssets);

        return result;
    }


}
