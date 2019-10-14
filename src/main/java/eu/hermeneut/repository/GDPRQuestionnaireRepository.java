package eu.hermeneut.repository;

import eu.hermeneut.domain.GDPRQuestionnaire;
import eu.hermeneut.domain.enumeration.GDPRQuestionnairePurpose;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the GDPRQuestionnaire entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GDPRQuestionnaireRepository extends JpaRepository<GDPRQuestionnaire, Long> {

    @Query("SELECT questionnaire from GDPRQuestionnaire questionnaire WHERE questionnaire.purpose = :purpose")
    GDPRQuestionnaire findOneByPurpose(@Param("purpose") GDPRQuestionnairePurpose purpose);
}
