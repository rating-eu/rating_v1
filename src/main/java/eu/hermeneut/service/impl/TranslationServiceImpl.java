package eu.hermeneut.service.impl;

import eu.hermeneut.service.TranslationService;
import eu.hermeneut.domain.Translation;
import eu.hermeneut.repository.TranslationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing Translation.
 */
@Service
@Transactional
public class TranslationServiceImpl implements TranslationService {

    private final Logger log = LoggerFactory.getLogger(TranslationServiceImpl.class);

    private final TranslationRepository translationRepository;

    public TranslationServiceImpl(TranslationRepository translationRepository) {
        this.translationRepository = translationRepository;
    }

    /**
     * Save a translation.
     *
     * @param translation the entity to save
     * @return the persisted entity
     */
    @Override
    public Translation save(Translation translation) {
        log.debug("Request to save Translation : {}", translation);
        return translationRepository.save(translation);
    }

    /**
     * Get all the translations.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Translation> findAll() {
        log.debug("Request to get all Translations");
        return translationRepository.findAll();
    }

    /**
     * Get one translation by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Translation findOne(Long id) {
        log.debug("Request to get Translation : {}", id);
        return translationRepository.findOne(id);
    }

    /**
     * Delete the translation by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Translation : {}", id);
        translationRepository.delete(id);
    }
}
