output "repository_url" {
  value       = "${google_artifact_registry_repository.my-repo.location}-docker.pkg.dev/${google_artifact_registry_repository.my-repo.project}/${google_artifact_registry_repository.my-repo.repository_id}"
  description = "The URL of the Artifact Registry repository"
}