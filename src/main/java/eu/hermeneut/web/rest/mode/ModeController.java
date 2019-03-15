package eu.hermeneut.web.rest.mode;

import eu.hermeneut.config.ApplicationProperties;
import eu.hermeneut.domain.enumeration.Mode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ModeController {
    @Autowired
    private ApplicationProperties properties;

    @GetMapping("mode")
    public Mode getApplicationMode() {
        return this.properties.getMode();
    }
}
