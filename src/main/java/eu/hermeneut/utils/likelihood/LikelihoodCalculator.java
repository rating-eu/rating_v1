package eu.hermeneut.utils.likelihood;

import eu.hermeneut.domain.enumeration.AttackStrategyLikelihood;
import eu.hermeneut.domain.enumeration.Frequency;
import eu.hermeneut.domain.enumeration.ResourceLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Map;
import java.util.stream.Collectors;

public class LikelihoodCalculator {

    private static Logger logger = LoggerFactory.getLogger(LikelihoodCalculator.class);
    public static AttackStrategyLikelihood[/*Frequency*/][/*Resource*/] INITIAL_LIKELIHOOD_MATRIX;

    private static void init() {
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
        INITIAL_LIKELIHOOD_MATRIX = new AttackStrategyLikelihood[frequencies.length][resources.length];

        for (Frequency frequency : frequencies) {
            int rowIndex = frequency.getValue();
            int likelihoodIndex = frequency.getValue();

            for (ResourceLevel resource : resources) {
                int columnIndex = resource.getValue();

                AttackStrategyLikelihood likelihood = likelihoodMap.get(likelihoodIndex++);
                /*We need to remove 1 from the index, since the matrix indexes starts from 0,
                 *while the enums starts from value 1.
                 */
                INITIAL_LIKELIHOOD_MATRIX[rowIndex - 1][resourceLevels.length - columnIndex] = likelihood;
            }
        }

        logger.debug("\nINITIAL_LIKELIHOOD_MATRIX:");
        logger.debug(Arrays.toString(INITIAL_LIKELIHOOD_MATRIX[0]));
        logger.debug(Arrays.toString(INITIAL_LIKELIHOOD_MATRIX[1]));
        logger.debug(Arrays.toString(INITIAL_LIKELIHOOD_MATRIX[2]));
    }

    static {
        init();
    }


    public static AttackStrategyLikelihood initialLikelihood(Frequency frequency, ResourceLevel resourceLevel) {
        return INITIAL_LIKELIHOOD_MATRIX[frequency.getValue() - 1][resourceLevel.getValue() - 1];
    }
}
