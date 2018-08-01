package eu.hermeneut.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String EXTERNAL_AUDIT = "ROLE_EXTERNAL_AUDIT";

    public static final String CISO = "ROLE_CISO";

    private AuthoritiesConstants() {
    }
}
