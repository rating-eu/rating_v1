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
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Service
public class DemoServiceImpl implements DemoService {

    @Autowired
    private ResourceLoader resourceLoader;

    private Resource threatAgentsQuestionnaireStatusJSON;

    private Resource vulnerabilitiesQuestionnaireStatusJSON;

    private Resource serviceJSON;

    private Resource myAssetsAndCostsJSON;

    private Resource directAndIndirectAssetsJSON;

    private Resource quantitativeImpactsEBITsJSON;

    private Resource quantitativeImpactsEconomicCoefficientsJSON;

    private Resource quantitativeImpactsEconomicResultsJSON;

    private Resource quantitativeImpactsSplittingValuesJSON;

    private Resource quantitativeImpactsSplittingLossesJSON;

    private Resource quantitativeImpactsGrowthRatesJSON;

    private Resource gdprDataOperationJSON;

    private Resource gdprOverallDataThreatJSON;

    private Resource gdprOverallSecurityImpactJSON;

    private Resource gdprOverallDataRiskJSON;

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

    @Autowired
    private DataOperationService dataOperationService;

    @Autowired
    private OverallDataThreatService overallDataThreatService;

    @Autowired
    private OverallSecurityImpactService overallSecurityImpactService;

    @Autowired
    private OverallDataRiskService overallDataRiskService;

    @PostConstruct
    public void init() {
        this.threatAgentsQuestionnaireStatusJSON = this.resourceLoader.getResource("classpath:demo/health-care/1) Threat Agents - Questionnaire Status.json");
        this.vulnerabilitiesQuestionnaireStatusJSON = this.resourceLoader.getResource("classpath:demo/health-care/2) Vulnerabilities - Questionnaire Status.json");

        this.serviceJSON = this.resourceLoader.getResource("classpath:demo/health-care/3) Service - SelfAssessment.json");
        this.myAssetsAndCostsJSON = this.resourceLoader.getResource("classpath:demo/health-care/4) Service.MyAssetsAndCosts - MyAsset.json");
        this.directAndIndirectAssetsJSON = this.resourceLoader.getResource("classpath:demo/health-care/5) Service.DirectAndIndirectAssets - DirectAsset.json");

        this.quantitativeImpactsEBITsJSON = this.resourceLoader.getResource("classpath:demo/health-care/6) Service Quantitative Impacts - EBIT.json");
        this.quantitativeImpactsEconomicCoefficientsJSON = this.resourceLoader.getResource("classpath:demo/health-care/7) Service Quantitative Impacts - EconomicCoefficients.json");
        this.quantitativeImpactsEconomicResultsJSON = this.resourceLoader.getResource("classpath:demo/health-care/8) Service Quantitative Impacts - EconomicResults.json");
        this.quantitativeImpactsSplittingValuesJSON = this.resourceLoader.getResource("classpath:demo/health-care/9) Service Quantitative Impacts - SplittingValues.json");
        this.quantitativeImpactsSplittingLossesJSON = this.resourceLoader.getResource("classpath:demo/health-care/10) Service Quantitative Impacts - SplittingLosses.json");
        this.quantitativeImpactsGrowthRatesJSON = this.resourceLoader.getResource("classpath:demo/health-care/11) Service Quantitative Impacts - GrowthRates.json");

        this.gdprDataOperationJSON = this.resourceLoader.getResource("classpath:demo/health-care/12) GDPR - DataOperation.json");
        this.gdprOverallDataThreatJSON = this.resourceLoader.getResource("classpath:demo/health-care/13) GDPR - OverallDataThreat.json");
        this.gdprOverallSecurityImpactJSON = this.resourceLoader.getResource("classpath:demo/health-care/14) GDPR - OverallSecurityImpact.json");
        this.gdprOverallDataRiskJSON = this.resourceLoader.getResource("classpath:demo/health-care/15) GDPR - OverallDataRisk.json");
    }

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
            SelfAssessment service = this.objectMapper.readValue(this.serviceJSON.getInputStream(), SelfAssessment.class);

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

