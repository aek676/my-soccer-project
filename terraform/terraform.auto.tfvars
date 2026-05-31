location          = "norwayeast"
prefix            = "my-soccer-project"
config_server_uri = "https://github.com/aek676/spring-my-soccer-project-microservices-config.git"
image             = "mcr.microsoft.com/javacomponents/samples/sample-service-eureka-client:latest"
java_services = {
  "comments-service"   = {}
  "ideal-team-service" = { needs_groq_api_key = true }
  "players-service"    = { needs_api_football_key = true }
}

