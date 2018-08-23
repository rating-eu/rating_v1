package eu.hermeneut.web.rest.wp3;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.domain.wp3.WP3InputBundle;
import eu.hermeneut.domain.wp3.WP3OutputBundle;
import eu.hermeneut.exceptions.DuplicateValueException;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.wp3.Calculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class WP3StepsController {

    public static final BigDecimal DEFAULT_LOSS_OF_INTANGIBLE = new BigDecimal("18.29");
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private EBITService ebitService;

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

        //TODO
        List<EBIT> existingEbits = this.ebitService.findAllBySelfAssessment(selfAssessmentID);

        if (existingEbits != null) {
            ebits = existingEbits;
        } else {
            ZonedDateTime now = ZonedDateTime.now();

            for (EBIT ebit : ebits) {
                ebit.setId(null);
                ebit.setSelfAssessment(selfAssessment);
                ebit.setCreated(now);
            }

            //Save the EBITs
            ebits = this.ebitService.save(ebits);
        }

        EconomicCoefficients economicCoefficients = wp3InputBundle.getEconomicCoefficients();

        if (economicCoefficients == null) {
            throw new NullInputException("The economicCoefficients can NOT be NULL!");
        }

        BigDecimal discountingRate = economicCoefficients.getDiscountingRate();

        if (discountingRate == null) {
            throw new NullInputException("The discountingRate can NOT be NULL!");
        } else if (discountingRate.compareTo(BigDecimal.ZERO) < 0 || discountingRate.compareTo(BigDecimal.ONE) > 0) {
            throw new IllegalInputException("The value of DiscountingRate MUST BE BETWEEN 0 and 1 (edges included)!");
        }

        //Find existing data by SelfAssessmentID
        EconomicResults existingEconomicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);
        EconomicCoefficients existingEconomicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessmentID);
        List<SplittingLoss> existingSplittingLosses = this.splittingLossService.findAllBySelfAssessmentID(selfAssessmentID);

        BigDecimal economicPerformance = Calculator.calculateEconomicPerformance(ebits, discountingRate);

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

        BigDecimal physicalAssetsReturn = economicCoefficients.getPhysicalAssetsReturn();
        BigDecimal financialAssetsReturn = economicCoefficients.getFinancialAssetsReturn();

        EconomicCoefficients existingEconomicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessmentID);

        BigDecimal discountingRate;

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

        BigDecimal economicPerformance = existingEconomicResults.getEconomicPerformance();

        BigDecimal intangibleDriningEarnings = Calculator.calculateIntangibleDrivingEarnings(economicPerformance, physicalAssetsReturn, financialAssetsReturn, myAssets);

        BigDecimal intangibleCapital = Calculator.calculateIntangibleCapital(intangibleDriningEarnings, discountingRate);

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

    @PostMapping("{selfAssessmentID}/wp3/step-three")
    public WP3OutputBundle stepThreeIntangibleLossByAttacks(@PathVariable("selfAssessmentID") Long selfAssessmentID, @RequestBody WP3InputBundle wp3InputBundle) throws NullInputException, NotFoundException, IllegalInputException {
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

        EconomicCoefficients economicCoefficients = wp3InputBundle.getEconomicCoefficients();

        if (economicCoefficients == null) {
            throw new IllegalInputException("EconomicCoefficients can NOT be NULL!");
        }

        BigDecimal lossOfIntangiblePercentage = economicCoefficients.getLossOfIntangible();

        EconomicCoefficients existingEconomicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessmentID);

        if (existingEconomicCoefficients == null) {
            throw new NotFoundException("EconomicCoefficients NOT FOUND");
        } else {
            existingEconomicCoefficients.setLossOfIntangible(lossOfIntangiblePercentage);

            //Update
            this.economicCoefficientsService.save(existingEconomicCoefficients);
        }

        EconomicResults existingEconomicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);

        if (existingEconomicResults == null) {
            throw new NotFoundException("The EconomicResults for SelfAssessment " + selfAssessmentID + " was not found!");
        }

        BigDecimal intangibleCapital = existingEconomicResults.getIntangibleCapital();

        BigDecimal intangibleLossByAttacks = Calculator.calculateIntangibleLossByAttacks(intangibleCapital, lossOfIntangiblePercentage);

        //Update field
        existingEconomicResults.setIntangibleLossByAttacks(intangibleLossByAttacks);

        //update entity
        this.economicResultsService.save(existingEconomicResults);

        //OUTPUT
        WP3OutputBundle wp3OutputBundle = new WP3OutputBundle();
        wp3OutputBundle.setEconomicCoefficients(existingEconomicCoefficients);
        wp3OutputBundle.setEconomicResults(existingEconomicResults);

        return wp3OutputBundle;
    }

    @PostMapping("{selfAssessmentID}/wp3/step-four")
    public WP3OutputBundle stepFourSplittingLosses(@PathVariable("selfAssessmentID") Long selfAssessmentID, @RequestBody WP3InputBundle wp3InputBundle) throws NullInputException, NotFoundException, IllegalInputException {
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

        EconomicResults existingEconomicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);

        if (existingEconomicResults == null) {
            throw new NotFoundException("The EconomicResults for SelfAssessment " + selfAssessmentID + " was not found!");
        }

        BigDecimal intangibleLossByAttacks = existingEconomicResults.getIntangibleLossByAttacks();

        if (intangibleLossByAttacks == null) {
            throw new NullInputException("IntangibleLossByAttacks (from DB) can NOT be NULL!");
        }

        SectorType sectorType = wp3InputBundle.getSectorType();
        CategoryType categoryType = wp3InputBundle.getCategoryType();

        List<SplittingLoss> splittingLosses = this.splittingLossService.findAllBySelfAssessmentID(selfAssessmentID);

        if (splittingLosses != null) {//Already exists
            //Remove OLD ones
            this.splittingLossService.delete(splittingLosses);
        }

        //Create NEW ones
        splittingLosses = new ArrayList<>();

        if (sectorType == null) {//means GLOBAL
            sectorType = SectorType.GLOBAL;
        }

        if (categoryType == null) {//SplittingLosses for ALL CategoryTypes
            for (CategoryType catType : CategoryType.values()) {
                SplittingLoss splittingLoss = createNewSplittingLoss(selfAssessment, intangibleLossByAttacks, sectorType, catType);
                splittingLosses.add(splittingLoss);
            }
        } else {//SplittingLoss ONLY for that CategoryType
            SplittingLoss splittingLoss = createNewSplittingLoss(selfAssessment, intangibleLossByAttacks, sectorType, categoryType);
            splittingLosses.add(splittingLoss);
        }

        //Persist the NEW SplittingLosses
        splittingLosses = this.splittingLossService.save(splittingLosses);

        WP3OutputBundle wp3OutputBundle = new WP3OutputBundle();
        wp3OutputBundle.setEconomicResults(existingEconomicResults);
        wp3OutputBundle.setEconomicCoefficients(null);//Not used in this step, if needed may be fetched and returned.
        wp3OutputBundle.setSplittingLosses(splittingLosses);

        return wp3OutputBundle;
    }

    private SplittingLoss createNewSplittingLoss(SelfAssessment selfAssessment, BigDecimal intangibleLossByAttacks, SectorType sectorType, CategoryType catType) {
        BigDecimal splittingLossPercentage = Calculator.calculateSplittingLossPercentage(catType, sectorType);
        BigDecimal splittingLossValue = Calculator.calculateSplittingLoss(intangibleLossByAttacks, catType, sectorType);

        SplittingLoss splittingLoss = new SplittingLoss();
        splittingLoss.setId(null);//new entity
        splittingLoss.setSectorType(sectorType);
        splittingLoss.setCategoryType(catType);
        splittingLoss.setSelfAssessment(selfAssessment);
        splittingLoss.setLossPercentage(splittingLossPercentage);
        splittingLoss.setLoss(splittingLossValue);

        //Save it and get the NEW ID
        splittingLoss = this.splittingLossService.save(splittingLoss);

        return splittingLoss;
    }
}
