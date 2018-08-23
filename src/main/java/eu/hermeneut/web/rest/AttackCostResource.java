package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing AttackCost.
 */
@RestController
@RequestMapping("/api")
public class AttackCostResource {

    private final Logger log = LoggerFactory.getLogger(AttackCostResource.class);

    private static final String ENTITY_NAME = "attackCost";

    private final AttackCostService attackCostService;

    public AttackCostResource(AttackCostService attackCostService) {
        this.attackCostService = attackCostService;
    }

    /**
     * POST  /attack-costs : Create a new attackCost.
     *
     * @param attackCost the attackCost to create
     * @return the ResponseEntity with status 201 (Created) and with body the new attackCost, or with status 400 (Bad Request) if the attackCost has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/attack-costs")
    @Timed
    public ResponseEntity<AttackCost> createAttackCost(@Valid @RequestBody AttackCost attackCost) throws URISyntaxException {
        log.debug("REST request to save AttackCost : {}", attackCost);
        if (attackCost.getId() != null) {
            throw new BadRequestAlertException("A new attackCost cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AttackCost result = attackCostService.save(attackCost);
        return ResponseEntity.created(new URI("/api/attack-costs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /attack-costs : Updates an existing attackCost.
     *
     * @param attackCost the attackCost to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated attackCost,
     * or with status 400 (Bad Request) if the attackCost is not valid,
     * or with status 500 (Internal Server Error) if the attackCost couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/attack-costs")
    @Timed
    public ResponseEntity<AttackCost> updateAttackCost(@Valid @RequestBody AttackCost attackCost) throws URISyntaxException {
        log.debug("REST request to update AttackCost : {}", attackCost);
        if (attackCost.getId() == null) {
            return createAttackCost(attackCost);
        }
        AttackCost result = attackCostService.save(attackCost);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, attackCost.getId().toString()))
            .body(result);
    }

    /**
     * GET  /attack-costs : get all the attackCosts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackCosts in body
     */
    @GetMapping("/attack-costs")
    @Timed
    public List<AttackCost> getAllAttackCosts() {
        log.debug("REST request to get all AttackCosts");
        return attackCostService.findAll();
        }

    /**
     * GET  /attack-costs/:id : get the "id" attackCost.
     *
     * @param id the id of the attackCost to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the attackCost, or with status 404 (Not Found)
     */
    @GetMapping("/attack-costs/{id}")
    @Timed
    public ResponseEntity<AttackCost> getAttackCost(@PathVariable Long id) {
        log.debug("REST request to get AttackCost : {}", id);
        AttackCost attackCost = attackCostService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(attackCost));
    }

    /**
     * DELETE  /attack-costs/:id : delete the "id" attackCost.
     *
     * @param id the id of the attackCost to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/attack-costs/{id}")
    @Timed
    public ResponseEntity<Void> deleteAttackCost(@PathVariable Long id) {
        log.debug("REST request to delete AttackCost : {}", id);
        attackCostService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/attack-costs?query=:query : search for the attackCost corresponding
     * to the query.
     *
     * @param query the query of the attackCost search
     * @return the result of the search
     */
    @GetMapping("/_search/attack-costs")
    @Timed
    public List<AttackCost> searchAttackCosts(@RequestParam String query) {
        log.debug("REST request to search AttackCosts for query {}", query);
        return attackCostService.search(query);
    }

}
