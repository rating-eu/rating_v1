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
import eu.hermeneut.domain.dashboard.ImpactEvaluationStatus;
import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.domain.enumeration.CompType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private EBITService ebitService;

    @Autowired
    private EconomicCoefficientsService economicCoefficientsService;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private SplittingLossService splittingLossService;

    @Autowired
    private SplittingValueService splittingValueService;

    @Override
    public ImpactEvaluationStatus getImpactEvaluationStatus(Long selfAssessmentID) throws NullInputException, NotFoundException {
        if (selfAssessmentID == null) {
            throw new NullInputException("SelfAssessmentID CANNOT BE NULL!");
        }

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID " + selfAssessmentID + " NOT FOUND!");
        }

        //Building output
        ImpactEvaluationStatus impactEvaluationStatus = new ImpactEvaluationStatus();

        List<EBIT> ebits = this.ebitService.findAllBySelfAssessment(selfAssessmentID);
        if (ebits == null || ebits.size() != 6) {
            throw new NotFoundException("EBITs for SelfAssessment with ID " + selfAssessmentID + " not found!");
        } else {
            impactEvaluationStatus.setEbits(new HashSet<>(ebits));
        }

        EconomicCoefficients economicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID
            (selfAssessmentID);
        if (economicCoefficients == null) {
            throw new NotFoundException("EconomicCoefficients for SelfAssessment with ID " + selfAssessmentID + " not" +
                " found!");
        } else {
            impactEvaluationStatus.setEconomicCoefficients(economicCoefficients);
        }

        EconomicResults economicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);
        if (economicResults == null) {
            throw new NotFoundException("EconomicResults for SelfAssessment with ID " + selfAssessmentID + " not" +
                " found!");
        } else {
            impactEvaluationStatus.setEconomicResults(economicResults);
        }

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessmentAndAssetType(selfAssessmentID, AssetType.TANGIBLE);

        if (myAssets == null || myAssets.size() == 0) {
            throw new NotFoundException("Tangible MyAssets for SelfAssessment with ID " + selfAssessmentID + " not" +
                " found!");
        } else {
            impactEvaluationStatus.setMyTangibleAssets(new HashSet<>(myAssets));
        }

        List<SplittingLoss> splittingLosses = splittingLossService.findAllBySelfAssessmentID(selfAssessmentID);

        if (splittingLosses != null && !splittingLosses.isEmpty()) {
            SectorType sectorType = splittingLosses.get(0).getSectorType();

            if (sectorType != null) {
                impactEvaluationStatus.setSectorType(sectorType);
            }
        }

        // Add the SplittingLoss for DATA Asssets
        SplittingLoss dataSplittingLoss = this.splittingLossService.getDATASplittingLossBySelfAssessmentID(selfAssessmentID);
        if (dataSplittingLoss != null) {
            splittingLosses.add(dataSplittingLoss);
        }

        /*
        CategoryType is set to null.
         */
        impactEvaluationStatus.setCategoryType(null);

        impactEvaluationStatus.setSplittingLosses(new HashSet<>(splittingLosses));

        List<SplittingValue> splittingValues = this.splittingValueService.findAllBySelfAssessmentID(selfAssessmentID);
        impactEvaluationStatus.setSplittingValues(new HashSet<>(splittingValues));

        return impactEvaluationStatus;
    }
}
