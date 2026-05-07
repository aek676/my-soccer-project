output "repository_url" {
  value       = "${google_artifact_registry_repository.my-repo.location}-docker.pkg.dev/${google_artifact_registry_repository.my-repo.project}/${google_artifact_registry_repository.my-repo.repository_id}"
  description = "The URL of the Artifact Registry repository"
}

output "workload_identity_provider" {
  description = "Full path of the Workload Identity Provider"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "service_account_email" {
  description = "Email of the GitHub Actions Service Account"
  value       = google_service_account.github_actions_sa.email
}

output "project_number" {
  description = "GCP Project Number"
  value       = var.project_id
}

resource "google_service_account_key" "azure_pull_key" {
  service_account_id = google_service_account.azure_pull_sa.name
}

output "artifact_registry_json_key" {
  value     = google_service_account_key.azure_pull_key.private_key
  sensitive = true
}

output "artifact_registry_email" {
  value = google_service_account.azure_pull_sa.email
}

