package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.DataRecipient;
import eu.hermeneut.service.DataRecipientService;
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
 * REST controller for managing DataRecipient.
 */
@RestController
@RequestMapping("/api")
public class DataRecipientResource {

    private final Logger log = LoggerFactory.getLogger(DataRecipientResource.class);

    private static final String ENTITY_NAME = "dataRecipient";

    private final DataRecipientService dataRecipientService;

    public DataRecipientResource(DataRecipientService dataRecipientService) {
        this.dataRecipientService = dataRecipientService;
    }

    /**
     * POST  /data-recipients : Create a new dataRecipient.
     *
     * @param dataRecipient the dataRecipient to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dataRecipient, or with status 400 (Bad Request) if the dataRecipient has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/data-recipients")
    @Timed
    public ResponseEntity<DataRecipient> createDataRecipient(@Valid @RequestBody DataRecipient dataRecipient) throws URISyntaxException {
        log.debug("REST request to save DataRecipient : {}", dataRecipient);
        if (dataRecipient.getId() != null) {
            throw new BadRequestAlertException("A new dataRecipient cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DataRecipient result = dataRecipientService.save(dataRecipient);
        return ResponseEntity.created(new URI("/api/data-recipients/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /data-recipients : Updates an existing dataRecipient.
     *
     * @param dataRecipient the dataRecipient to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataRecipient,
     * or with status 400 (Bad Request) if the dataRecipient is not valid,
     * or with status 500 (Internal Server Error) if the dataRecipient couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-recipients")
    @Timed
    public ResponseEntity<DataRecipient> updateDataRecipient(@Valid @RequestBody DataRecipient dataRecipient) throws URISyntaxException {
        log.debug("REST request to update DataRecipient : {}", dataRecipient);
        if (dataRecipient.getId() == null) {
            return createDataRecipient(dataRecipient);
        }
        DataRecipient result = dataRecipientService.save(dataRecipient);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataRecipient.getId().toString()))
            .body(result);
    }

    /**
     * GET  /data-recipients : get all the dataRecipients.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dataRecipients in body
     */
    @GetMapping("/data-recipients")
    @Timed
    public List<DataRecipient> getAllDataRecipients() {
        log.debug("REST request to get all DataRecipients");
        return dataRecipientService.findAll();
        }

    /**
     * GET  /data-recipients/:id : get the "id" dataRecipient.
     *
     * @param id the id of the dataRecipient to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dataRecipient, or with status 404 (Not Found)
     */
    @GetMapping("/data-recipients/{id}")
    @Timed
    public ResponseEntity<DataRecipient> getDataRecipient(@PathVariable Long id) {
        log.debug("REST request to get DataRecipient : {}", id);
        DataRecipient dataRecipient = dataRecipientService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(dataRecipient));
    }

    /**
     * DELETE  /data-recipients/:id : delete the "id" dataRecipient.
     *
     * @param id the id of the dataRecipient to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/data-recipients/{id}")
    @Timed
    public ResponseEntity<Void> deleteDataRecipient(@PathVariable Long id) {
        log.debug("REST request to delete DataRecipient : {}", id);
        dataRecipientService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
