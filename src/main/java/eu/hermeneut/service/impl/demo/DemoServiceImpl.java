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

package eu.hermeneut.service.impl.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.hermeneut.domain.*;
import eu.hermeneut.service.*;
import eu.hermeneut.service.demo.DemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class DemoServiceImpl implements DemoService {

    @Value("classpath:demo/health-care/1) Threat Agents - Questionnaire Status.json")
    private File threatAgentsQuestionnaireStatusJSON;

    @Value("classpath:demo/health-care/2) Vulnerabilities - Questionnaire Status.json")
    private File vulnerabilitiesQuestionnaireStatusJSON;

    @Value("classpath:demo/health-care/3) Service - SelfAssessment.json")
    private File serviceJSON;

    @Value("classpath:demo/health-care/4) Service.MyAssetsAndCosts - MyAsset.json")
    private File myAssetsAndCostsJSON;

    @Value("classpath:demo/health-care/5) Service.DirectAndIndirectAssets - DirectAsset.json")
    private File directAndIndirectAssetsJSON;

    @Value("classpath:demo/health-care/6) Service Quantitative Impacts - EBIT.json")
    private File quantitativeImpactsEBITsJSON;

    @Value("classpath:demo/health-care/7) Service Quantitative Impacts - EconomicCoefficients.json")
    private File quantitativeImpactsEconomicCoefficientsJSON;

    @Value("classpath:demo/health-care/8) Service Quantitative Impacts - EconomicResults.json")
    private File quantitativeImpactsEconomicResultsJSON;

    @Value("classpath:demo/health-care/9) Service Quantitative Impacts - SplittingValues.json")
    private File quntitativeImpactsSplittingValuesJSON;

    @Value("classpath:demo/health-care/10) Service Quantitative Impacts - SplittingLosses.json")
    private File quantitativeImpactsSplittingLossesJSON;

    @Value("classpath:demo/health-care/11) Service Quantitative Impacts - GrowthRates.json")
    private File quantitativeImpactsGrowthRatesJSON;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private DirectAssetService directAssetService;

    @Autowired
    private EBITService ebitService;

    @Autowired
    private EconomicCoefficientsService economicCoefficientsService;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private SplittingValueService splittingValueService;

    @Autowired
    private SplittingLossService splittingLossService;

    @Autowired
    private GrowthRateService growthRateService;

    @Override
    public boolean loadThreatAgentsQuestionnaireStatus(User user, CompanyProfile companyProfile) {
        return this.loadQuestionnaireStatus(this.threatAgentsQuestionnaireStatusJSON, user, companyProfile);
    }

    @Override
    public boolean loadVulnerabilitiesQuestionnaireStatus(User user, CompanyProfile companyProfile) {
        return this.loadQuestionnaireStatus(this.vulnerabilitiesQuestionnaireStatusJSON, user, companyProfile);
    }

    @Override
    public boolean loadService(User user, CompanyProfile companyProfile) {
        try {
            SelfAssessment service = this.objectMapper.readValue(this.serviceJSON, SelfAssessment.class);

            service.setUser(user);
            service.setCompanyProfile(companyProfile);
            service.setCompanyGroups(new HashSet<>());

            SelfAssessment demoService = this.selfAssessmentService.save(service);
            boolean assetsLoaded = this.loadAssets(demoService);
            boolean impactsLoaded = this.loadImpacts(demoService);

            return demoService != null && assetsLoaded && impactsLoaded;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }


    private boolean loadQuestionnaireStatus(File fileJSON, User user, CompanyProfile companyProfile) {
        try {
            QuestionnaireStatus questionnaireStatus = this.objectMapper.readValue(fileJSON, QuestionnaireStatus.class);

            /*
             * 1) Change Reference to the new User
             * 2) Change Reference to the new CompanyProfile
             * 3) Change Reference of MyAnswers to the new User
             */
            questionnaireStatus.setUser(user);
            questionnaireStatus.setCompanyProfile(companyProfile);

            questionnaireStatus.getAnswers().stream().forEach((myAnswer) -> {
                myAnswer.setUser(user);
            });

            QuestionnaireStatus demo = this.questionnaireStatusService.save(questionnaireStatus);

            return demo != null;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }

    private boolean loadAssets(SelfAssessment service) {
        if (service != null) {
            MyAsset[] myAssets = new MyAsset[0];
            DirectAsset[] directAssets = new DirectAsset[0];

            try {
                // Load MyAssets
                myAssets = this.objectMapper.readValue(this.myAssetsAndCostsJSON, MyAsset[].class);

                // Load DirectAssets
                directAssets = this.objectMapper.readValue(this.directAndIndirectAssetsJSON, DirectAsset[].class);
            } catch (IOException e) {
                e.printStackTrace();
            }

            /*
             *  1) Take note of the old MyAsset.ID
             *  2) Set the IDs to null
             *  3) Set the ref to the Service (SelfAssessment)
             *  4) Persist the MyAssets and map the new ID to the old one
             */

            Map<Long, Long> oldToNewMyAssetIDsMap = new HashMap<>();
            List<MyAsset> demoMyAssets = new ArrayList<>();

            for (MyAsset myAsset : myAssets) {
                Long oldID = myAsset.getId();

                myAsset.setId(null);
                myAsset.selfAssessment(service);

                final MyAsset persisted = this.myAssetService.save(myAsset);
                demoMyAssets.add(persisted);

                Long newID = persisted.getId();

                oldToNewMyAssetIDsMap.put(oldID, newID);
            }

            /*
             *  5) Set the IDs of Direct and Indirect assets to null
             *  6) Set the ref of Direct and Indirect assets to the new MyAsset.ID
             */

            for (DirectAsset directAsset : directAssets) {
                directAsset.setId(null);

                Long oldMyAssetID = directAsset.getMyAsset().getId();
                Long newMyAssetID = oldToNewMyAssetIDsMap.get(oldMyAssetID);

                directAsset.getMyAsset().setId(newMyAssetID);

                Set<IndirectAsset> indirectAssets = directAsset.getEffects();

                if (indirectAssets != null && !indirectAssets.isEmpty()) {
                    for (IndirectAsset indirectAsset : indirectAssets) {
                        Long oldMAID = indirectAsset.getMyAsset().getId();
                        Long newMAID = oldToNewMyAssetIDsMap.get(oldMAID);

                        indirectAsset.getMyAsset().setId(newMAID);
                    }
                }

                this.directAssetService.save(directAsset);
            }

            return true;
        } else {
            return false;
        }
    }

    private boolean loadImpacts(SelfAssessment service) {
        boolean ebitsLoaded = this.loadEBITs(service);
        boolean economicCoefficientsLoaded = this.loadEconomicCoefficients(service);
        boolean economicResultsLoaded = this.loadEconomicResults(service);
        boolean splittingValuesLoaded = this.loadSplittingValues(service);
        boolean splittingLossesLoaded = this.loadSplittingLosses(service);
        boolean growthRatesLoaded = this.loadGrowthRates(service);

        return ebitsLoaded && economicCoefficientsLoaded && economicResultsLoaded
            && splittingValuesLoaded && splittingLossesLoaded && growthRatesLoaded;
    }

    private boolean loadEBITs(SelfAssessment service) {
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);

        try {
            EBIT[] ebits = this.objectMapper.readValue(this.quantitativeImpactsEBITsJSON, EBIT[].class);

            for (EBIT ebit : ebits) {
                ebit.setId(null);
                ebit.setYear(ebit.getYear() + currentYear);
                ebit.setSelfAssessment(service);
            }

            List<EBIT> demoEbits = this.ebitService.save(Arrays.asList(ebits));

            return demoEbits != null && !demoEbits.isEmpty();
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }

    private boolean loadEconomicCoefficients(SelfAssessment service) {
        try {
            EconomicCoefficients economicCoefficients = this.objectMapper
                .readValue(this.quantitativeImpactsEconomicCoefficientsJSON, EconomicCoefficients.class);

            economicCoefficients.setId(null);
            economicCoefficients.setSelfAssessment(service);

            EconomicCoefficients demoEconomicCoefficients = this.economicCoefficientsService.save(economicCoefficients);

            return demoEconomicCoefficients != null;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }

    private boolean loadEconomicResults(SelfAssessment service) {
        try {
            EconomicResults economicResults = this.objectMapper
                .readValue(this.quantitativeImpactsEconomicResultsJSON, EconomicResults.class);

            economicResults.setId(null);
            economicResults.setSelfAssessment(service);

            EconomicResults demoEconomicResults = this.economicResultsService.save(economicResults);

            return demoEconomicResults != null;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }

    private boolean loadSplittingValues(SelfAssessment service) {
        try {
            SplittingValue[] splittingValues = this.objectMapper
                .readValue(this.quntitativeImpactsSplittingValuesJSON, SplittingValue[].class);

            for (SplittingValue splittingValue : splittingValues) {
                splittingValue.setId(null);
                splittingValue.setSelfAssessment(service);
            }

            List<SplittingValue> demoSplittingValues = this.splittingValueService.save(Arrays.asList(splittingValues));

            return demoSplittingValues != null;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }

    private boolean loadSplittingLosses(SelfAssessment service) {
        try {
            SplittingLoss[] splittingLosses = this.objectMapper
                .readValue(this.quntitativeImpactsSplittingValuesJSON, SplittingLoss[].class);

            for (SplittingLoss splittingLoss : splittingLosses) {
                splittingLoss.setId(null);
                splittingLoss.setSelfAssessment(service);
            }

            List<SplittingLoss> demoSplittingLosses = this.splittingLossService.save(Arrays.asList(splittingLosses));

            return demoSplittingLosses != null;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }

    private boolean loadGrowthRates(SelfAssessment service) {
        try {
            GrowthRate[] growthRates = this.objectMapper
                .readValue(this.quantitativeImpactsGrowthRatesJSON, GrowthRate[].class);

            for (GrowthRate growthRate : growthRates) {
                growthRate.setId(null);
                growthRate.setSelfAssessment(service);
            }

            List<GrowthRate> demoGrowthRates = this.growthRateService.saveAll(Arrays.asList(growthRates));

            return demoGrowthRates != null;
        } catch (IOException e) {
            e.printStackTrace();

            return false;
        }
    }
}
