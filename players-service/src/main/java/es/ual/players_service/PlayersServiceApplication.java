package es.ual.players_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class PlayersServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(PlayersServiceApplication.class, args);
  }
}