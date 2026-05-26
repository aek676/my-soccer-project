package es.ual.gateway.config;

import java.text.ParseException;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jwt.JWTParser;
import reactor.core.publisher.Mono;

@Configuration
@Profile("local")
public class LocalJwtDecoderConfig {

  private static final Logger log = LoggerFactory.getLogger(LocalJwtDecoderConfig.class);

  @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
  private String expectedIssuer;

  @Bean
  ReactiveJwtDecoder localJwtDecoder() {
    return token -> {
      try {
        var parsed = JWTParser.parse(token);
        var claimsSet = parsed.getJWTClaimsSet();
        var headers = new HashMap<String, Object>();
        headers.put("alg", parsed.getHeader().getAlgorithm().getName());
        var header = parsed.getHeader();
        if (header instanceof JWSHeader jwsHeader && jwsHeader.getKeyID() != null) {
          headers.put("kid", jwsHeader.getKeyID());
        }
        if (parsed.getHeader().getType() != null) {
          headers.put("typ", parsed.getHeader().getType().getType());
        }
        var claims = new HashMap<String, Object>();
        claimsSet.getClaims().forEach(claims::put);
        var issuedAt = claimsSet.getIssueTime();
        var expiresAt = claimsSet.getExpirationTime();
        var jwt = new Jwt(
            token,
            issuedAt != null ? issuedAt.toInstant() : null,
            expiresAt != null ? expiresAt.toInstant() : null,
            headers,
            claims
        );
        var issuer = jwt.getClaimAsString("iss");
        log.info("Local JWT decoder - issuer: {}, expected: {}", issuer, expectedIssuer);
        if (!expectedIssuer.equals(issuer)) {
          log.warn("JWT rejected - issuer mismatch. Got: {}, Expected: {}", issuer, expectedIssuer);
          return Mono.error(new BadJwtException("Invalid issuer: " + issuer + ". Expected: " + expectedIssuer));
        }
        return Mono.just(jwt);
      } catch (ParseException e) {
        log.error("Failed to parse JWT", e);
        return Mono.error(new BadJwtException("Failed to parse JWT", e));
      }
    };
  }

}
