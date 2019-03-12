package eu.hermeneut.aop.impact;

import eu.hermeneut.domain.ImpactLevel;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.impact.ImpactService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Aspect
@Component
public class ImpactUpdateAspect {
    private final Logger logger = LoggerFactory.getLogger(ImpactUpdateAspect.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private ImpactService impactService;

    /**
     * Pointcut for methods annotated with UpdateImpactsHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.UpdateImpactsHook)")
    public void updateImpactsHook() {
    }

    /**
     * Cross-cutting method to calculate or update the Impacts of the MyAssets.
     *
     * @param joinPoint
     */
    @AfterReturning("updateImpactsHook()")
    public void updateMyAssetsImpact(JoinPoint joinPoint) {
        logger.debug("Updating MyAssets Impact AOP...");

        SelfAssessment selfAssessment = null;

        Object[] args = joinPoint.getArgs();

        if (args != null && args.length > 0) {
            //The first parameter must be the ID of the SelfAssessment
            if (args[0] instanceof Long) {
                selfAssessment = this.selfAssessmentService.findOne((Long) args[0]);
            }//or the list of the ImpactLevels
            else if (args[0] instanceof List) {
                List<?> list = (List) args[0];

                if (!list.isEmpty()) {
                    if (list.get(0) instanceof ImpactLevel) {
                        ImpactLevel level = (ImpactLevel) list.get(0);

                        selfAssessment = this.selfAssessmentService.findOne(level.getSelfAssessmentID());
                    }
                }
            }
        }

        if (selfAssessment != null) {
            try {
                this.impactService.calculateEconomicImpacts(selfAssessment.getId());
            } catch (Exception e) {
                logger.warn(e.getMessage());
            }
        }
    }
}
