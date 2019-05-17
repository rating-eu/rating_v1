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

package eu.hermeneut.service.impl;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.overview.AugmentedMyAsset;
import eu.hermeneut.domain.overview.SelfAssessmentOverview;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.repository.SelfAssessmentRepository;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.result.ResultService;
import eu.hermeneut.thread.AugmentedMyAssetsCallable;
import eu.hermeneut.utils.wp4.ListSplitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.*;

/**
 * Service Implementation for managing SelfAssessment.
 */
@Service
@Transactional
public class SelfAssessmentServiceImpl implements SelfAssessmentService {

    private final Logger LOGGER = LoggerFactory.getLogger(SelfAssessmentServiceImpl.class);

    private final SelfAssessmentRepository selfAssessmentRepository;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @Autowired
    private ResultService resultService;

    public SelfAssessmentServiceImpl(SelfAssessmentRepository selfAssessmentRepository) {
        this.selfAssessmentRepository = selfAssessmentRepository;
    }

    /**
     * Save a selfAssessment.
     *
     * @param selfAssessment the entity to save
     * @return the persisted entity
     */
    @Override
    public SelfAssessment save(SelfAssessment selfAssessment) {
        LOGGER.debug("Request to save SelfAssessment : {}", selfAssessment);
        SelfAssessment result = selfAssessmentRepository.save(selfAssessment);
        return result;
    }

    /**
     * Get all the selfAssessments.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SelfAssessment> findAll() {
        LOGGER.debug("Request to get all SelfAssessments");
        List<SelfAssessment> selfAssessments = selfAssessmentRepository.findAllWithEagerRelationships();

        return selfAssessments;
    }

    /**
     * Get one selfAssessment by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SelfAssessment findOne(Long id) {
        LOGGER.debug("Request to get SelfAssessment : {}", id);
        return selfAssessmentRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the selfAssessment by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        LOGGER.debug("Request to delete SelfAssessment : {}", id);
        selfAssessmentRepository.delete(id);
    }

    @Override
    public List<SelfAssessment> findAllByCompanyProfile(Long companyProfileID) {
        LOGGER.debug("Request to get SelfAssessment by CompanyProfile: {}", companyProfileID);
        return selfAssessmentRepository.findAllByCompanyProfile(companyProfileID);
    }

    @Override
    public SelfAssessmentOverview getSelfAssessmentOverview(Long selfAssessmentID) {
        //Get the SelfAssessment by the given ID
        SelfAssessment selfAssessment = this.findOne(selfAssessmentID);
        LOGGER.info("SelfAssessment: " + selfAssessment);

        SelfAssessmentOverview overview = new SelfAssessmentOverview();
        overview.setSelfAssessmentID(selfAssessmentID);

        List<AugmentedMyAsset> augmentedMyAssets = new LinkedList<>();
        overview.setAugmentedMyAssets(augmentedMyAssets);

        if (selfAssessment != null) {
            CompanyProfile companyProfile = selfAssessment.getCompanyProfile();

            if (companyProfile != null) {
                Set<ThreatAgent> threatAgentSet = this.resultService.getThreatAgents(companyProfile.getId());

                if (threatAgentSet != null && !threatAgentSet.isEmpty()) {
                    List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

                    if (myAssets != null && !myAssets.isEmpty()) {
                        LOGGER.debug("MyAssets: " + myAssets.size());

                        try {
                            Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessment.getCompanyProfile().getId());

                            //===Split MyAssets and handle them in different THREADS===
                            final int MY_ASSETS_PER_SINGLE_THREAD = new Random().nextInt(myAssets.size() / 3 + 1) + 2;
                            final int THREADS_PROPOSAL = myAssets.size() / MY_ASSETS_PER_SINGLE_THREAD + 1;
                            final int THREADS_AMOUNT = THREADS_PROPOSAL < myAssets.size() ? THREADS_PROPOSAL : myAssets.size();

                            Map<Integer, List<MyAsset>> splittedMyAssets = ListSplitter.split(myAssets, THREADS_AMOUNT);

                            ExecutorService executor = Executors.newFixedThreadPool(THREADS_AMOUNT);

                            //create a list to hold the Future object associated with Callable
                            List<Future<List<AugmentedMyAsset>>> futureList = new ArrayList<Future<List<AugmentedMyAsset>>>();

                            splittedMyAssets.entrySet().stream().forEach((entry) -> {
                                List<MyAsset> myAssetsSubset = entry.getValue();

                                AugmentedMyAssetsCallable augmentedMyAssetsCallable = new AugmentedMyAssetsCallable(myAssetsSubset, this.attackStrategyService, augmentedAttackStrategyMap, threatAgentSet);

                                //submit Callable tasks to be executed by thread pool
                                Future<List<AugmentedMyAsset>> future = executor.submit(augmentedMyAssetsCallable);
                                //add Future to the list, we can get return value using Future
                                futureList.add(future);
                            });

                            for (Future<List<AugmentedMyAsset>> future : futureList) {
                                try {
                                    //Future.get() waits for task to get completed
                                    augmentedMyAssets.addAll(future.get());
                                } catch (InterruptedException | ExecutionException e) {
                                    e.printStackTrace();
                                }
                            }
                        } catch (NotFoundException e) {
                            e.printStackTrace();
                        }
                    } else {

                    }
                }
            }
        } else {

        }

        LOGGER.debug("AugmentedMyAssets: " + augmentedMyAssets.size());

        return overview;
    }

    @Override
    public List<SelfAssessment> findAllByExternalAudit(ExternalAudit externalAudit) {
        LOGGER.debug("Request to get SelfAssessment by ExternalAudit: {}", externalAudit.getName());
        return selfAssessmentRepository.findAllByExternalAudit(externalAudit);
    }
}
