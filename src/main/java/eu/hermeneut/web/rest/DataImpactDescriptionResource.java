package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.DataImpactDescription;
import eu.hermeneut.service.DataImpactDescriptionService;
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
 * REST controller for managing DataImpactDescription.
 */
@RestController
@RequestMapping("/api")
public class DataImpactDescriptionResource {

    private final Logger log = LoggerFactory.getLogger(DataImpactDescriptionResource.class);

    private static final String ENTITY_NAME = "dataImpactDescription";

    private final DataImpactDescriptionService dataImpactDescriptionService;

    public DataImpactDescriptionResource(DataImpactDescriptionService dataImpactDescriptionService) {
        this.dataImpactDescriptionService = dataImpactDescriptionService;
    }

    /**
     * POST  /data-impact-descriptions : Create a new dataImpactDescription.
     *
     * @param dataImpactDescription the dataImpactDescription to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dataImpactDescription, or with status 400 (Bad Request) if the dataImpactDescription has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/data-impact-descriptions")
    @Timed
    public ResponseEntity<DataImpactDescription> createDataImpactDescription(@Valid @RequestBody DataImpactDescription dataImpactDescription) throws URISyntaxException {
        log.debug("REST request to save DataImpactDescription : {}", dataImpactDescription);
        if (dataImpactDescription.getId() != null) {
            throw new BadRequestAlertException("A new dataImpactDescription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DataImpactDescription result = dataImpactDescriptionService.save(dataImpactDescription);
        return ResponseEntity.created(new URI("/api/data-impact-descriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /data-impact-descriptions : Updates an existing dataImpactDescription.
     *
     * @param dataImpactDescription the dataImpactDescription to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataImpactDescription,
     * or with status 400 (Bad Request) if the dataImpactDescription is not valid,
     * or with status 500 (Internal Server Error) if the dataImpactDescription couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-impact-descriptions")
    @Timed
    public ResponseEntity<DataImpactDescription> updateDataImpactDescription(@Valid @RequestBody DataImpactDescription dataImpactDescription) throws URISyntaxException {
        log.debug("REST request to update DataImpactDescription : {}", dataImpactDescription);
        if (dataImpactDescription.getId() == null) {
            return createDataImpactDescription(dataImpactDescription);
        }
        DataImpactDescription result = dataImpactDescriptionService.save(dataImpactDescription);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataImpactDescription.getId().toString()))
            .body(result);
    }

    /**
     * GET  /data-impact-descriptions : get all the dataImpactDescriptions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dataImpactDescriptions in body
     */
    @GetMapping("/data-impact-descriptions")
    @Timed
    public List<DataImpactDescription> getAllDataImpactDescriptions() {
        log.debug("REST request to get all DataImpactDescriptions");
        return dataImpactDescriptionService.findAll();
        }

    /**
     * GET  /data-impact-descriptions/:id : get the "id" dataImpactDescription.
     *
     * @param id the id of the dataImpactDescription to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dataImpactDescription, or with status 404 (Not Found)
     */
    @GetMapping("/data-impact-descriptions/{id}")
    @Timed
    public ResponseEntity<DataImpactDescription> getDataImpactDescription(@PathVariable Long id) {
        log.debug("REST request to get DataImpactDescription : {}", id);
        DataImpactDescription dataImpactDescription = dataImpactDescriptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(dataImpactDescription));
    }

    /**
     * DELETE  /data-impact-descriptions/:id : delete the "id" dataImpactDescription.
     *
     * @param id the id of the dataImpactDescription to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/data-impact-descriptions/{id}")
    @Timed
    public ResponseEntity<Void> deleteDataImpactDescription(@PathVariable Long id) {
        log.debug("REST request to delete DataImpactDescription : {}", id);
        dataImpactDescriptionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
