resource "azapi_resource" "app" {
  type      = "Microsoft.App/containerApps@2025-10-02-preview"
  name      = var.app_name
  parent_id = var.resource_group_id
  location  = var.location

  body = {
    properties = merge(
      {
        managedEnvironmentId = var.environment_id
        template = {
          containers = [
            {
              name  = "app"
              image = var.image
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
      },
      var.enable_ingress ? {
        configuration = {
          ingress = {
            external   = true
            targetPort = 8080
          }
        }
      } : {}
    )
  }

  response_export_values = var.enable_ingress ? ["properties.configuration.ingress.fqdn"] : []

  lifecycle {
    ignore_changes = [
      body.properties.template.containers[0].image,
    ]
  }
}