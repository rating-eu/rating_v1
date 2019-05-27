/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
}
