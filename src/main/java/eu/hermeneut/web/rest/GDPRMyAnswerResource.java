package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.GDPRMyAnswer;
import eu.hermeneut.service.GDPRMyAnswerService;
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
 * REST controller for managing GDPRMyAnswer.
 */
@RestController
@RequestMapping("/api")
public class GDPRMyAnswerResource {

    private final Logger log = LoggerFactory.getLogger(GDPRMyAnswerResource.class);

    private static final String ENTITY_NAME = "gDPRMyAnswer";

    private final GDPRMyAnswerService gDPRMyAnswerService;

    public GDPRMyAnswerResource(GDPRMyAnswerService gDPRMyAnswerService) {
        this.gDPRMyAnswerService = gDPRMyAnswerService;
    }

    /**
     * POST  /gdpr-my-answers : Create a new gDPRMyAnswer.
     *
     * @param gDPRMyAnswer the gDPRMyAnswer to create
     * @return the ResponseEntity with status 201 (Created) and with body the new gDPRMyAnswer, or with status 400 (Bad Request) if the gDPRMyAnswer has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/gdpr-my-answers")
    @Timed
    public ResponseEntity<GDPRMyAnswer> createGDPRMyAnswer(@RequestBody GDPRMyAnswer gDPRMyAnswer) throws URISyntaxException {
        log.debug("REST request to save GDPRMyAnswer : {}", gDPRMyAnswer);
        if (gDPRMyAnswer.getId() != null) {
            throw new BadRequestAlertException("A new gDPRMyAnswer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GDPRMyAnswer result = gDPRMyAnswerService.save(gDPRMyAnswer);
        return ResponseEntity.created(new URI("/api/gdpr-my-answers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /gdpr-my-answers : Updates an existing gDPRMyAnswer.
     *
     * @param gDPRMyAnswer the gDPRMyAnswer to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated gDPRMyAnswer,
     * or with status 400 (Bad Request) if the gDPRMyAnswer is not valid,
     * or with status 500 (Internal Server Error) if the gDPRMyAnswer couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/gdpr-my-answers")
    @Timed
    public ResponseEntity<GDPRMyAnswer> updateGDPRMyAnswer(@RequestBody GDPRMyAnswer gDPRMyAnswer) throws URISyntaxException {
        log.debug("REST request to update GDPRMyAnswer : {}", gDPRMyAnswer);
        if (gDPRMyAnswer.getId() == null) {
            return createGDPRMyAnswer(gDPRMyAnswer);
        }
        GDPRMyAnswer result = gDPRMyAnswerService.save(gDPRMyAnswer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, gDPRMyAnswer.getId().toString()))
            .body(result);
    }

    /**
     * GET  /gdpr-my-answers : get all the gDPRMyAnswers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of gDPRMyAnswers in body
     */
    @GetMapping("/gdpr-my-answers")
    @Timed
    public List<GDPRMyAnswer> getAllGDPRMyAnswers() {
        log.debug("REST request to get all GDPRMyAnswers");
        return gDPRMyAnswerService.findAll();
        }

    /**
     * GET  /gdpr-my-answers/:id : get the "id" gDPRMyAnswer.
     *
     * @param id the id of the gDPRMyAnswer to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the gDPRMyAnswer, or with status 404 (Not Found)
     */
    @GetMapping("/gdpr-my-answers/{id}")
    @Timed
    public ResponseEntity<GDPRMyAnswer> getGDPRMyAnswer(@PathVariable Long id) {
        log.debug("REST request to get GDPRMyAnswer : {}", id);
        GDPRMyAnswer gDPRMyAnswer = gDPRMyAnswerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(gDPRMyAnswer));
    }

    /**
     * DELETE  /gdpr-my-answers/:id : delete the "id" gDPRMyAnswer.
     *
     * @param id the id of the gDPRMyAnswer to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/gdpr-my-answers/{id}")
    @Timed
    public ResponseEntity<Void> deleteGDPRMyAnswer(@PathVariable Long id) {
        log.debug("REST request to delete GDPRMyAnswer : {}", id);
        gDPRMyAnswerService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
