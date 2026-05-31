resource "azapi_resource" "app" {
  type      = "Microsoft.App/containerApps@2025-10-02-preview"
  name      = var.app_name
  parent_id = var.resource_group_id
  location  = var.location

  body = {
    properties = {
      managedEnvironmentId = var.environment_id
      template = {
        containers = [
          {
            name  = "app"
            image = var.image
            env = concat(
              [
                {
                  name  = "SPRING_PROFILES_ACTIVE"
                  value = "prod"
                }
              ],
              var.postgres_url != "" ? [
                {
                  name  = "POSTGRES_URL"
                  value = var.postgres_url
                },
                {
                  name  = "POSTGRES_USER"
                  value = var.postgres_user
                },
                {
                  name      = "POSTGRES_PASSWORD"
                  secretRef = "postgres-password"
                }
              ] : [],
              var.mongo_atlas_uri != "" ? [
                {
                  name      = "MONGO_ATLAS_URI"
                  secretRef = "mongo-atlas-uri"
                }
              ] : [],
              var.api_key_api_football != "" ? [
                {
                  name      = "API_KEY_API_FOOTBALL"
                  secretRef = "api-key-api-football"
                }
              ] : [],
              var.groq_api_key != "" ? [
                {
                  name      = "GROQ_API_KEY"
                  secretRef = "groq-api-key"
                }
              ] : []
            )
            resources = {
              cpu    = 0.5
              memory = "1Gi"
            }
          }
        ]
        scale = {
          minReplicas = 1
          maxReplicas = 1
        }
        serviceBinds = [
          {
            serviceId = var.eureka_server_id
            name      = "eureka-server"
          },
          {
            serviceId = var.config_server_id
            name      = "config-server-for-spring"
          }
        ]
      }
      configuration = merge(
        {
          registries = [
            {
              server            = var.gcp_registry_server
              username          = var.gcp_registry_username
              passwordSecretRef = "gcp-registry-secret"
            }
          ]
          secrets = concat(
            [
              {
                name  = "gcp-registry-secret"
                value = var.gcp_registry_password
              }
            ],
            var.postgres_password != "" ? [
              {
                name  = "postgres-password"
                value = var.postgres_password
              }
            ] : [],
            var.mongo_atlas_uri != "" ? [
              {
                name  = "mongo-atlas-uri"
                value = var.mongo_atlas_uri
              }
            ] : [],
            var.api_key_api_football != "" ? [
              {
                name  = "api-key-api-football"
                value = var.api_key_api_football
              }
            ] : [],
            var.groq_api_key != "" ? [
              {
                name  = "groq-api-key"
                value = var.groq_api_key
              }
            ] : []
          )
        },
        var.enable_ingress ? {
          ingress = {
            external   = true
            targetPort = 8080
          }
        } : {}
      )
    }
  }

  response_export_values = var.enable_ingress ? ["properties.configuration.ingress.fqdn"] : []

  lifecycle {
    ignore_changes = [
      body.properties.template.containers[0].image,
    ]
  }
}

