package eu.hermeneut.web.rest.wp3;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.domain.wp3.IDE;
import eu.hermeneut.domain.wp3.WP3InputBundle;
import eu.hermeneut.domain.wp3.WP3OutputBundle;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.comparator.EBITComparator;
import eu.hermeneut.utils.wp3.Calculator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
public class WP3StepsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(WP3StepsController.class);

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

    @Autowired
    private SplittingValueService splittingValueService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private GrowthRateService growthRateService;

    private static final Map<Long, Object> SELF_ASSESSMENT_LOCK = new HashMap<>();

    @PostMapping("{selfAssessmentID}/wp3/step-one")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID)")
    @Secured(AuthoritiesConstants.CISO)
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
        } else {
            ebits.sort(new EBITComparator());
            EBIT previous = null;

            for (EBIT ebit : ebits) {
                if (previous == null) {
                    previous = ebit;
                } else {
                    if ((ebit.getYear() - previous.getYear()) != 1) {
                        throw new IllegalInputException("EBITs years must be consecutive and without duplicates!");
                    } else {
                        previous = ebit;
                    }
                }
            }
        }

        //===SelfAssessment Lock===
        Object lock = null;
        if (SELF_ASSESSMENT_LOCK.containsKey(selfAssessmentID)) {
            lock = SELF_ASSESSMENT_LOCK.get(selfAssessmentID);
        } else {
            lock = new Object();
            SELF_ASSESSMENT_LOCK.put(selfAssessmentID, lock);
        }

        synchronized (lock) {
            List<EBIT> existingEbits = this.ebitService.findAllBySelfAssessment(selfAssessmentID);

            if (existingEbits != null) {
                //Drop the OLD EBITs
                this.ebitService.delete(existingEbits);
            }

            //Save new EBITs
            ZonedDateTime now = ZonedDateTime.now();

            for (EBIT ebit : ebits) {
                ebit.setId(null);
                ebit.setSelfAssessment(selfAssessment);
                ebit.setCreated(now);
            }

            //Save the EBITs
            ebits = this.ebitService.save(ebits);

            EconomicCoefficients economicCoefficients = wp3InputBundle.getEconomicCoefficients();

            if (economicCoefficients == null) {
                throw new NullInputException("The economicCoefficients can NOT be NULL!");
            }

            BigDecimal discountingRate = economicCoefficients.getDiscountingRate();

            if (discountingRate == null) {
                throw new NullInputException("The discountingRate can NOT be NULL!");
            } else if (discountingRate.compareTo(BigDecimal.ZERO) < 0 || discountingRate.compareTo(new BigDecimal(100)) > 0) {
                throw new IllegalInputException("The value of DiscountingRate MUST BE BETWEEN 0 and 100 (edges included)!");
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
    }

    @PostMapping("{selfAssessmentID}/wp3/step-two")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID)")
    @Secured(AuthoritiesConstants.CISO)
    public WP3OutputBundle stepTwoIntangibleDrivingEarningsAndCapital(@PathVariable("selfAssessmentID") Long selfAssessmentID, @RequestBody WP3InputBundle wp3InputBundle) throws NullInputException, NotFoundException, IllegalInputException {
        LOGGER.info("Step 2 entering: " + System.currentTimeMillis());

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

        this.myAssetService.saveAll(myAssets);

        //===SelfAssessment Lock===
        Object lock = null;
        if (SELF_ASSESSMENT_LOCK.containsKey(selfAssessmentID)) {
            lock = SELF_ASSESSMENT_LOCK.get(selfAssessmentID);
        } else {
            lock = new Object();
            SELF_ASSESSMENT_LOCK.put(selfAssessmentID, lock);
        }

        LOGGER.info("Step 2 Lock: " + lock);

        synchronized (lock) {
            EconomicCoefficients economicCoefficients = wp3InputBundle.getEconomicCoefficients();

            if (economicCoefficients == null) {
                throw new IllegalInputException("EconomicCoefficients can NOT be NULL!");
            }

            BigDecimal physicalAssetsReturn = economicCoefficients.getPhysicalAssetsReturn();
            BigDecimal financialAssetsReturn = economicCoefficients.getFinancialAssetsReturn();

            BigDecimal longTermLiabilities = economicCoefficients.getLongTermLiabilities();
            BigDecimal currentLiabilities = economicCoefficients.getCurrentLiabilities();

            EconomicCoefficients existingEconomicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessmentID);

            BigDecimal discountingRate;

            if (existingEconomicCoefficients == null) {
                throw new NotFoundException("EconomicCoefficients NOT FOUND");
            } else {
                existingEconomicCoefficients.setPhysicalAssetsReturn(physicalAssetsReturn);
                existingEconomicCoefficients.setFinancialAssetsReturn(financialAssetsReturn);
                existingEconomicCoefficients.setLongTermLiabilities(longTermLiabilities);
                existingEconomicCoefficients.setCurrentLiabilities(currentLiabilities);

                discountingRate = existingEconomicCoefficients.getDiscountingRate();

                //Update
                economicCoefficients = this.economicCoefficientsService.save(existingEconomicCoefficients);
                LOGGER.info("Step 2 EconomicCoefficients after save: " + economicCoefficients);
            }

            EconomicResults existingEconomicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);

            if (existingEconomicResults == null) {
                throw new NotFoundException("The EconomicResults for SelfAssessment " + selfAssessmentID + " was not found!");
            }

            BigDecimal economicPerformance = existingEconomicResults.getEconomicPerformance();

            BigDecimal intangibleDrivingEarnings = Calculator.calculateIntangibleDrivingEarnings(economicPerformance,
                physicalAssetsReturn, longTermLiabilities, financialAssetsReturn, currentLiabilities, myAssets);

            List<GrowthRate> growthRates = this.growthRateService.findAllBySelfAssessment(selfAssessmentID);

            List<IDE> ides = Calculator.calculateIDEs(intangibleDrivingEarnings, growthRates);
            List<IDE> idesTZero = Calculator.calculateIDEsTZero(discountingRate, growthRates, ides);

            BigDecimal intangibleCapital = Calculator.calculateIntangibleCapital(idesTZero);

            //Update fields
            existingEconomicResults.setIntangibleDrivingEarnings(intangibleDrivingEarnings);
            existingEconomicResults.setIntangibleCapital(intangibleCapital);

            //Update entity
            EconomicResults economicResults = this.economicResultsService.save(existingEconomicResults);
            LOGGER.info("Step 2 EconomicResults after save: " + economicResults);

            //OUTPUT
            WP3OutputBundle wp3OutputBundle = new WP3OutputBundle();
            wp3OutputBundle.setEconomicCoefficients(existingEconomicCoefficients);
            wp3OutputBundle.setEconomicResults(existingEconomicResults);

            LOGGER.info("Step 2 exiting: " + System.currentTimeMillis());
            return wp3OutputBundle;
        }
    }

    @PostMapping("{selfAssessmentID}/wp3/step-three")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID)")
    @Secured(AuthoritiesConstants.CISO)
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

        //===SelfAssessment Lock===
        Object lock = null;
        if (SELF_ASSESSMENT_LOCK.containsKey(selfAssessmentID)) {
            lock = SELF_ASSESSMENT_LOCK.get(selfAssessmentID);
        } else {
            lock = new Object();
            SELF_ASSESSMENT_LOCK.put(selfAssessmentID, lock);
        }

        synchronized (lock) {
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
    }

    @PostMapping("{selfAssessmentID}/wp3/step-four")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID)")
    @Secured(AuthoritiesConstants.CISO)
    public WP3OutputBundle stepFourSplittingLosses(@PathVariable("selfAssessmentID") Long selfAssessmentID, @RequestBody WP3InputBundle wp3InputBundle) throws NullInputException, NotFoundException, IllegalInputException {
        LOGGER.info("Step 4 entering: " + System.currentTimeMillis());
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

        //===SelfAssessment Lock===
        Object lock = null;
        if (SELF_ASSESSMENT_LOCK.containsKey(selfAssessmentID)) {
            lock = SELF_ASSESSMENT_LOCK.get(selfAssessmentID);
        } else {
            lock = new Object();
            SELF_ASSESSMENT_LOCK.put(selfAssessmentID, lock);
        }

        LOGGER.info("Step 4 Lock: " + lock);

        synchronized (lock) {
            EconomicResults existingEconomicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);
            LOGGER.info("Step 4 ExistingEconomicResults: " + existingEconomicResults);

            if (existingEconomicResults == null) {
                throw new NotFoundException("The EconomicResults for SelfAssessment " + selfAssessmentID + " was not found!");
            }

            BigDecimal lossValue = existingEconomicResults.getIntangibleLossByAttacks();

            if (lossValue == null) {
                //Use IntangibleCapital
                if (existingEconomicResults.getIntangibleCapital() == null) {
                    throw new NullInputException("IntangibleLossByAttacks and IntangibleCapital (from DB) can NOT be " +
                        "NULL!");
                }

                lossValue = existingEconomicResults.getIntangibleCapital();
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
            List<SectorType> sectorTypes = new ArrayList<>();
            List<CategoryType> categoryTypes = new ArrayList<>();


            if (sectorType == null || sectorType == SectorType.GLOBAL) {
                sectorTypes.add(SectorType.GLOBAL);
            } else {
                //Calculate the Splitting Lossess for the specified SectorType and for the GLOBAL SectorType
                sectorTypes.add(sectorType);
                //sectorTypes.add(SectorType.GLOBAL);
            }

            if (categoryType == null) {
                categoryTypes.addAll(Arrays.asList(CategoryType.values()));
            } else {
                categoryTypes.add(categoryType);
            }

            for (SectorType sType : sectorTypes) {
                for (CategoryType cType : categoryTypes) {
                    if (cType != CategoryType.DATA) {
                        SplittingLoss splittingLoss = createNewSplittingLoss(selfAssessment, lossValue,
                            sType, cType);
                        splittingLosses.add(splittingLoss);
                    }
                }
            }

            //Persist the NEW SplittingLosses
            splittingLosses = this.splittingLossService.save(splittingLosses);

            WP3OutputBundle wp3OutputBundle = new WP3OutputBundle();
            wp3OutputBundle.setEconomicResults(existingEconomicResults);
            wp3OutputBundle.setEconomicCoefficients(null);//Not used in this step, if needed may be fetched and returned.
            wp3OutputBundle.setSplittingLosses(splittingLosses);

            LOGGER.info("Step 4 exiting: " + System.currentTimeMillis());
            return wp3OutputBundle;
        }
    }

    @PostMapping("{selfAssessmentID}/wp3/step-five")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID)")
    @Secured(AuthoritiesConstants.CISO)
    public WP3OutputBundle stepFiveSplittingValues(@PathVariable("selfAssessmentID") Long selfAssessmentID, @RequestBody WP3InputBundle wp3InputBundle) throws NullInputException, NotFoundException, IllegalInputException {
        LOGGER.info("Step 5 entering: " + System.currentTimeMillis());
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

        //===SelfAssessment Lock===
        Object lock = null;
        if (SELF_ASSESSMENT_LOCK.containsKey(selfAssessmentID)) {
            lock = SELF_ASSESSMENT_LOCK.get(selfAssessmentID);
        } else {
            lock = new Object();
            SELF_ASSESSMENT_LOCK.put(selfAssessmentID, lock);
        }

        LOGGER.info("Step 5 Lock: " + lock);

        synchronized (lock) {
            EconomicResults existingEconomicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);
            LOGGER.info("Step 5 ExistingEconomicResults: " + existingEconomicResults);

            if (existingEconomicResults == null) {
                throw new NotFoundException("The EconomicResults for SelfAssessment " + selfAssessmentID + " was not found!");
            }

            BigDecimal intangibleCapital = existingEconomicResults.getIntangibleCapital();

            SectorType sectorType = wp3InputBundle.getSectorType();
            CategoryType categoryType = wp3InputBundle.getCategoryType();

            //New code
            List<SplittingValue> splittingValues = this.splittingValueService.findAllBySelfAssessmentID(selfAssessmentID);

            if (splittingValues != null) {//Already exists
                //Remove OLD ones
                this.splittingValueService.delete(splittingValues);
            }

            //Create NEW ones
            splittingValues = new ArrayList<>();
            List<SectorType> sectorTypes = new ArrayList<>();
            List<CategoryType> categoryTypes = new ArrayList<>();


            if (sectorType == null || sectorType == SectorType.GLOBAL) {
                sectorTypes.add(SectorType.GLOBAL);
            } else {
                //Calculate the Splitting Values for the specified SectorType and for the GLOBAL SectorType
                sectorTypes.add(sectorType);
                //sectorTypes.add(SectorType.GLOBAL);
            }

            if (categoryType == null) {
                categoryTypes.addAll(Arrays.asList(CategoryType.values()));
            } else {
                categoryTypes.add(categoryType);
            }

            for (SectorType sType : sectorTypes) {
                for (CategoryType cType : categoryTypes) {
                    if (cType != CategoryType.DATA) {
                        SplittingValue splittingValue = createNewSplittingValue(selfAssessment, intangibleCapital,
                            sType, cType);
                        splittingValues.add(splittingValue);
                    }
                }
            }

            //Persist the NEW SplittingLosses
            splittingValues = this.splittingValueService.save(splittingValues);

            WP3OutputBundle wp3OutputBundle = new WP3OutputBundle();
            wp3OutputBundle.setEconomicResults(existingEconomicResults);
            wp3OutputBundle.setEconomicCoefficients(null);//Not used in this step, if needed may be fetched and returned.
            wp3OutputBundle.setSplittingValues(splittingValues);

            LOGGER.info("Step 5 exiting: " + System.currentTimeMillis());
            return wp3OutputBundle;
        }
    }

    @GetMapping("{selfAssessmentID}/wp3/economic-losses")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID)")
    @Secured(AuthoritiesConstants.CISO)
    public Set<MyAsset> evaluateEconomicLosses(@PathVariable("selfAssessmentID") Long selfAssessmentID) throws NullInputException, NotFoundException {
        LOGGER.info("Step 5 entering: " + System.currentTimeMillis());
        SelfAssessment selfAssessment = null;

        if (selfAssessmentID != null) {
            selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        } else {
            throw new NullInputException("The selfAssessmentID can NOT be NULL!");
        }

        EconomicCoefficients economicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessment.getId());

        if (economicCoefficients == null) {
            throw new NotFoundException("EconomicCoefficients NOT FOUND for SelfAssessment with ID: " + selfAssessment.getId());
        }

        BigDecimal lossOfIntangiblePercentage = economicCoefficients.getLossOfIntangible();

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessment.getId());

        if (myAssets == null || myAssets.isEmpty()) {
            throw new NotFoundException("MyAssets NOT FOUND for SelfAssessment with ID: " + selfAssessment.getId());
        }

        for (MyAsset myAsset : myAssets) {
            if (myAsset.getRanking() != null && myAsset.getEconomicValue() != null) {
                BigDecimal lossValue = myAsset.getEconomicValue().multiply(lossOfIntangiblePercentage).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
                myAsset.setLossValue(lossValue);
            }
        }

        List<MyAsset> myAssetList = this.myAssetService.saveAll(myAssets);
        return new HashSet<>(myAssetList);
    }

    private SplittingLoss createNewSplittingLoss(SelfAssessment selfAssessment, BigDecimal intangibleLossByAttacks, SectorType sectorType, CategoryType catType) {
        BigDecimal splittingLossPercentage = Calculator.calculateSplittingPercentage(catType, sectorType);
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

    private SplittingValue createNewSplittingValue(SelfAssessment selfAssessment, BigDecimal intangibleCapital, SectorType sectorType, CategoryType catType) {
        BigDecimal valueSplitting = Calculator.calculateSplittingValue(intangibleCapital, catType, sectorType);

        SplittingValue splittingValue = new SplittingValue();
        splittingValue.setId(null);//new entity
        splittingValue.setSectorType(sectorType);
        splittingValue.setCategoryType(catType);
        splittingValue.setSelfAssessment(selfAssessment);
        splittingValue.setValue(valueSplitting);

        //Save it and get the NEW ID
        splittingValue = this.splittingValueService.save(splittingValue);

        return splittingValue;
    }
}
