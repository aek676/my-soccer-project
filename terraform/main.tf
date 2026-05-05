data "google_project" "current" {}

module "gcp" {
  source = "./modules/gcp"
  project_id = data.google_project.current.project_id
}