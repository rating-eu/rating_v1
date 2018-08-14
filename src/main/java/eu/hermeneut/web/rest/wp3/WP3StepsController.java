package eu.hermeneut.web.rest.wp3;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.wp3.WP3InputBundle;
import eu.hermeneut.domain.wp3.WP3OutputBundle;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.service.EconomicCoefficientsService;
import eu.hermeneut.service.EconomicResultsService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.SplittingLossService;
import eu.hermeneut.utils.wp3.Calculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WP3StepsController {

    public static final double DEFAULT_LOSS_OF_INTANGIBLE = 18.29;
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private EconomicCoefficientsService economicCoefficientsService;

    @Autowired
    private SplittingLossService splittingLossService;

    @PostMapping("{selfAssessmentID}/wp3/step-one")
    @Timed
    public WP3OutputBundle stepOneEconomicPerformance(@PathVariable("selfAssessmentID") Long selfAssessmentID, @RequestBody WP3InputBundle wp3InputBundle) throws NullInputException, NotFoundException, IllegalInputException {
        SelfAssessment selfAssessment = null;

        if (selfAssessmentID != null) {
            selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        } else {
            throw new NullInputException("The selfAssessmentID can NOT be NULL!");
        }

        if (selfAssessment == null) {
            throw new NotFoundException("The selfAssessment with ID: " + selfAssessmentID + " was not found!");
        }

        if (wp3InputBundle == null) {
            throw new IllegalInputException("WP3InputBundle can NOT be NULL!");
        }

        List<EBIT> ebits = wp3InputBundle.getEbits();
        if (ebits == null) {
            throw new NullInputException("The list of ebits is NULL");
        } else if (ebits.size() != 6) {
            throw new IllegalInputException("The number of ebits MUST be EXACTLY 6!");
        }

        EconomicCoefficients economicCoefficients = wp3InputBundle.getEconomicCoefficients();

        if (economicCoefficients == null) {
            throw new NullInputException("The economicCoefficients can NOT be NULL!");
        }

        Double discountingRate = economicCoefficients.getDiscountingRate();

        if (discountingRate == null) {
            throw new NullInputException("The discountingRate can NOT be NULL!");
        } else if (discountingRate < 0 || discountingRate > 1) {
            throw new IllegalInputException("The value of DiscountingRate MUST BE BETWEEN 0 and 1 (edges included)!");
        }

        //Find existing data by SelfAssessmentID
        EconomicResults existingEconomicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);
        EconomicCoefficients existingEconomicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessmentID);
        List<SplittingLoss> existingSplittingLosses = this.splittingLossService.findAllBySelfAssessmentID(selfAssessmentID);

        double economicPerformance = Calculator.calculateEconomicPerformance(ebits, discountingRate);

        //===EconomicResults===
        if (existingEconomicResults != null) {//UPDATE
            existingEconomicResults.setEconomicPerformance(economicPerformance);
            //Update
            this.economicResultsService.save(existingEconomicResults);
        } else {//NEW
            existingEconomicResults = new EconomicResults();
            existingEconomicResults.setId(null);//Create a new entry in the table
            existingEconomicResults.setSelfAssessment(selfAssessment);
            //New field value
            existingEconomicResults.setEconomicPerformance(economicPerformance);
            //Create
            this.economicResultsService.save(existingEconomicResults);
        }

        //===EconomicCoefficients===
        if (existingEconomicCoefficients != null) {//UPDATE
            existingEconomicCoefficients.setDiscountingRate(discountingRate);
            //Update
            this.economicCoefficientsService.save(existingEconomicCoefficients);
        } else {//NEW
            existingEconomicCoefficients = new EconomicCoefficients();
            existingEconomicCoefficients.setId(null);//Create a new entry in the table
            existingEconomicCoefficients.setSelfAssessment(selfAssessment);
            //New field value
            existingEconomicCoefficients.setDiscountingRate(discountingRate);
            //Default field value
            existingEconomicCoefficients.setLossOfIntangible(DEFAULT_LOSS_OF_INTANGIBLE);
            //Create
            this.economicCoefficientsService.save(existingEconomicCoefficients);
        }

        WP3OutputBundle wp3OutputBundle = new WP3OutputBundle();
        wp3OutputBundle.setEconomicResults(existingEconomicResults);
        wp3OutputBundle.setEconomicCoefficients(existingEconomicCoefficients);
        wp3OutputBundle.setSplittingLosses(existingSplittingLosses);

        return wp3OutputBundle;
    }

    @PostMapping("{selfAssessmentID}/wp3/step-two")
    public WP3OutputBundle stepTwoIntangibleDrivingEarningsAndCapital(@PathVariable("selfAssessmentID") Long selfAssessmentID, @RequestBody WP3InputBundle wp3InputBundle) throws NullInputException, NotFoundException, IllegalInputException {
        SelfAssessment selfAssessment = null;

        if (selfAssessmentID != null) {
            selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        } else {
            throw new NullInputException("The selfAssessmentID can NOT be NULL!");
        }

        if (selfAssessment == null) {
            throw new NotFoundException("The selfAssessment with ID: " + selfAssessmentID + " was not found!");
        }

        if (wp3InputBundle == null) {
            throw new IllegalInputException("WP3InputBundle can NOT be NULL!");
        }

        List<MyAsset> myAssets = wp3InputBundle.getMyAssets();

        if (myAssets == null) {
            throw new IllegalInputException("MyAssets can NOT be NULL!");
        }

        if (myAssets.size() == 0) {
            throw new IllegalInputException("MyAssets can NOT have size equal to ZERO!");
        }

        EconomicCoefficients economicCoefficients = wp3InputBundle.getEconomicCoefficients();

        if (economicCoefficients == null) {
            throw new IllegalInputException("EconomicCoefficients can NOT be NULL!");
        }

        double physicalAssetsReturn = economicCoefficients.getPhysicalAssetsReturn();
        double financialAssetsReturn = economicCoefficients.getFinancialAssetsReturn();

        EconomicCoefficients existingEconomicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessmentID);

        double discountingRate;

        if (existingEconomicCoefficients == null) {
            throw new NotFoundException("EconomicCoefficients NOT FOUND");
        } else {
            existingEconomicCoefficients.setPhysicalAssetsReturn(physicalAssetsReturn);
            existingEconomicCoefficients.setFinancialAssetsReturn(financialAssetsReturn);
            discountingRate = existingEconomicCoefficients.getDiscountingRate();

            //Update
            this.economicCoefficientsService.save(existingEconomicCoefficients);
        }

        EconomicResults existingEconomicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);

        if (existingEconomicResults == null) {
            throw new NotFoundException("The EconomicResults for SelfAssessment " + selfAssessmentID + " was not found!");
        }

        double economicPerformance = existingEconomicResults.getEconomicPerformance();

        double intangibleDriningEarnings = Calculator.calculateIntangibleDrivingEarnings(economicPerformance, physicalAssetsReturn, financialAssetsReturn, myAssets);

        double intangibleCapital = Calculator.calculateIntangibleCapital(intangibleDriningEarnings, discountingRate);

        //Update fields
        existingEconomicResults.setIntangibleDrivingEarnings(intangibleDriningEarnings);
        existingEconomicResults.setIntangibleCapital(intangibleCapital);

        //Update entity
        this.economicResultsService.save(existingEconomicResults);

        //OUTPUT
        WP3OutputBundle wp3OutputBundle = new WP3OutputBundle();
        wp3OutputBundle.setEconomicCoefficients(existingEconomicCoefficients);
        wp3OutputBundle.setEconomicResults(existingEconomicResults);

        return wp3OutputBundle;
    }
}
