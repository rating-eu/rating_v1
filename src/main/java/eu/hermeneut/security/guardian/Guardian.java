package eu.hermeneut.security.guardian;

public interface Guardian<T> {
    boolean isCISO(Long id);

    boolean isCISO(T t);

    boolean isExternal(Long id);

    boolean isExternal(T t);
}
