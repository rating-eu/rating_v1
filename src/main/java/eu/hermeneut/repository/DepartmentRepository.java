package eu.hermeneut.repository;

import eu.hermeneut.domain.Department;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Department entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    @Query("select department from Department department where department.user.login = ?#{principal.username}")
    List<Department> findByUserIsCurrentUser();

}
