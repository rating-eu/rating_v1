package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.DataThreat;
import eu.hermeneut.service.DataThreatService;
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

/**
 * REST controller for managing DataThreat.
 */
@RestController
@RequestMapping("/api")
public class DataThreatResource {

    private final Logger log = LoggerFactory.getLogger(DataThreatResource.class);

    private static final String ENTITY_NAME = "dataThreat";

    private final DataThreatService dataThreatService;

    public DataThreatResource(DataThreatService dataThreatService) {
        this.dataThreatService = dataThreatService;
    }

    /**
     * POST  /data-threats : Create a new dataThreat.
     *
     * @param dataThreat the dataThreat to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dataThreat, or with status 400 (Bad Request) if the dataThreat has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/data-threats")
    @Timed
    public ResponseEntity<DataThreat> createDataThreat(@Valid @RequestBody DataThreat dataThreat) throws URISyntaxException {
        log.debug("REST request to save DataThreat : {}", dataThreat);
        if (dataThreat.getId() != null) {
            throw new BadRequestAlertException("A new dataThreat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DataThreat result = dataThreatService.save(dataThreat);
        return ResponseEntity.created(new URI("/api/data-threats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /data-threats : Updates an existing dataThreat.
     *
     * @param dataThreat the dataThreat to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataThreat,
     * or with status 400 (Bad Request) if the dataThreat is not valid,
     * or with status 500 (Internal Server Error) if the dataThreat couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-threats")
    @Timed
    public ResponseEntity<DataThreat> updateDataThreat(@Valid @RequestBody DataThreat dataThreat) throws URISyntaxException {
        log.debug("REST request to update DataThreat : {}", dataThreat);
        if (dataThreat.getId() == null) {
            return createDataThreat(dataThreat);
        }
        DataThreat result = dataThreatService.save(dataThreat);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataThreat.getId().toString()))
            .body(result);
    }

    /**
     * GET  /data-threats : get all the dataThreats.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dataThreats in body
     */
    @GetMapping("/data-threats")
    @Timed
    public List<DataThreat> getAllDataThreats() {
        log.debug("REST request to get all DataThreats");
        return dataThreatService.findAll();
    }

    @GetMapping("/data-threats/operation/{operationID}")
    @Timed
    public List<DataThreat> getAllByDataOperation(@PathVariable Long operationID) {
        log.debug("REST request to get all DataThreats by DataOperation: {}", operationID);

        return this.dataThreatService.findAllByDataOperation(operationID);
    }

    /**
     * GET  /data-threats/:id : get the "id" dataThreat.
     *
     * @param id the id of the dataThreat to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dataThreat, or with status 404 (Not Found)
     */
    @GetMapping("/data-threats/{id}")
    @Timed
    public ResponseEntity<DataThreat> getDataThreat(@PathVariable Long id) {
        log.debug("REST request to get DataThreat : {}", id);
        DataThreat dataThreat = dataThreatService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(dataThreat));
    }

    /**
     * DELETE  /data-threats/:id : delete the "id" dataThreat.
     *
     * @param id the id of the dataThreat to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/data-threats/{id}")
    @Timed
    public ResponseEntity<Void> deleteDataThreat(@PathVariable Long id) {
        log.debug("REST request to delete DataThreat : {}", id);
        dataThreatService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
