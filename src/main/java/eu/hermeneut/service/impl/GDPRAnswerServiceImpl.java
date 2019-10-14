package eu.hermeneut.service.impl;

import eu.hermeneut.service.GDPRAnswerService;
import eu.hermeneut.domain.GDPRAnswer;
import eu.hermeneut.repository.GDPRAnswerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing GDPRAnswer.
 */
@Service
@Transactional
public class GDPRAnswerServiceImpl implements GDPRAnswerService {

    private final Logger log = LoggerFactory.getLogger(GDPRAnswerServiceImpl.class);

    private final GDPRAnswerRepository gDPRAnswerRepository;

    public GDPRAnswerServiceImpl(GDPRAnswerRepository gDPRAnswerRepository) {
        this.gDPRAnswerRepository = gDPRAnswerRepository;
    }

    /**
     * Save a gDPRAnswer.
     *
     * @param gDPRAnswer the entity to save
     * @return the persisted entity
     */
    @Override
    public GDPRAnswer save(GDPRAnswer gDPRAnswer) {
        log.debug("Request to save GDPRAnswer : {}", gDPRAnswer);
        return gDPRAnswerRepository.save(gDPRAnswer);
    }

    /**
     * Get all the gDPRAnswers.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<GDPRAnswer> findAll() {
        log.debug("Request to get all GDPRAnswers");
        return gDPRAnswerRepository.findAll();
    }

    /**
     * Get one gDPRAnswer by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public GDPRAnswer findOne(Long id) {
        log.debug("Request to get GDPRAnswer : {}", id);
        return gDPRAnswerRepository.findOne(id);
    }

    /**
     * Delete the gDPRAnswer by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete GDPRAnswer : {}", id);
        gDPRAnswerRepository.delete(id);
    }
}
