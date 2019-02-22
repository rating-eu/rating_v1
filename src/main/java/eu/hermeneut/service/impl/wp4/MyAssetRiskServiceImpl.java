package eu.hermeneut.service.impl.wp4;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.domain.wp4.MyAssetRisk;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AssetService;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.compact.AssetRiskService;
import eu.hermeneut.service.wp4.MyAssetRiskService;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
import eu.hermeneut.utils.tuple.Triad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class MyAssetRiskServiceImpl implements MyAssetRiskService, MaxValues {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private AssetService assetService;

    @Autowired
    private AssetRiskService assetRiskService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @Override
    public List<MyAssetRisk> getMyAssetRisksBySelfAssessment(Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT FOUND.");
        }

        Set<ThreatAgent> threatAgents = selfAssessment.getThreatagents();

        if (threatAgents == null || threatAgents.isEmpty()) {
            throw new NotFoundException("ThreatAgent for SelfAssessment were NOT be FOUND.");
        }

        List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgents);
        ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

        // The Strongest ThreatAgent
        ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

        if (myAssets == null || myAssets.isEmpty()) {
            throw new NotFoundException("MyAssets NOT Found!!!");
        }

        Set<AssetRisk> assetRisks = this.assetRiskService.getAssetRisks(selfAssessmentID);

        if (assetRisks == null || assetRisks.isEmpty()) {
            throw new NotFoundException("AssetRisks NOT Found!!!");
        }

        Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessmentID);

        //Keep only the attackstrategies that can be performed by the Strongest ThreatAgent
        augmentedAttackStrategyMap = augmentedAttackStrategyMap.values()
            .stream()
            .filter(attackStrategy -> ThreatAttackFilter.isAttackPossible(strongestThreatAgent, attackStrategy))
            .collect(Collectors.toMap(
                augmentedAttackStrategy -> augmentedAttackStrategy.getId(),
                Function.identity()
            ));


        Map<Long, AssetRisk> assetRisksMap = assetRisks.stream().collect(Collectors.toMap(assetRisk -> assetRisk.getId(), Function.identity()));

        List<MyAssetRisk> myAssetRisks = new ArrayList<>();

        for (MyAsset myAsset : myAssets) {
            final MyAssetRisk myAssetRisk = new MyAssetRisk(myAsset);

            final Set<Container> containers = myAsset.getAsset().getContainers() != null ? myAsset.getAsset().getContainers() : new HashSet<>();
            final Set<DomainOfInfluence> domainsOfInfluence = myAsset.getAsset().getDomainsOfInfluences() != null ? myAsset.getAsset().getDomainsOfInfluences() : new HashSet<>();

            Map<Long, Container> containerMap = new HashMap<>();

            containers.stream().parallel().forEach(container -> {
                containerMap.put(container.getId(), container);
            });

            domainsOfInfluence.stream().parallel().forEach(domainOfInfluence -> {
                containerMap.put(domainOfInfluence.getContainer().getId(), domainOfInfluence.getContainer());
            });

            if (containers.isEmpty()) {
                throw new NotFoundException("Containers NOT Found!!!");
            }

            AssetRisk assetRisk = assetRisksMap.get(myAsset.getAsset().getId());

            if (assetRisk != null && assetRisk.getRisk() != null) {
                //Percentage
                float risk = assetRisk.getRisk() * 100;

                int riskInteger = Math.round(risk);

                Triad<Float> likelihoodVulnerabilityCritical = this.assetRiskService.getLikelihoodVulnerabilityCritical(augmentedAttackStrategyMap, containerMap);

                float likelihood = likelihoodVulnerabilityCritical.getA();
                float vulnerability = likelihoodVulnerabilityCritical.getB();
                int critical = Math.round(likelihoodVulnerabilityCritical.getC());

                myAssetRisk.setLikelihood(likelihood);
                myAssetRisk.setVulnerability(vulnerability);
                myAssetRisk.setRisk(riskInteger);
                myAssetRisk.setCritical(critical);
            }

            try {
                List<Mitigation> mitigations = this.getMyAssetMitigations(selfAssessmentID, myAsset.getId());

                myAssetRisk.setMitigations(mitigations);
            } catch (NotFoundException e) {
                e.printStackTrace();
            }

            myAssetRisks.add(myAssetRisk);
        }

        return myAssetRisks;
    }

    @Override
    public List<Mitigation> getMyAssetMitigations(Long selfAssessmentID, Long myAssetID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT FOUND.");
        }

        Set<ThreatAgent> threatAgents = selfAssessment.getThreatagents();

        if (threatAgents == null || threatAgents.isEmpty()) {
            throw new NotFoundException("ThreatAgent for SelfAssessment were NOT be FOUND.");
        }

        List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgents);
        ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

        // The Strongest ThreatAgent
        ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);

        MyAsset myAsset = this.myAssetService.findOne(myAssetID);

        if (myAsset == null) {
            throw new NotFoundException("MyAsset NOT Found!!!");
        }

        Asset asset = myAsset.getAsset();

        if (asset == null) {
            throw new NotFoundException("Asset NOT Found!!!");
        }

        final Set<Container> containers = asset.getContainers() != null ? asset.getContainers() : new HashSet<>();
        final Set<DomainOfInfluence> domainsOfInfluence = asset.getDomainsOfInfluences() != null ? asset.getDomainsOfInfluences() : new HashSet<>();

        if (containers.isEmpty()) {
            if (domainsOfInfluence.isEmpty()) {
                throw new NotFoundException("Containers and Domains of Influence NOT Found!!!");
            } else {//Only Domains of Influence as Containers
                domainsOfInfluence.stream().parallel().forEach(domainOfInfluence -> {
                    containers.add(domainOfInfluence.getContainer());
                });
            }
        } else {// Both container and Domains of Influence as Containers
            if (!domainsOfInfluence.isEmpty()) {
                domainsOfInfluence.stream().parallel().forEach(domainOfInfluence -> {
                    containers.add(domainOfInfluence.getContainer());
                });
            }
        }

        if (containers.isEmpty()) {
            throw new NotFoundException("Containers NOT Found!!!");
        }

        Map<Long, AttackStrategy> attackStrategyMap = new HashMap<>();

        for (Container container : containers) {
            List<AttackStrategy> attackStrategies = this.attackStrategyService.findAllByContainer(container.getId());

            if (attackStrategies != null && !attackStrategies.isEmpty()) {
                //Keep only the attackstrategies that can be performed by the Strongest ThreatAgent
                attackStrategyMap = attackStrategies
                    .stream()
                    .parallel()
                    .filter(attackStrategy -> ThreatAttackFilter.isAttackPossible(strongestThreatAgent, attackStrategy))
                    .collect(Collectors.toMap(
                        strategy -> strategy.getId(),
                        Function.identity()
                    ));
            }
        }

        Map<Long, Mitigation> mitigationMap = new HashMap<>();

        if (!attackStrategyMap.isEmpty()) {
            attackStrategyMap.values()
                .stream().parallel()
                .forEach((attackStrategy) -> {
                    attackStrategy.getMitigations()
                        .stream()
                        .parallel()
                        .forEach((mitigation -> {
                            mitigationMap.put(mitigation.getId(), mitigation);
                        }));
                });
        }

        return mitigationMap.values().stream().collect(Collectors.toList());
    }
}
