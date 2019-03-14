package eu.hermeneut.aop.wp3;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.wp3.Calculator;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Aspect
@Component
@Order(0)
public class SplittingValuesAspect {

    private final Logger logger = LoggerFactory.getLogger(SplittingValuesAspect.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private SplittingValueService splittingValueService;

    /**
     * Pointcut for methods annotated with UpdateSplittingValuesHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.UpdateSplittingValuesHook)")
    public void updateSplittingValuesHook() {
    }

    /**
     * Cross-cutting method to update the SplittingValues of a SelfAssessment.
     *
     * @param joinPoint
     */
    @AfterReturning("updateSplittingValuesHook()")
    public void updateSplittingValues(JoinPoint joinPoint) {
        logger.debug("Updating SplittingValues AOP...");

        SelfAssessment selfAssessment = null;

        Object[] args = joinPoint.getArgs();

        if (args != null && args.length > 0) {
            //The first parameter must be the ID of the SelfAssessment
            if (args[0] instanceof Long) {
                selfAssessment = this.selfAssessmentService.findOne((Long) args[0]);
            }
        }

        if (selfAssessment != null) {
            // GET the existing SplittingValues for this SelfAssessment and update them.
            List<SplittingValue> splittingValues = this.splittingValueService.findAllBySelfAssessmentID(selfAssessment.getId());

            if (splittingValues != null && !splittingValues.isEmpty()) {
                EconomicResults economicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessment.getId());

                if (economicResults != null) {
                    BigDecimal intangibleCapital = economicResults.getIntangibleCapital();

                    if (intangibleCapital != null) {
                        for (SplittingValue splittingValue : splittingValues) {
                            final CategoryType categoryType = splittingValue.getCategoryType();
                            final SectorType sectorType = splittingValue.getSectorType();

                            if (categoryType != CategoryType.DATA) {
                                BigDecimal splitting = Calculator.calculateSplittingValue(intangibleCapital, categoryType, sectorType);

                                if (splitting != null) {
                                    splittingValue.setValue(splitting);
                                    splittingValue = this.splittingValueService.save(splittingValue);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
