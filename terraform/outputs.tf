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

output "gateway_app_id" {
  description = "ID of the API Gateway container app"
  value       = module.gateway.app_id
}

output "gateway_app_fqdn" {
  description = "FQDN of the API Gateway"
  value       = module.gateway.app_fqdn
}

output "microservice_app_ids" {
  description = "Map of microservice names to their container app IDs"
  value       = { for k, v in module.microservices : k => v.app_id }
}

output "microservice_app_fqdns" {
  description = "Map of microservice names to their FQDNs (only with ingress enabled)"
  value       = { for k, v in module.microservices : k => v.app_fqdn }
}

output "container_environment_domain" {
  description = "Default domain of the Container Apps environment"
  value       = azurerm_container_app_environment.env.default_domain
}

output "eureka_server_url" {
  description = "URL of the Eureka Server"
  value       = "https://eureka-server-azure-java.ext.${azurerm_container_app_environment.env.default_domain}"
}
