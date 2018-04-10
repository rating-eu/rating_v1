package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.ThreatAgent;
import eu.hermeneut.service.ThreatAgentService;
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
 * REST controller for managing ThreatAgent.
 */
@RestController
@RequestMapping("/api")
public class ThreatAgentResource {

    private final Logger log = LoggerFactory.getLogger(ThreatAgentResource.class);

    private static final String ENTITY_NAME = "threatAgent";

    private final ThreatAgentService threatAgentService;

    public ThreatAgentResource(ThreatAgentService threatAgentService) {
        this.threatAgentService = threatAgentService;
    }

    /**
     * POST  /threat-agents : Create a new threatAgent.
     *
     * @param threatAgent the threatAgent to create
     * @return the ResponseEntity with status 201 (Created) and with body the new threatAgent, or with status 400 (Bad Request) if the threatAgent has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/threat-agents")
    @Timed
    public ResponseEntity<ThreatAgent> createThreatAgent(@Valid @RequestBody ThreatAgent threatAgent) throws URISyntaxException {
        log.debug("REST request to save ThreatAgent : {}", threatAgent);
        if (threatAgent.getId() != null) {
            throw new BadRequestAlertException("A new threatAgent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ThreatAgent result = threatAgentService.save(threatAgent);
        return ResponseEntity.created(new URI("/api/threat-agents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /threat-agents : Updates an existing threatAgent.
     *
     * @param threatAgent the threatAgent to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated threatAgent,
     * or with status 400 (Bad Request) if the threatAgent is not valid,
     * or with status 500 (Internal Server Error) if the threatAgent couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/threat-agents")
    @Timed
    public ResponseEntity<ThreatAgent> updateThreatAgent(@Valid @RequestBody ThreatAgent threatAgent) throws URISyntaxException {
        log.debug("REST request to update ThreatAgent : {}", threatAgent);
        if (threatAgent.getId() == null) {
            return createThreatAgent(threatAgent);
        }
        ThreatAgent result = threatAgentService.save(threatAgent);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, threatAgent.getId().toString()))
            .body(result);
    }

    /**
     * GET  /threat-agents : get all the threatAgents.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of threatAgents in body
     */
    @GetMapping("/threat-agents")
    @Timed
    public List<ThreatAgent> getAllThreatAgents() {
        log.debug("REST request to get all ThreatAgents");
        return threatAgentService.findAll();
        }

    /**
     * GET  /threat-agents/:id : get the "id" threatAgent.
     *
     * @param id the id of the threatAgent to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the threatAgent, or with status 404 (Not Found)
     */
    @GetMapping("/threat-agents/{id}")
    @Timed
    public ResponseEntity<ThreatAgent> getThreatAgent(@PathVariable Long id) {
        log.debug("REST request to get ThreatAgent : {}", id);
        ThreatAgent threatAgent = threatAgentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(threatAgent));
    }

    /**
     * DELETE  /threat-agents/:id : delete the "id" threatAgent.
     *
     * @param id the id of the threatAgent to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/threat-agents/{id}")
    @Timed
    public ResponseEntity<Void> deleteThreatAgent(@PathVariable Long id) {
        log.debug("REST request to delete ThreatAgent : {}", id);
        threatAgentService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/threat-agents?query=:query : search for the threatAgent corresponding
     * to the query.
     *
     * @param query the query of the threatAgent search
     * @return the result of the search
     */
    @GetMapping("/_search/threat-agents")
    @Timed
    public List<ThreatAgent> searchThreatAgents(@RequestParam String query) {
        log.debug("REST request to search ThreatAgents for query {}", query);
        return threatAgentService.search(query);
    }

}
