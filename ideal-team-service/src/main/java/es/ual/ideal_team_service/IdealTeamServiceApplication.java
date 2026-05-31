package es.ual.ideal_team_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class IdealTeamServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(IdealTeamServiceApplication.class, args);
	}

}
