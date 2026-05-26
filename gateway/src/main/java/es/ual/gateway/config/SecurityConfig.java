package es.ual.gateway.config;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Flux;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

  @Value("${cors.allowed-origin-patterns:http://localhost:8100}")
  private List<String> allowedOriginPatterns;

  @Bean
  SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    return http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeExchange(exchanges -> exchanges
            // TODO: Implement role-based access control
            // Roles come from JWT "role" claim mapped as ROLE_<role>
            //   - guest:  ROLE_GUEST  (no token or role: "guest")
            //   - user:   ROLE_USER
            //   - admin:  ROLE_ADMIN
            //
            // Example:
            //   .pathMatchers(HttpMethod.GET, "/bun-backend/**").permitAll()
            //   .pathMatchers(HttpMethod.POST, "/**").hasRole("USER")
            //   .pathMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")
            .anyExchange().permitAll()
        )
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt
                .jwtAuthenticationConverter(jwtAuthenticationConverter())
            )
        )
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    var configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(allowedOriginPatterns);
    configuration.setAllowedMethods(List.of("*"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  ReactiveJwtAuthenticationConverter jwtAuthenticationConverter() {
    var converter = new ReactiveJwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(jwt -> {
      var role = jwt.getClaimAsString("role");
      if (role == null) {
        role = "guest";
      }
      return Flux.just(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
    });
    return converter;
  }
}
