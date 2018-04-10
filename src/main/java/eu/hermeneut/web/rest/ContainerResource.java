package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.Container;
import eu.hermeneut.service.ContainerService;
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
 * REST controller for managing Container.
 */
@RestController
@RequestMapping("/api")
public class ContainerResource {

    private final Logger log = LoggerFactory.getLogger(ContainerResource.class);

    private static final String ENTITY_NAME = "container";

    private final ContainerService containerService;

    public ContainerResource(ContainerService containerService) {
        this.containerService = containerService;
    }

    /**
     * POST  /containers : Create a new container.
     *
     * @param container the container to create
     * @return the ResponseEntity with status 201 (Created) and with body the new container, or with status 400 (Bad Request) if the container has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/containers")
    @Timed
    public ResponseEntity<Container> createContainer(@Valid @RequestBody Container container) throws URISyntaxException {
        log.debug("REST request to save Container : {}", container);
        if (container.getId() != null) {
            throw new BadRequestAlertException("A new container cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Container result = containerService.save(container);
        return ResponseEntity.created(new URI("/api/containers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /containers : Updates an existing container.
     *
     * @param container the container to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated container,
     * or with status 400 (Bad Request) if the container is not valid,
     * or with status 500 (Internal Server Error) if the container couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/containers")
    @Timed
    public ResponseEntity<Container> updateContainer(@Valid @RequestBody Container container) throws URISyntaxException {
        log.debug("REST request to update Container : {}", container);
        if (container.getId() == null) {
            return createContainer(container);
        }
        Container result = containerService.save(container);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, container.getId().toString()))
            .body(result);
    }

    /**
     * GET  /containers : get all the containers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of containers in body
     */
    @GetMapping("/containers")
    @Timed
    public List<Container> getAllContainers() {
        log.debug("REST request to get all Containers");
        return containerService.findAll();
        }

    /**
     * GET  /containers/:id : get the "id" container.
     *
     * @param id the id of the container to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the container, or with status 404 (Not Found)
     */
    @GetMapping("/containers/{id}")
    @Timed
    public ResponseEntity<Container> getContainer(@PathVariable Long id) {
        log.debug("REST request to get Container : {}", id);
        Container container = containerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(container));
    }

    /**
     * DELETE  /containers/:id : delete the "id" container.
     *
     * @param id the id of the container to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/containers/{id}")
    @Timed
    public ResponseEntity<Void> deleteContainer(@PathVariable Long id) {
        log.debug("REST request to delete Container : {}", id);
        containerService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/containers?query=:query : search for the container corresponding
     * to the query.
     *
     * @param query the query of the container search
     * @return the result of the search
     */
    @GetMapping("/_search/containers")
    @Timed
    public List<Container> searchContainers(@RequestParam String query) {
        log.debug("REST request to search Containers for query {}", query);
        return containerService.search(query);
    }

}
