package eu.hermeneut.web.rest.assets;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.assets.AssetsOneShot;
import eu.hermeneut.service.AttackCostService;
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

    @Autowired
    private AttackCostService attackCostService;

    @PostMapping("/my-assets-one-shot/")
    @Timed
    public AssetsOneShot createMyAssetsOneShot(@RequestBody AssetsOneShot assetsOneShot) {
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

        //Effects
        Map<Long/*DirectAsset.TempID*/, Set<Long>/*EffectsRealID*/> indirectEffectsRealIDsByDirectTempIDsMap = new HashMap<>();
        Map<Long/*DirectAsset.RealID*/, Set<IndirectAsset>> indirectEffectsByDirectRealIDMap = new HashMap<>();

        //=======Costs======
        //Map the costs by direct assets TempID
        Map<Long/*DirectAsset.TempID*/, Set<AttackCost>> costsByDirectAssetTempID =
            directAssetsByTempIDMap
                .entrySet()
                .stream()
                .collect(
                    Collectors.toMap(
                        entry -> entry.getKey(),
                        entry -> entry.getValue().getCosts()
                    )
                );


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

        //=======Costs======
        //Map the costs by indirect assets TempID
        Map<Long/*DirectAsset.TempID*/, Set<AttackCost>> costsByIndirectAssetTempID =
            indirectAssetsByTemMap
                .entrySet()
                .stream()
                .collect(
                    Collectors.toMap(
                        entry -> entry.getKey(),
                        entry -> entry.getValue().getCosts()
                    )
                );

        for (IndirectAsset indirectAsset : indirectAssets) {
            Long myAssetTempID = indirectAsset.getMyAsset().getId();
            Long myAssetRealID = myAssetsRealIDsByTempIDMap.get(myAssetTempID);

            //Update the reference to MyAsset with the Real ID one
            MyAsset myAsset = myAssetsByRealIDMap.get(myAssetRealID);
            indirectAsset.setMyAsset(myAsset);

            //TODO remove effect from parent DirectAsset
            DirectAsset directAsset = indirectAsset.getDirectAsset();
            Long directTempID = directAsset.getId();
            directAsset.setEffects(null);

            Long myAssetTempIDForDirect = directAsset.getMyAsset().getId();//MyAsset TempID
            Long myAssetRealIDForDirect = myAssetsRealIDsByAssetIDMap.get(myAssetTempIDForDirect);


            //Update the reference to MyAsset with the Real ID one
            MyAsset myAssetForDirect = myAssetsByRealIDMap.get(myAssetRealIDForDirect);
            directAsset.setMyAsset(myAssetForDirect);

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

                //Update
                //TODO BUG
                updatedDirectAsset = this.directAssetService.save(updatedDirectAsset);
            } else {//Not saved yet
                //Save Direct Asset
                //When here, it means that this direct has no indirect assets as effects

                //Update the reference to MyAsset with the Real ID one
                Long myAssetTempID = directAsset.getMyAsset().getId();//MyAsset temp ID
                Long myAssetRealID = myAssetsRealIDsByTempIDMap.get(myAssetTempID);

                MyAsset myAsset = myAssetsByRealIDMap.get(myAssetRealID);
                directAsset.setMyAsset(myAsset);

                directAsset.setId(null);
                directAsset = this.directAssetService.save(directAsset);

                realDirectID = directAsset.getId();

                directAssetsRealIDsByTempIDsMap.put(directTempID, realDirectID);
                directAssetByRealIDMap.put(realDirectID, directAsset);
            }
        }

        //Update my costs with real DirectAssets IDs
        costsByDirectAssetTempID
            .forEach((directAssetTempID, directAssetCosts) -> {
                Long directAssetRealID = directAssetsRealIDsByTempIDsMap.get(directAssetTempID);
                DirectAsset directAsset = directAssetByRealIDMap.get(directAssetRealID);

                directAssetCosts.forEach(attackCost -> {
                    attackCost.setDirectAsset(directAsset);
                });
            });

        costsByIndirectAssetTempID
            .forEach((indirectAssetTempID, indirectAssetCosts) -> {
                Long indirectAssetRealID = indirectAssetsRealIDsByTempIDsMap.get(indirectAssetTempID);
                IndirectAsset indirectAsset = indirectAssetByRealIDMap.get(indirectAssetRealID);

                indirectAssetCosts.forEach(attackCost -> {
                    attackCost.setIndirectAsset(indirectAsset);
                });
            });

        //Persist AttackCosts
        List<AttackCost> attackCosts = new ArrayList<>();

        for (Map.Entry<Long, Set<AttackCost>> entry : costsByDirectAssetTempID.entrySet()) {
            Long directAssetTempID = entry.getKey();
            Set<AttackCost> costs = entry.getValue();

            attackCosts.addAll(costs);
        }

        for (Map.Entry<Long, Set<AttackCost>> entry : costsByIndirectAssetTempID.entrySet()) {
            Long indirectAssetTempID = entry.getKey();
            Set<AttackCost> costs = entry.getValue();

            attackCosts.addAll(costs);
        }

        if (!(attackCosts == null || attackCosts.size() == 0)) {
            attackCosts = this.attackCostService.save(attackCosts);
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
        result.setAttackCosts(attackCosts);

        return result;
    }

    @PostMapping("/my-assets-one-shot2/")
    @Timed
    public AssetsOneShot createMyAssetsOneShot2(@RequestBody AssetsOneShot assetsOneShot) {
        //===Save MyAssets===
        List<MyAsset> myAssets = assetsOneShot.getMyAssets();
        Map<Long/*MyAsset.Temp-ID*/, MyAsset/*with Real-ID*/> myAssetMap = new HashMap<>();

        for (MyAsset myAsset : myAssets) {
            Long tempID = myAsset.getId();
            myAsset.setId(null);
            MyAsset saved = this.myAssetService.save(myAsset);

            myAssetMap.put(tempID, saved);
        }

        //===Save DirectAssets===
        List<DirectAsset> directAssets = assetsOneShot.getDirectAssets();
        Map<Long/*DirectAsset.Temp-ID*/, DirectAsset/*with Real-ID*/> directAssetMap = new HashMap<>();

        for (DirectAsset directAsset : directAssets) {
            Long tempID = directAsset.getId();
            directAsset.setId(null);

            //Update MyAsset reference
            Long myAssetTempID = directAsset.getMyAsset().getId();
            directAsset.setMyAsset(myAssetMap.get(myAssetTempID));

            DirectAsset saved = this.directAssetService.save(directAsset);

            directAssetMap.put(tempID, saved);
        }

        //===Save IndirectAssets===
        List<IndirectAsset> indirectAssets = assetsOneShot.getIndirectAssets();
        Map<Long/*IndirectAsset.Temp-ID*/, IndirectAsset/*with Real-ID*/> indirectAssetMap = new HashMap<>();

        for (IndirectAsset indirectAsset : indirectAssets) {
            Long tempID = indirectAsset.getId();
            indirectAsset.setId(null);

            //Update MyAsset reference
            Long myAssetTempID = indirectAsset.getMyAsset().getId();
            indirectAsset.setMyAsset(myAssetMap.get(myAssetTempID));

            //Update DirectAsset reference
            Long directTempID = indirectAsset.getDirectAsset().getId();
            indirectAsset.setDirectAsset(directAssetMap.get(directTempID));

            IndirectAsset saved = this.indirectAssetService.save(indirectAsset);

            indirectAssetMap.put(tempID, saved);
        }

        //===Save AttackCosts===
        List<AttackCost> attackCosts = assetsOneShot.getAttackCosts();
        Map<Long/*AttackCost.Temp-ID*/, AttackCost/*with Real-ID*/> attackCostMap = new HashMap<>();

        for (AttackCost attackCost : attackCosts) {
            Long tempID = attackCost.getId();
            attackCost.setId(null);

            //Update AttackCost's source
            if (attackCost.getDirectAsset() != null) {
                Long directAssetTempID = attackCost.getDirectAsset().getId();
                attackCost.setDirectAsset(directAssetMap.get(directAssetTempID));
            } else if (attackCost.getIndirectAsset() != null) {
                Long indirectAssetTempID = attackCost.getIndirectAsset().getId();
                attackCost.setIndirectAsset(indirectAssetMap.get(indirectAssetTempID));
            }

            //Save it
            AttackCost saved = this.attackCostService.save(attackCost);
            attackCostMap.put(tempID, saved);
        }

        //Return Result with saved entities
        AssetsOneShot result = new AssetsOneShot();
        result.setMyAssets(myAssetMap.values().stream().collect(Collectors.toList()));
        result.setDirectAssets(directAssetMap.values().stream().collect(Collectors.toList()));
        result.setIndirectAssets(indirectAssetMap.values().stream().collect(Collectors.toList()));
        result.setAttackCosts(attackCostMap.values().stream().collect(Collectors.toList()));

        return result;
    }
}
