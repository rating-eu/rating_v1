package eu.hermeneut.repository;

import eu.hermeneut.domain.MyCompany;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the MyCompany entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyCompanyRepository extends JpaRepository<MyCompany, Long> {

    @Query("SELECT myCompany FROM MyCompany myCompany where myCompany.user.id = :userID")
    MyCompany findOneByUser(@Param("userID") Long userID);
}
