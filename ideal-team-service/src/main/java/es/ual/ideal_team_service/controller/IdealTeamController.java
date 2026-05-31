package es.ual.ideal_team_service.controller;

import es.ual.ideal_team_service.dto.IdealTeamResponse;
import es.ual.ideal_team_service.dto.IdealTeamSaveRequest;
import es.ual.ideal_team_service.dto.PlayerResponse;
import es.ual.ideal_team_service.exception.UnauthorizedException;
import es.ual.ideal_team_service.service.IdealTeamService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ideal-team")
@RequiredArgsConstructor
public class IdealTeamController {

  private final IdealTeamService idealTeamService;

  @GetMapping("/generate")
  public ResponseEntity<List<PlayerResponse>> generateIdealTeam() {
    List<PlayerResponse> team = idealTeamService.generateIdealTeam();
    return ResponseEntity.ok(team);
  }

  @PostMapping
  public ResponseEntity<IdealTeamResponse> saveIdealTeam(
      @Valid @RequestBody IdealTeamSaveRequest request,
      @RequestHeader(value = "X-User-Id", required = false) String userId) {
    if (userId == null || userId.isBlank()) {
      throw new UnauthorizedException();
    }
    IdealTeamResponse response = idealTeamService.saveIdealTeam(request, userId);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping
  public ResponseEntity<List<IdealTeamResponse>> getUserTeams(
      @RequestHeader(value = "X-User-Id", required = false) String userId) {
    if (userId == null || userId.isBlank()) {
      throw new UnauthorizedException();
    }
    List<IdealTeamResponse> teams = idealTeamService.getUserTeams(userId);
    return ResponseEntity.ok(teams);
  }
}