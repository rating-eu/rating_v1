package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.SystemConfig;
import eu.hermeneut.service.SystemConfigService;
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
 * REST controller for managing SystemConfig.
 */
@RestController
@RequestMapping("/api")
public class SystemConfigResource {

    private final Logger log = LoggerFactory.getLogger(SystemConfigResource.class);

    private static final String ENTITY_NAME = "systemConfig";

    private final SystemConfigService systemConfigService;

    public SystemConfigResource(SystemConfigService systemConfigService) {
        this.systemConfigService = systemConfigService;
    }

    /**
     * POST  /system-configs : Create a new systemConfig.
     *
     * @param systemConfig the systemConfig to create
     * @return the ResponseEntity with status 201 (Created) and with body the new systemConfig, or with status 400 (Bad Request) if the systemConfig has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/system-configs")
    @Timed
    public ResponseEntity<SystemConfig> createSystemConfig(@Valid @RequestBody SystemConfig systemConfig) throws URISyntaxException {
        log.debug("REST request to save SystemConfig : {}", systemConfig);
        if (systemConfig.getId() != null) {
            throw new BadRequestAlertException("A new systemConfig cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SystemConfig result = systemConfigService.save(systemConfig);
        return ResponseEntity.created(new URI("/api/system-configs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /system-configs : Updates an existing systemConfig.
     *
     * @param systemConfig the systemConfig to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated systemConfig,
     * or with status 400 (Bad Request) if the systemConfig is not valid,
     * or with status 500 (Internal Server Error) if the systemConfig couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/system-configs")
    @Timed
    public ResponseEntity<SystemConfig> updateSystemConfig(@Valid @RequestBody SystemConfig systemConfig) throws URISyntaxException {
        log.debug("REST request to update SystemConfig : {}", systemConfig);
        if (systemConfig.getId() == null) {
            return createSystemConfig(systemConfig);
        }
        SystemConfig result = systemConfigService.save(systemConfig);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, systemConfig.getId().toString()))
            .body(result);
    }

    /**
     * GET  /system-configs : get all the systemConfigs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of systemConfigs in body
     */
    @GetMapping("/system-configs")
    @Timed
    public List<SystemConfig> getAllSystemConfigs() {
        log.debug("REST request to get all SystemConfigs");
        return systemConfigService.findAll();
        }

    /**
     * GET  /system-configs/:id : get the "id" systemConfig.
     *
     * @param id the id of the systemConfig to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the systemConfig, or with status 404 (Not Found)
     */
    @GetMapping("/system-configs/{id}")
    @Timed
    public ResponseEntity<SystemConfig> getSystemConfig(@PathVariable Long id) {
        log.debug("REST request to get SystemConfig : {}", id);
        SystemConfig systemConfig = systemConfigService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(systemConfig));
    }

    /**
     * DELETE  /system-configs/:id : delete the "id" systemConfig.
     *
     * @param id the id of the systemConfig to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/system-configs/{id}")
    @Timed
    public ResponseEntity<Void> deleteSystemConfig(@PathVariable Long id) {
        log.debug("REST request to delete SystemConfig : {}", id);
        systemConfigService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