    @Override
    public boolean loadGDPR(User currentUser, CompanyProfile companyProfile) {
        DataOperation demoDataOperation = this.loadGDPRDataOperation(companyProfile);

        if (demoDataOperation != null) {
            OverallDataThreat overallDataThreat = this.loadOverallDataThreat(demoDataOperation);

            // The next steps are already performed as AOP
            //OverallSecurityImpact overallSecurityImpact = this.loadOverallSecurityImpact(demoDataOperation);
            //OverallDataRisk overallDataRisk = this.loadOverallDataRisk(demoDataOperation);

            return overallDataThreat != null;
        } else {
            return false;
        }
    }


    private boolean loadQuestionnaireStatus(Resource inputJSON, User user, CompanyProfile companyProfile) {
        try {
            QuestionnaireStatus questionnaireStatus = this.objectMapper.readValue(inputJSON.getInputStream(), QuestionnaireStatus.class);

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
                myAssets = this.objectMapper.readValue(this.myAssetsAndCostsJSON.getInputStream(), MyAsset[].class);

                // Load DirectAssets
                directAssets = this.objectMapper.readValue(this.directAndIndirectAssetsJSON.getInputStream(), DirectAsset[].class);
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
            EBIT[] ebits = this.objectMapper.readValue(this.quantitativeImpactsEBITsJSON.getInputStream(), EBIT[].class);

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
                .readValue(this.quantitativeImpactsEconomicCoefficientsJSON.getInputStream(), EconomicCoefficients.class);

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
                .readValue(this.quantitativeImpactsEconomicResultsJSON.getInputStream(), EconomicResults.class);

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
                .readValue(this.quantitativeImpactsSplittingValuesJSON.getInputStream(), SplittingValue[].class);

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
                .readValue(this.quantitativeImpactsSplittingValuesJSON.getInputStream(), SplittingLoss[].class);

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
                .readValue(this.quantitativeImpactsGrowthRatesJSON.getInputStream(), GrowthRate[].class);

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

    private DataOperation loadGDPRDataOperation(CompanyProfile companyProfile) {
        try {
            DataOperation dataOperation = this.objectMapper.readValue(this.gdprDataOperationJSON.getInputStream(), DataOperation.class);

            dataOperation.setId(null);
            dataOperation.setCompanyProfile(companyProfile);

            return this.dataOperationService.save(dataOperation);
        } catch (IOException e) {
            return null;
        }
    }

    private OverallDataThreat loadOverallDataThreat(DataOperation dataOperation) {
        try {
            OverallDataThreat overallDataThreat = this.objectMapper.readValue(this.gdprOverallDataThreatJSON.getInputStream(), OverallDataThreat.class);

            overallDataThreat.setId(null);
            overallDataThreat.setOperation(dataOperation);

            return this.overallDataThreatService.save(overallDataThreat);
        } catch (IOException e) {
            return null;
        }
    }

    private OverallSecurityImpact loadOverallSecurityImpact(DataOperation dataOperation) {
        try {
            OverallSecurityImpact overallSecurityImpact = this.objectMapper.readValue(this.gdprOverallSecurityImpactJSON.getInputStream(), OverallSecurityImpact.class);

            overallSecurityImpact.setId(null);
            overallSecurityImpact.setOperation(dataOperation);

            return this.overallSecurityImpactService.save(overallSecurityImpact);
        } catch (IOException e) {
            return null;
        }
    }

    private OverallDataRisk loadOverallDataRisk(DataOperation dataOperation) {
        try {
            OverallDataRisk overallDataRisk = this.objectMapper.readValue(this.gdprOverallDataRiskJSON.getInputStream(), OverallDataRisk.class);

            overallDataRisk.setId(null);
            overallDataRisk.setOperation(dataOperation);

            return this.overallDataRiskService.save(overallDataRisk);
        } catch (IOException e) {
            return null;
        }
    }
}
