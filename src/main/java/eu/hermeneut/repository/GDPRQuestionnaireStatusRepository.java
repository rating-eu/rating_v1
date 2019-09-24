package eu.hermeneut.repository;

import eu.hermeneut.domain.GDPRQuestionnaireStatus;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the GDPRQuestionnaireStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GDPRQuestionnaireStatusRepository extends JpaRepository<GDPRQuestionnaireStatus, Long> {

    @Query("select gdpr_questionnaire_status from GDPRQuestionnaireStatus gdpr_questionnaire_status where gdpr_questionnaire_status.user.login = ?#{principal.username}")
    List<GDPRQuestionnaireStatus> findByUserIsCurrentUser();

}
