package es.ual.ideal_team_service.repository;

import es.ual.ideal_team_service.model.IdealTeam;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdealTeamRepository extends JpaRepository<IdealTeam, Long> {
  List<IdealTeam> findByIdUser(String idUser);
}