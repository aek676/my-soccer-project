package es.ual.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthHeaderFilter implements GlobalFilter, Ordered {

  private static final Logger log = LoggerFactory.getLogger(AuthHeaderFilter.class);

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    return exchange.getPrincipal()
        .filter(JwtAuthenticationToken.class::isInstance)
        .cast(JwtAuthenticationToken.class)
        .flatMap(auth -> {
          var jwt = auth.getToken();
          var uid = jwt.getSubject();
          var role = jwt.getClaimAsString("role");
          if (role == null) {
            role = "guest";
          }
          var email = jwt.getClaimAsString("email");
          var path = exchange.getRequest().getURI().getPath();

          log.info("Request auth [uid={}, role={}, email={}, path={}]",
              uid, role, email != null ? email : "none", path);

          var mutated = exchange.getRequest().mutate()
              .header("X-User-Id", uid)
              .header("X-User-Role", role);
          if (email != null) {
            mutated.header("X-User-Email", email);
          }
          mutated.header("X-User-Token", jwt.getTokenValue());

          var mutatedExchange = exchange.mutate()
              .request(mutated.build())
              .build();
          return chain.filter(mutatedExchange);
        })
        .switchIfEmpty(addGuestHeaders(exchange, chain));
  }

  private Mono<Void> addGuestHeaders(ServerWebExchange exchange, GatewayFilterChain chain) {
    var path = exchange.getRequest().getURI().getPath();
    log.info("Request auth [role=guest, path={}]", path);

    var mutated = exchange.getRequest().mutate()
        .header("X-User-Role", "guest")
        .build();
    return chain.filter(exchange.mutate().request(mutated).build());
  }

  @Override
  public int getOrder() {
    return Ordered.LOWEST_PRECEDENCE - 10;
  }
}
