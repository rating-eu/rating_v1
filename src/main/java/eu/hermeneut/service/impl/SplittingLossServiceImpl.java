package eu.hermeneut.service.impl;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.SplittingLossService;
import eu.hermeneut.domain.SplittingLoss;
import eu.hermeneut.repository.SplittingLossRepository;
import eu.hermeneut.repository.search.SplittingLossSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing SplittingLoss.
 */
@Service
@Transactional
public class SplittingLossServiceImpl implements SplittingLossService {

    private final Logger log = LoggerFactory.getLogger(SplittingLossServiceImpl.class);

    private final SplittingLossRepository splittingLossRepository;

    private final SplittingLossSearchRepository splittingLossSearchRepository;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    public SplittingLossServiceImpl(SplittingLossRepository splittingLossRepository, SplittingLossSearchRepository splittingLossSearchRepository) {
        this.splittingLossRepository = splittingLossRepository;
        this.splittingLossSearchRepository = splittingLossSearchRepository;
    }

    /**
     * Save a splittingLoss.
     *
     * @param splittingLoss the entity to save
     * @return the persisted entity
     */
    @Override
    public SplittingLoss save(SplittingLoss splittingLoss) {
        log.debug("Request to save SplittingLoss : {}", splittingLoss);
        SplittingLoss result = splittingLossRepository.save(splittingLoss);
        splittingLossSearchRepository.save(result);
        return result;
    }

    @Override
    public List<SplittingLoss> save(List<SplittingLoss> splittingLosses) {
        log.debug("Request to save SplittingLosses : {}", splittingLosses.size());
        List<SplittingLoss> result = splittingLossRepository.save(splittingLosses);
        splittingLossSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the splittingLosses.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SplittingLoss> findAll() {
        log.debug("Request to get all SplittingLosses");
        return splittingLossRepository.findAll();
    }

    /**
     * Get one splittingLoss by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SplittingLoss findOne(Long id) {
        log.debug("Request to get SplittingLoss : {}", id);
        return splittingLossRepository.findOne(id);
    }

    /**
     * Delete the splittingLoss by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete SplittingLoss : {}", id);
        splittingLossRepository.delete(id);
        splittingLossSearchRepository.delete(id);
    }

    public void delete(List<SplittingLoss> splittingLosses) {
        log.debug("Request to delete SplittingLosses : {}", splittingLosses);
        splittingLossRepository.delete(splittingLosses);
        splittingLossSearchRepository.delete(splittingLosses);
    }

    /**
     * Search for the splittingLoss corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SplittingLoss> search(String query) {
        log.debug("Request to search SplittingLosses for query {}", query);
        return StreamSupport
            .stream(splittingLossSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public List<SplittingLoss> findAllBySelfAssessmentID(Long selfAssessmentID) {
        log.debug("Request to get all SplittingLosses by SelfAssessment ID: " + selfAssessmentID);
        return splittingLossRepository.findAllBySelfAssessmentID(selfAssessmentID);
    }

    @Override
    public SplittingLoss getDATASplittingLossBySelfAssessmentID(Long selfAssessmentID) {
        log.debug("Request to get DATA SplittingLoss by SelfAssessment ID: " + selfAssessmentID);
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        
        if (selfAssessment != null) {
            try {
                List<MyAsset> dataAssets = this.myAssetService.findAllBySelfAssessmentAndCategoryType(selfAssessmentID, CategoryType.DATA);

                if (dataAssets != null && !dataAssets.isEmpty()) {
                    SplittingLoss dataSplittingLoss = new SplittingLoss();
                    dataSplittingLoss.setId(null);
                    dataSplittingLoss.setSelfAssessment(selfAssessment);
                    dataSplittingLoss.setCategoryType(CategoryType.DATA);
                    dataSplittingLoss.setSectorType(SectorType.GLOBAL);

                    dataSplittingLoss.setLossPercentage(BigDecimal.ZERO);

                    BigDecimal lossValue = dataAssets.stream().map(myAsset -> myAsset.getLossValue() != null ? myAsset.getLossValue() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);

                    dataSplittingLoss.setLoss(lossValue);

                    return dataSplittingLoss;
                } else {
                    return null;
                }
            } catch (NotImplementedYetException e) {
                e.printStackTrace();
                return null;
            }
        }

        return null;
    }
}
