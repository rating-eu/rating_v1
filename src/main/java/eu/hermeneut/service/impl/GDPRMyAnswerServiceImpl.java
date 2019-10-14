package eu.hermeneut.service.impl;

import eu.hermeneut.service.GDPRMyAnswerService;
import eu.hermeneut.domain.GDPRMyAnswer;
import eu.hermeneut.repository.GDPRMyAnswerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing GDPRMyAnswer.
 */
@Service
@Transactional
public class GDPRMyAnswerServiceImpl implements GDPRMyAnswerService {

    private final Logger log = LoggerFactory.getLogger(GDPRMyAnswerServiceImpl.class);

    private final GDPRMyAnswerRepository gDPRMyAnswerRepository;

    public GDPRMyAnswerServiceImpl(GDPRMyAnswerRepository gDPRMyAnswerRepository) {
        this.gDPRMyAnswerRepository = gDPRMyAnswerRepository;
    }

    /**
     * Save a gDPRMyAnswer.
     *
     * @param gDPRMyAnswer the entity to save
     * @return the persisted entity
     */
    @Override
    public GDPRMyAnswer save(GDPRMyAnswer gDPRMyAnswer) {
        log.debug("Request to save GDPRMyAnswer : {}", gDPRMyAnswer);
        return gDPRMyAnswerRepository.save(gDPRMyAnswer);
    }

    /**
     * Get all the gDPRMyAnswers.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<GDPRMyAnswer> findAll() {
        log.debug("Request to get all GDPRMyAnswers");
        return gDPRMyAnswerRepository.findAll();
    }

    /**
     * Get one gDPRMyAnswer by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public GDPRMyAnswer findOne(Long id) {
        log.debug("Request to get GDPRMyAnswer : {}", id);
        return gDPRMyAnswerRepository.findOne(id);
    }

    /**
     * Delete the gDPRMyAnswer by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete GDPRMyAnswer : {}", id);
        gDPRMyAnswerRepository.delete(id);
    }
}
