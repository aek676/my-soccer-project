output "app_id" {
  description = "ID of the container app"
  value       = azapi_resource.app.id
}

output "app_fqdn" {
  description = "FQDN of the container app (only available when ingress is enabled)"
  value       = var.enable_ingress ? azapi_resource.app.output : null
}