package eu.hermeneut.utils.likelihood.attackstrategy;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.enumeration.*;
import eu.hermeneut.service.AnswerWeightService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class AttackStrategyCalculator {
    private static Logger logger = LoggerFactory.getLogger(AttackStrategyCalculator.class);

    //#############INITIAL LIKELIHOOD MATRIX###############
    private AttackStrategyLikelihood[][] initialLikelihoodMatrix;

    @Autowired
    public AttackStrategyCalculator(AnswerWeightService answerWeightService) {
        //#############INITIAL LIKELIHOOD MATRIX###############
        this.initialLikelihoodMatrix = this.toInitialLikelihoodMatrix();
    }

    //###################################INITIAL LIKELIHOOD###################################

    /**
     * Calculates the Initial Likelihood given an AttackStrategy, based on its Frequency and Resources.
     *
     * @param attackStrategy the AttackStrategy to calculate the InitialLikelihood for.
     * @return the Initial Likelihood of the given AttackStrategy.
     */
    public AttackStrategyLikelihood initialLikelihood(AttackStrategy attackStrategy) {
        return this.initialLikelihood(attackStrategy.getFrequency(), attackStrategy.getResources());
    }

    private AttackStrategyLikelihood initialLikelihood(Frequency frequency, ResourceLevel resourceLevel) {
        return this.initialLikelihoodMatrix[frequency.getValue() - 1][resourceLevel.getValue() - 1];
    }

    //###################################HELPER METHODS###################################
    private AttackStrategyLikelihood[][] toInitialLikelihoodMatrix() {
        Frequency frequencies[] = Frequency.values();
        Arrays.sort(frequencies, new Comparator<Frequency>() {
            @Override
            public int compare(Frequency f1, Frequency f2) {
                //Non decreasing order
                //[LOW, MEDIUM, HIGH]
                return f1.getValue() - f2.getValue();
            }
        });

        logger.debug("Frequencies: " + Arrays.toString(frequencies));

        ResourceLevel resources[] = ResourceLevel.values();
        ResourceLevel resourceLevels[] = ResourceLevel.values();
        Arrays.sort(resourceLevels, new Comparator<ResourceLevel>() {
            @Override
            public int compare(ResourceLevel r1, ResourceLevel r2) {
                //Non ascending order
                //[HIGH, MEDIUM, LOW]
                return r2.getValue() - r1.getValue();
            }
        });

        logger.debug("Resources: " + Arrays.toString(resourceLevels));

        AttackStrategyLikelihood likelihoods[] = AttackStrategyLikelihood.values();
        Map<Integer, AttackStrategyLikelihood> likelihoodMap = Arrays.stream(likelihoods).collect(Collectors.toMap(AttackStrategyLikelihood::getValue, item -> item));
        AttackStrategyLikelihood[][] initialLikelihoodMatrix = new AttackStrategyLikelihood[frequencies.length][resources.length];

        for (Frequency frequency : frequencies) {
            int rowIndex = frequency.getValue();
            int likelihoodIndex = frequency.getValue();

            for (ResourceLevel resource : resources) {
                int columnIndex = resource.getValue();

                AttackStrategyLikelihood likelihood = likelihoodMap.get(likelihoodIndex++);
                /*We need to remove 1 from the index, since the matrix indexes starts from 0,
                 *while the enums starts from value 1.
                 */
                initialLikelihoodMatrix[rowIndex - 1][resourceLevels.length - columnIndex] = likelihood;
            }
        }

        return initialLikelihoodMatrix;
    }
}
