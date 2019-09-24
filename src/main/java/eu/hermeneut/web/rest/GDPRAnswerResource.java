package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.GDPRAnswer;
import eu.hermeneut.service.GDPRAnswerService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing GDPRAnswer.
 */
@RestController
@RequestMapping("/api")
public class GDPRAnswerResource {

    private final Logger log = LoggerFactory.getLogger(GDPRAnswerResource.class);

    private static final String ENTITY_NAME = "gDPRAnswer";

    private final GDPRAnswerService gDPRAnswerService;

    public GDPRAnswerResource(GDPRAnswerService gDPRAnswerService) {
        this.gDPRAnswerService = gDPRAnswerService;
    }

    /**
     * POST  /gdpr-answers : Create a new gDPRAnswer.
     *
     * @param gDPRAnswer the gDPRAnswer to create
     * @return the ResponseEntity with status 201 (Created) and with body the new gDPRAnswer, or with status 400 (Bad Request) if the gDPRAnswer has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/gdpr-answers")
    @Timed
    public ResponseEntity<GDPRAnswer> createGDPRAnswer(@RequestBody GDPRAnswer gDPRAnswer) throws URISyntaxException {
        log.debug("REST request to save GDPRAnswer : {}", gDPRAnswer);
        if (gDPRAnswer.getId() != null) {
            throw new BadRequestAlertException("A new gDPRAnswer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GDPRAnswer result = gDPRAnswerService.save(gDPRAnswer);
        return ResponseEntity.created(new URI("/api/gdpr-answers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /gdpr-answers : Updates an existing gDPRAnswer.
     *
     * @param gDPRAnswer the gDPRAnswer to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated gDPRAnswer,
     * or with status 400 (Bad Request) if the gDPRAnswer is not valid,
     * or with status 500 (Internal Server Error) if the gDPRAnswer couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/gdpr-answers")
    @Timed
    public ResponseEntity<GDPRAnswer> updateGDPRAnswer(@RequestBody GDPRAnswer gDPRAnswer) throws URISyntaxException {
        log.debug("REST request to update GDPRAnswer : {}", gDPRAnswer);
        if (gDPRAnswer.getId() == null) {
            return createGDPRAnswer(gDPRAnswer);
        }
        GDPRAnswer result = gDPRAnswerService.save(gDPRAnswer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, gDPRAnswer.getId().toString()))
            .body(result);
    }

    /**
     * GET  /gdpr-answers : get all the gDPRAnswers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of gDPRAnswers in body
     */
    @GetMapping("/gdpr-answers")
    @Timed
    public List<GDPRAnswer> getAllGDPRAnswers() {
        log.debug("REST request to get all GDPRAnswers");
        return gDPRAnswerService.findAll();
        }

    /**
     * GET  /gdpr-answers/:id : get the "id" gDPRAnswer.
     *
     * @param id the id of the gDPRAnswer to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the gDPRAnswer, or with status 404 (Not Found)
     */
    @GetMapping("/gdpr-answers/{id}")
    @Timed
    public ResponseEntity<GDPRAnswer> getGDPRAnswer(@PathVariable Long id) {
        log.debug("REST request to get GDPRAnswer : {}", id);
        GDPRAnswer gDPRAnswer = gDPRAnswerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(gDPRAnswer));
    }

    /**
     * DELETE  /gdpr-answers/:id : delete the "id" gDPRAnswer.
     *
     * @param id the id of the gDPRAnswer to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/gdpr-answers/{id}")
    @Timed
    public ResponseEntity<Void> deleteGDPRAnswer(@PathVariable Long id) {
        log.debug("REST request to delete GDPRAnswer : {}", id);
        gDPRAnswerService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
