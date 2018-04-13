package eu.hermeneut.web.rest;

import eu.hermeneut.config.Constants;
import com.codahale.metrics.annotation.Timed;

import eu.hermeneut.domain.Asset;
import eu.hermeneut.domain.User;
import eu.hermeneut.repository.UserRepository;
import eu.hermeneut.repository.search.UserSearchRepository;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.AssetService;
import eu.hermeneut.service.MailService;
import eu.hermeneut.service.UserService;
import eu.hermeneut.service.dto.UserDTO;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.errors.EmailAlreadyUsedException;
import eu.hermeneut.web.rest.errors.LoginAlreadyUsedException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import eu.hermeneut.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

@RestController
@RequestMapping("/api")
public class EvaluateWeacknessResource {
    private final Logger log = LoggerFactory.getLogger(AssetResource.class);

    private final AssetService assetService;

    public EvaluateWeacknessResource(AssetService assetService) {
        this.assetService = assetService;
    }

    /**
     * GET  /identify-assets : get all the assets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of assets in body
     */
    @GetMapping("/identify-assets")
    @Timed
    public List<Asset> getAllAssets() {
		log.debug("REST request to get all Assets");
        return assetService.findAll();
        }

}
