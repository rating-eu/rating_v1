package eu.hermeneut.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.enumeration.Level;
import eu.hermeneut.domain.enumeration.Phase;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing AttackStrategy.
 */
@RestController
@RequestMapping("/api")
public class AttackStrategyResource {

    private final Logger log = LoggerFactory.getLogger(AttackStrategyResource.class);

    private static final String ENTITY_NAME = "attackStrategy";

    private final AttackStrategyService attackStrategyService;

    public AttackStrategyResource(AttackStrategyService attackStrategyService) {
        this.attackStrategyService = attackStrategyService;
    }

    /**
     * POST  /attack-strategies : Create a new attackStrategy.
     *
     * @param attackStrategy the attackStrategy to create
     * @return the ResponseEntity with status 201 (Created) and with body the new attackStrategy, or with status 400 (Bad Request) if the attackStrategy has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/attack-strategies")
    @Timed
    public ResponseEntity<AttackStrategy> createAttackStrategy(@Valid @RequestBody AttackStrategy attackStrategy) throws URISyntaxException {
        log.debug("REST request to save AttackStrategy : {}", attackStrategy);
        if (attackStrategy.getId() != null) {
            throw new BadRequestAlertException("A new attackStrategy cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AttackStrategy result = attackStrategyService.save(attackStrategy);
        return ResponseEntity.created(new URI("/api/attack-strategies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /attack-strategies : Updates an existing attackStrategy.
     *
     * @param attackStrategy the attackStrategy to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated attackStrategy,
     * or with status 400 (Bad Request) if the attackStrategy is not valid,
     * or with status 500 (Internal Server Error) if the attackStrategy couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/attack-strategies")
    @Timed
    public ResponseEntity<AttackStrategy> updateAttackStrategy(@Valid @RequestBody AttackStrategy attackStrategy) throws URISyntaxException {
        log.debug("REST request to update AttackStrategy : {}", attackStrategy);
        if (attackStrategy.getId() == null) {
            return createAttackStrategy(attackStrategy);
        }
        AttackStrategy result = attackStrategyService.save(attackStrategy);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, attackStrategy.getId().toString()))
            .body(result);
    }

    /**
     * GET  /attack-strategies : get all the attackStrategies.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies")
    @Timed
    public List<AttackStrategy> getAllAttackStrategies() {
        log.debug("REST request to get all AttackStrategies");
        return attackStrategyService.findAll();
        }

    /**
     * GET  /attack-strategies/level/{level} : get all the attackStrategiesByLevel.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies/level/{level}")
    @Timed
    public List<AttackStrategy> getAllAttackStrategiesByLevel(@PathVariable String level) {
        log.debug("REST request to get all AttackStrategies BY LEVEL");
        System.out.println("LEVEL "+ level);
        List<AttackStrategy> toReturn = new ArrayList<AttackStrategy>();
        try {
        	Level l = Level.valueOf(level);
            toReturn = attackStrategyService.findAllByLevel(l);

        }catch(IllegalArgumentException e){
        	e.printStackTrace();
        }
        System.out.println("toRETURN SIZE -----> "+ toReturn.size());
        return toReturn;
        }
    
    /**
     * GET  /attack-strategies/phase/{phase} : get all the attackStrategiesByPhase.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies/phase/{phase}")
    @Timed
    public List<AttackStrategy> getAllAttackStrategiesByPhase(@PathVariable String phase) {
        log.debug("REST request to get all AttackStrategies BY Phase");
        System.out.println("PHASE "+ phase);
        List<AttackStrategy> toReturn = new ArrayList<AttackStrategy>();
        try {
        	Phase ph = Phase.valueOf(phase);
            toReturn = attackStrategyService.findAllByPhase(ph);

        }catch(IllegalArgumentException e){
        	System.out.println("ERROR-------------------------------------------");
        	e.printStackTrace();
        }
        System.out.println("toRETURN SIZE -----> "+ toReturn.size());
        return toReturn;
        }    

    
    /**
     * GET  /attack-strategies/l/{level}/p/{phase} : get all the attackStrategiesByLevelAndPhase.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies/l/{level}/p/{phase}")
    @Timed
    public List<AttackStrategy> attackStrategiesByLevelAndPhase(@PathVariable String level, @PathVariable String phase) {
        log.debug("REST request to get all AttackStrategies BY LEVEL AND Phase");
        System.out.println("PHASE "+ phase);
        List<AttackStrategy> toReturn = new ArrayList<AttackStrategy>();
        try {
        	Phase ph = Phase.valueOf(phase);
        	Level l= Level.valueOf(level);
            toReturn = attackStrategyService.findAllByLevelAndPhase(l, ph);

        }catch(IllegalArgumentException e){
        	System.out.println("ERROR-------------------------------------------");
        	e.printStackTrace();
        }
        System.out.println("toRETURN SIZE -----> "+ toReturn.size());
        return toReturn;
        }    
    
    
    /**
     * GET  /attack-strategies/:id : get the "id" attackStrategy.
     *
     * @param id the id of the attackStrategy to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the attackStrategy, or with status 404 (Not Found)
     */
    @GetMapping("/attack-strategies/{id}")
    @Timed
    public ResponseEntity<AttackStrategy> getAttackStrategy(@PathVariable Long id) {
        log.debug("REST request to get AttackStrategy : {}", id);
        AttackStrategy attackStrategy = attackStrategyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(attackStrategy));
    }

    /**
     * DELETE  /attack-strategies/:id : delete the "id" attackStrategy.
     *
     * @param id the id of the attackStrategy to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/attack-strategies/{id}")
    @Timed
    public ResponseEntity<Void> deleteAttackStrategy(@PathVariable Long id) {
        log.debug("REST request to delete AttackStrategy : {}", id);
        attackStrategyService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/attack-strategies?query=:query : search for the attackStrategy corresponding
     * to the query.
     *
     * @param query the query of the attackStrategy search
     * @return the result of the search
     */
    @GetMapping("/_search/attack-strategies")
    @Timed
    public List<AttackStrategy> searchAttackStrategies(@RequestParam String query) {
        log.debug("REST request to search AttackStrategies for query {}", query);
        return attackStrategyService.search(query);
    }

}
