package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.MyCompany;
import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing MyCompany.
 */
@RestController
@RequestMapping("/api")
public class MyCompanyResource {

    private final Logger log = LoggerFactory.getLogger(MyCompanyResource.class);

    private static final String ENTITY_NAME = "myCompany";

    private final MyCompanyService myCompanyService;

    public MyCompanyResource(MyCompanyService myCompanyService) {
        this.myCompanyService = myCompanyService;
    }

    /**
     * POST  /my-companies : Create a new myCompany.
     *
     * @param myCompany the myCompany to create
     * @return the ResponseEntity with status 201 (Created) and with body the new myCompany, or with status 400 (Bad Request) if the myCompany has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/my-companies")
    @Timed
    public ResponseEntity<MyCompany> createMyCompany(@RequestBody MyCompany myCompany) throws URISyntaxException {
        log.debug("REST request to save MyCompany : {}", myCompany);
        if (myCompany.getId() != null) {
            throw new BadRequestAlertException("A new myCompany cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyCompany result = myCompanyService.save(myCompany);
        return ResponseEntity.created(new URI("/api/my-companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /my-companies : Updates an existing myCompany.
     *
     * @param myCompany the myCompany to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated myCompany,
     * or with status 400 (Bad Request) if the myCompany is not valid,
     * or with status 500 (Internal Server Error) if the myCompany couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/my-companies")
    @Timed
    public ResponseEntity<MyCompany> updateMyCompany(@RequestBody MyCompany myCompany) throws URISyntaxException {
        log.debug("REST request to update MyCompany : {}", myCompany);
        if (myCompany.getId() == null) {
            return createMyCompany(myCompany);
        }
        MyCompany result = myCompanyService.save(myCompany);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, myCompany.getId().toString()))
            .body(result);
    }

    /**
     * GET  /my-companies : get all the myCompanies.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of myCompanies in body
     */
    @GetMapping("/my-companies")
    @Timed
    public List<MyCompany> getAllMyCompanies() {
        log.debug("REST request to get all MyCompanies");
        return myCompanyService.findAll();
    }

    /**
     * GET  /my-companies/:id : get the "id" myCompany.
     *
     * @param id the id of the myCompany to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the myCompany, or with status 404 (Not Found)
     */
    @GetMapping("/my-companies/{id}")
    @Timed
    public ResponseEntity<MyCompany> getMyCompany(@PathVariable Long id) {
        log.debug("REST request to get MyCompany : {}", id);
        MyCompany myCompany = myCompanyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(myCompany));
    }

    @GetMapping("/my-companies/by-user/{userId}")
    @Timed
    public ResponseEntity<MyCompany> getMyCompanyByUser(@PathVariable Long userId) {
        log.debug("REST request to get MyCompany by user : {}", userId);
        MyCompany myCompany = myCompanyService.findOneByUser(userId);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(myCompany));
    }

    /**
     * DELETE  /my-companies/:id : delete the "id" myCompany.
     *
     * @param id the id of the myCompany to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/my-companies/{id}")
    @Timed
    public ResponseEntity<Void> deleteMyCompany(@PathVariable Long id) {
        log.debug("REST request to delete MyCompany : {}", id);
        myCompanyService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/my-companies?query=:query : search for the myCompany corresponding
     * to the query.
     *
     * @param query the query of the myCompany search
     * @return the result of the search
     */
    @GetMapping("/_search/my-companies")
    @Timed
    public List<MyCompany> searchMyCompanies(@RequestParam String query) {
        log.debug("REST request to search MyCompanies for query {}", query);
        return myCompanyService.search(query);
    }

}
