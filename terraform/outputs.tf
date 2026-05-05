output "repository_url" {
  description = "The URL of the Artifact Registry repository"
  value       = module.gcp.repository_url
}

output "workload_identity_provider" {
  description = "Full path of the Workload Identity Provider"
  value       = module.gcp.workload_identity_provider
}

output "service_account_email" {
  description = "Email of the GitHub Actions Service Account"
  value       = module.gcp.service_account_email
}

output "project_number" {
  description = "GCP Project Number"
  value       = module.gcp.project_number
}

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "container_app_environment_id" {
  value = azurerm_container_app_environment.env.id
}

output "eureka_server_id" {
  value = azapi_resource.eureka_server.id
}

