package eu.hermeneut.service.impl;

import eu.hermeneut.service.GDPRQuestionnaireStatusService;
import eu.hermeneut.domain.GDPRQuestionnaireStatus;
import eu.hermeneut.repository.GDPRQuestionnaireStatusRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing GDPRQuestionnaireStatus.
 */
@Service
@Transactional
public class GDPRQuestionnaireStatusServiceImpl implements GDPRQuestionnaireStatusService {

    private final Logger log = LoggerFactory.getLogger(GDPRQuestionnaireStatusServiceImpl.class);

    private final GDPRQuestionnaireStatusRepository gDPRQuestionnaireStatusRepository;

    public GDPRQuestionnaireStatusServiceImpl(GDPRQuestionnaireStatusRepository gDPRQuestionnaireStatusRepository) {
        this.gDPRQuestionnaireStatusRepository = gDPRQuestionnaireStatusRepository;
    }

    /**
     * Save a gDPRQuestionnaireStatus.
     *
     * @param gDPRQuestionnaireStatus the entity to save
     * @return the persisted entity
     */
    @Override
    public GDPRQuestionnaireStatus save(GDPRQuestionnaireStatus gDPRQuestionnaireStatus) {
        log.debug("Request to save GDPRQuestionnaireStatus : {}", gDPRQuestionnaireStatus);
        return gDPRQuestionnaireStatusRepository.save(gDPRQuestionnaireStatus);
    }

    /**
     * Get all the gDPRQuestionnaireStatuses.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<GDPRQuestionnaireStatus> findAll() {
        log.debug("Request to get all GDPRQuestionnaireStatuses");
        return gDPRQuestionnaireStatusRepository.findAll();
    }

    /**
     * Get one gDPRQuestionnaireStatus by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public GDPRQuestionnaireStatus findOne(Long id) {
        log.debug("Request to get GDPRQuestionnaireStatus : {}", id);
        return gDPRQuestionnaireStatusRepository.findOne(id);
    }

    /**
     * Delete the gDPRQuestionnaireStatus by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete GDPRQuestionnaireStatus : {}", id);
        gDPRQuestionnaireStatusRepository.delete(id);
    }
}
