resource "google_artifact_registry_repository" "my-repo" {
  location      = "us-central1"
  repository_id = "soccer-artifact-repo"
  description   = "MSP docker repository"
  format        = "DOCKER"
}

resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "github-pool"
  display_name              = "GitHub Actions Pool"
  description               = "Workload Identity Pool for GitHub Actions OIDC"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Provider"
  description                        = "OIDC Provider for GitHub Actions"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  attribute_condition = "attribute.repository == 'aek676/my-soccer-project'"
}

resource "google_service_account" "github_actions_sa" {
  account_id   = "github-actions-sa"
  display_name = "GitHub Actions Service Account"
  description  = "Service Account for GitHub Actions CI/CD"
}

resource "google_service_account_iam_member" "github_sa_impersonation" {
  service_account_id = google_service_account.github_actions_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/aek676/my-soccer-project"
}

resource "google_artifact_registry_repository_iam_member" "repo_writer" {
  project    = google_artifact_registry_repository.my-repo.project
  location   = google_artifact_registry_repository.my-repo.location
  repository = google_artifact_registry_repository.my-repo.repository_id
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

resource "google_service_account" "azure_pull_sa" {
  account_id   = "azure-container-apps-pull"
  display_name = "Azure Container Apps Pull"
  description  = "Service Account for Azure Container Apps to pull images from GCP Artifact Registry"
}

resource "google_service_account_key" "azure_pull_key" {
  service_account_id = google_service_account.azure_pull_sa.name
}

resource "google_artifact_registry_repository_iam_member" "azure_pull_reader" {
  project    = google_artifact_registry_repository.my-repo.project
  location   = google_artifact_registry_repository.my-repo.location
  repository = google_artifact_registry_repository.my-repo.repository_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.azure_pull_sa.email}"
}

