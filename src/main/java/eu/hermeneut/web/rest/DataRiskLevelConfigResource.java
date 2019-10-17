package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.DataOperation;
import eu.hermeneut.domain.DataRiskLevelConfig;
import eu.hermeneut.service.DataOperationService;
import eu.hermeneut.service.DataRiskLevelConfigService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing DataRiskLevelConfig.
 */
@RestController
@RequestMapping("/api")
public class DataRiskLevelConfigResource {

    private final Logger log = LoggerFactory.getLogger(DataRiskLevelConfigResource.class);

    private static final String ENTITY_NAME = "dataRiskLevelConfig";

    private final DataRiskLevelConfigService dataRiskLevelConfigService;

    @Autowired
    private DataOperationService dataOperationService;

    public DataRiskLevelConfigResource(DataRiskLevelConfigService dataRiskLevelConfigService) {
        this.dataRiskLevelConfigService = dataRiskLevelConfigService;
    }

    /**
     * POST  /data-risk-level-configs : Create a new dataRiskLevelConfig.
     *
     * @param dataRiskLevelConfig the dataRiskLevelConfig to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dataRiskLevelConfig, or with status 400 (Bad Request) if the dataRiskLevelConfig has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/data-risk-level-configs")
    @Timed
    public ResponseEntity<DataRiskLevelConfig> createDataRiskLevelConfig(@Valid @RequestBody DataRiskLevelConfig dataRiskLevelConfig) throws URISyntaxException {
        log.debug("REST request to save DataRiskLevelConfig : {}", dataRiskLevelConfig);
        if (dataRiskLevelConfig.getId() != null) {
            throw new BadRequestAlertException("A new dataRiskLevelConfig cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DataRiskLevelConfig result = dataRiskLevelConfigService.save(dataRiskLevelConfig);
        return ResponseEntity.created(new URI("/api/data-risk-level-configs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /data-risk-level-configs : Updates an existing dataRiskLevelConfig.
     *
     * @param dataRiskLevelConfig the dataRiskLevelConfig to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataRiskLevelConfig,
     * or with status 400 (Bad Request) if the dataRiskLevelConfig is not valid,
     * or with status 500 (Internal Server Error) if the dataRiskLevelConfig couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-risk-level-configs")
    @Timed
    public ResponseEntity<DataRiskLevelConfig> updateDataRiskLevelConfig(@Valid @RequestBody DataRiskLevelConfig dataRiskLevelConfig) throws URISyntaxException {
        log.debug("REST request to update DataRiskLevelConfig : {}", dataRiskLevelConfig);
        if (dataRiskLevelConfig.getId() == null) {
            return createDataRiskLevelConfig(dataRiskLevelConfig);
        }
        DataRiskLevelConfig result = dataRiskLevelConfigService.save(dataRiskLevelConfig);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataRiskLevelConfig.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /data-risk-level-configs/operation/{operationID}/all : Updates a list existing dataRiskLevelConfig belonging to a given DataOperation.
     *
     * @param dataRiskLevelConfigs the list of dataRiskLevelConfigs to update.
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataRiskLevelConfig,
     * or with status 400 (Bad Request) if the dataRiskLevelConfig is not valid,
     * or with status 500 (Internal Server Error) if the dataRiskLevelConfig couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-risk-level-configs/operation/{operationID}")
    @Timed
    public List<DataRiskLevelConfig> updateAllDataRiskLevelConfigsByDataOperation(@PathVariable Long operationID, @Valid @RequestBody List<DataRiskLevelConfig> dataRiskLevelConfigs) throws URISyntaxException {
        log.debug("REST request to update a list of DataRiskLevelConfigs for DataOperation : {}", operationID);


        if (dataRiskLevelConfigs == null || dataRiskLevelConfigs.isEmpty()) {
            throw new BadRequestAlertException("The list of DataRiskLevelConfigs can NOT be NULL or EMPTY!", ENTITY_NAME, "emptylist");
        }

        DataOperation dataOperation = this.dataOperationService.findOne(operationID);

        if (dataOperation == null) {
            throw new BadRequestAlertException("The DataOperation does not exist.", ENTITY_NAME, "operation_not_found");
        }

        dataRiskLevelConfigs.stream().parallel().forEach((config) -> {
            if (config.getOperation() == null || !config.getOperation().getId().equals(operationID)) {
                throw new BadRequestAlertException("All the DataRiskLevelConfigs must belong to the given DataOperation!", ENTITY_NAME, "extraneous_configurations");
            }
        });

        boolean isValid = this.dataRiskLevelConfigService.validate(dataRiskLevelConfigs);

        if (isValid) {
            // Update the configs
            return this.dataRiskLevelConfigService.save(dataRiskLevelConfigs);
        } else {
            throw new BadRequestAlertException("Configs are NOT VALID!", ENTITY_NAME, "invalid_configs");
        }
    }

    /**
     * GET  /data-risk-level-configs : get all the dataRiskLevelConfigs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dataRiskLevelConfigs in body
     */
    @GetMapping("/data-risk-level-configs")
    @Timed
    public List<DataRiskLevelConfig> getAllDataRiskLevelConfigs() {
        log.debug("REST request to get all DataRiskLevelConfigs");
        return dataRiskLevelConfigService.findAll();
    }

    /**
     * GET  /data-risk-level-configs/operation/:operationID : get all the dataRiskLevelConfigs of the DataOperation.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dataRiskLevelConfigs in body
     */
    @GetMapping("/data-risk-level-configs/operation/{operationID}")
    @Timed
    public List<DataRiskLevelConfig> getAllDataRiskLevelConfigsByDataOperation(@PathVariable Long operationID) {
        log.debug("REST request to get all DataRiskLevelConfigs");
        return dataRiskLevelConfigService.findAllByDataOperation(operationID);
    }

    /**
     * GET  /data-risk-level-configs/:id : get the "id" dataRiskLevelConfig.
     *
     * @param id the id of the dataRiskLevelConfig to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dataRiskLevelConfig, or with status 404 (Not Found)
     */
    @GetMapping("/data-risk-level-configs/{id}")
    @Timed
    public ResponseEntity<DataRiskLevelConfig> getDataRiskLevelConfig(@PathVariable Long id) {
        log.debug("REST request to get DataRiskLevelConfig : {}", id);
        DataRiskLevelConfig dataRiskLevelConfig = dataRiskLevelConfigService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(dataRiskLevelConfig));
    }

    /**
     * DELETE  /data-risk-level-configs/:id : delete the "id" dataRiskLevelConfig.
     *
     * @param id the id of the dataRiskLevelConfig to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/data-risk-level-configs/{id}")
    @Timed
    public ResponseEntity<Void> deleteDataRiskLevelConfig(@PathVariable Long id) {
        log.debug("REST request to delete DataRiskLevelConfig : {}", id);
        dataRiskLevelConfigService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
