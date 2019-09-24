package eu.hermeneut.service.impl;

import eu.hermeneut.service.GDPRQuestionnaireService;
import eu.hermeneut.domain.GDPRQuestionnaire;
import eu.hermeneut.repository.GDPRQuestionnaireRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing GDPRQuestionnaire.
 */
@Service
@Transactional
public class GDPRQuestionnaireServiceImpl implements GDPRQuestionnaireService {

    private final Logger log = LoggerFactory.getLogger(GDPRQuestionnaireServiceImpl.class);

    private final GDPRQuestionnaireRepository gDPRQuestionnaireRepository;

    public GDPRQuestionnaireServiceImpl(GDPRQuestionnaireRepository gDPRQuestionnaireRepository) {
        this.gDPRQuestionnaireRepository = gDPRQuestionnaireRepository;
    }

    /**
     * Save a gDPRQuestionnaire.
     *
     * @param gDPRQuestionnaire the entity to save
     * @return the persisted entity
     */
    @Override
    public GDPRQuestionnaire save(GDPRQuestionnaire gDPRQuestionnaire) {
        log.debug("Request to save GDPRQuestionnaire : {}", gDPRQuestionnaire);
        return gDPRQuestionnaireRepository.save(gDPRQuestionnaire);
    }

    /**
     * Get all the gDPRQuestionnaires.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<GDPRQuestionnaire> findAll() {
        log.debug("Request to get all GDPRQuestionnaires");
        return gDPRQuestionnaireRepository.findAll();
    }

    /**
     * Get one gDPRQuestionnaire by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public GDPRQuestionnaire findOne(Long id) {
        log.debug("Request to get GDPRQuestionnaire : {}", id);
        return gDPRQuestionnaireRepository.findOne(id);
    }

    /**
     * Delete the gDPRQuestionnaire by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete GDPRQuestionnaire : {}", id);
        gDPRQuestionnaireRepository.delete(id);
    }
}
