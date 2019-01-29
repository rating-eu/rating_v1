package eu.hermeneut.service.impl;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.service.AttackCostParamService;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.repository.MyAssetRepository;
import eu.hermeneut.repository.search.MyAssetSearchRepository;
import eu.hermeneut.service.attack.cost.AttackCostSwitch;
import org.hibernate.cfg.NotYetImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing MyAsset.
 */
@Service
@Transactional
public class MyAssetServiceImpl implements MyAssetService {

    private final Logger log = LoggerFactory.getLogger(MyAssetServiceImpl.class);

    private final MyAssetRepository myAssetRepository;

    private final MyAssetSearchRepository myAssetSearchRepository;

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    private AttackCostParamService attackCostParamService;

    @Autowired
    private AttackCostSwitch attackCostSwitch;

    public MyAssetServiceImpl(MyAssetRepository myAssetRepository, MyAssetSearchRepository myAssetSearchRepository) {
        this.myAssetRepository = myAssetRepository;
        this.myAssetSearchRepository = myAssetSearchRepository;
    }


    /**
     * Save a myAsset.
     *
     * @param myAsset the entity to save
     * @return the persisted entity
     */
    @Override
    public MyAsset save(MyAsset myAsset) {
        log.debug("Request to save MyAsset : {}", myAsset);

        if (myAsset.getId() != null) {
            MyAsset existingMyAsset = this.myAssetRepository.findOne(myAsset.getId());

            if (existingMyAsset != null) {
                Map<Long, AttackCost> existingCostsByID = existingMyAsset.getCosts().stream()
                    .collect(Collectors.toMap(o -> o.getId(), Function.identity()));

                // ConfirmedCosts (id != null)
                Map<Long, AttackCost> confirmedCostsByID = myAsset.getCosts().stream()
                    .filter((attackCost) -> attackCost.getId() != null)
                    .collect(Collectors.toMap(o -> o.getId(), Function.identity()));

                //Deleted costs
                Map<Long, AttackCost> deletedCostsByID = existingCostsByID.values().stream()
                    .filter((attackCost -> !confirmedCostsByID.containsKey(attackCost.getId())))
                    .collect(Collectors.toMap(o -> o.getId(), Function.identity()));

                // Delete the costs not present anymore.
                deletedCostsByID.values().stream().forEach((attackCost) -> {
                    this.attackCostService.delete(attackCost.getId());
                });
            }
        }

        if (myAsset.getCosts() != null && !myAsset.getCosts().isEmpty()) {
            myAsset.getCosts().stream().forEach((attackCost) -> {
                attackCost.setMyAsset(myAsset);
            });
        }

        MyAsset result = myAssetRepository.save(myAsset);
        myAssetSearchRepository.save(result);

        if (result != null) {
            Set<AttackCost> costs = result.getCosts();
            Long selfID = result.getSelfAssessment().getId();

            if (costs != null) {
                try {
                    List<AttackCostParam> attackCostParams = this.attackCostParamService.findAllBySelfAssessment(selfID);

                    if (attackCostParams != null && !attackCostParams.isEmpty()) {
                        for (AttackCost cost : costs) {
                            try {
                                //Updates siblings too.
                                this.attackCostSwitch.calculateCost(selfID, cost.getType(), attackCostParams);
                            } catch (IllegalInputException e) {
                                e.printStackTrace();
                            } catch (NotImplementedYetException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                } catch (NotFoundException e) {
                    e.printStackTrace();
                }

            }
        }

        return result;
    }

    @Override
    public List<MyAsset> saveAll(List<MyAsset> myAssets) {
        log.debug("Request to save all MyAssets : {}", Arrays.toString(myAssets.toArray()));

        myAssets.stream().filter((myAsset) -> myAsset.getCosts() != null && !myAsset.getCosts().isEmpty()).forEach(
            (myAsset) -> {
                myAsset.getCosts().forEach((attackCost) -> {
                    attackCost.setMyAsset(myAsset);
                });
            }
        );

        List<MyAsset> result = myAssetRepository.save(myAssets);
        myAssetSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the myAssets.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAsset> findAll() {
        log.debug("Request to get all MyAssets");
        return myAssetRepository.findAll();
    }

    /**
     * Get one myAsset by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public MyAsset findOne(Long id) {
        log.debug("Request to get MyAsset : {}", id);
        return myAssetRepository.findOne(id);
    }

    @Override
    public MyAsset findOneByIDAndSelfAssessment(Long myAssetID, Long selfAssessmentID) {
        log.debug("Request to get MyAsset by ID: {} and SelfAssessment: {}", myAssetID, selfAssessmentID);
        return myAssetRepository.findOneByIDAndSelfAssessment(myAssetID, selfAssessmentID);
    }

    /**
     * Delete the myAsset by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete MyAsset : {}", id);
        myAssetRepository.delete(id);
        myAssetSearchRepository.delete(id);
    }

    /**
     * Search for the myAsset corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAsset> search(String query) {
        log.debug("Request to search MyAssets for query {}", query);
        return StreamSupport
            .stream(myAssetSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public List<MyAsset> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all MyAssets by SelfAssessment ID");
        return myAssetRepository.findAllBySelfAssessment(selfAssessmentID);
    }

    @Override
    public List<MyAsset> findAllBySelfAssessmentAndAssetType(Long selfAssessmentID, AssetType assetType) {
        log.debug("Request to get all MyAssets by SelfAssessment ID and AssetType: " + assetType);
        return this.myAssetRepository.findAllBySelfAssessmentAndAssetType(selfAssessmentID, assetType);
    }
}
