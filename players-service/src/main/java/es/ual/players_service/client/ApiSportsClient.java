package es.ual.players_service.client;

import es.ual.players_service.dto.ApiSportsPlayerResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "apiSportsClient", url = "https://v3.football.api-sports.io")
public interface ApiSportsClient {

  @GetMapping("/players")
  ApiSportsPlayerResponse getPlayers(
      @RequestParam("id") Long id,
      @RequestParam("season") Integer season,
      @RequestHeader("x-apisports-key") String apiKey);

  @GetMapping("/players/profiles")
  ApiSportsPlayerResponse searchPlayers(
      @RequestParam("search") String search,
      @RequestHeader("x-apisports-key") String apiKey);
}