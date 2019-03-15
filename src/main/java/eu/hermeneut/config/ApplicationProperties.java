package eu.hermeneut.config;

import eu.hermeneut.domain.enumeration.Mode;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Hermeneut.
 * <p>
 * Properties are configured in the application.yml file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
    private String currency;
    private Mode mode;

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }
}
