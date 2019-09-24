package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.DataOperation;
import eu.hermeneut.service.DataOperationService;
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
 * REST controller for managing DataOperation.
 */
@RestController
@RequestMapping("/api")
public class DataOperationResource {

    private final Logger log = LoggerFactory.getLogger(DataOperationResource.class);

    private static final String ENTITY_NAME = "dataOperation";

    private final DataOperationService dataOperationService;

    public DataOperationResource(DataOperationService dataOperationService) {
        this.dataOperationService = dataOperationService;
    }

    /**
     * POST  /data-operations : Create a new dataOperation.
     *
     * @param dataOperation the dataOperation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dataOperation, or with status 400 (Bad Request) if the dataOperation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/data-operations")
    @Timed
    public ResponseEntity<DataOperation> createDataOperation(@Valid @RequestBody DataOperation dataOperation) throws URISyntaxException {
        log.debug("REST request to save DataOperation : {}", dataOperation);
        if (dataOperation.getId() != null) {
            throw new BadRequestAlertException("A new dataOperation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DataOperation result = dataOperationService.save(dataOperation);
        return ResponseEntity.created(new URI("/api/data-operations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /data-operations : Updates an existing dataOperation.
     *
     * @param dataOperation the dataOperation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataOperation,
     * or with status 400 (Bad Request) if the dataOperation is not valid,
     * or with status 500 (Internal Server Error) if the dataOperation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-operations")
    @Timed
    public ResponseEntity<DataOperation> updateDataOperation(@Valid @RequestBody DataOperation dataOperation) throws URISyntaxException {
        log.debug("REST request to update DataOperation : {}", dataOperation);
        if (dataOperation.getId() == null) {
            return createDataOperation(dataOperation);
        }
        DataOperation result = dataOperationService.save(dataOperation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataOperation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /data-operations : get all the dataOperations.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dataOperations in body
     */
    @GetMapping("/data-operations")
    @Timed
    public List<DataOperation> getAllDataOperations() {
        log.debug("REST request to get all DataOperations");
        return dataOperationService.findAll();
        }

    /**
     * GET  /data-operations/:id : get the "id" dataOperation.
     *
     * @param id the id of the dataOperation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dataOperation, or with status 404 (Not Found)
     */
    @GetMapping("/data-operations/{id}")
    @Timed
    public ResponseEntity<DataOperation> getDataOperation(@PathVariable Long id) {
        log.debug("REST request to get DataOperation : {}", id);
        DataOperation dataOperation = dataOperationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(dataOperation));
    }

    /**
     * DELETE  /data-operations/:id : delete the "id" dataOperation.
     *
     * @param id the id of the dataOperation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/data-operations/{id}")
    @Timed
    public ResponseEntity<Void> deleteDataOperation(@PathVariable Long id) {
        log.debug("REST request to delete DataOperation : {}", id);
        dataOperationService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
