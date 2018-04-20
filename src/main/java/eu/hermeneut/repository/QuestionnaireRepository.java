package eu.hermeneut.repository;

import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.domain.enumeration.Q_Scope;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the Questionnaire entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
    @Query("SELECT questionnaire FROM Questionnaire questionnaire WHERE questionnaire.purpose = :purpose")
    List<Questionnaire> findAllByScope(@Param("purpose") Q_Scope purpose);
}
