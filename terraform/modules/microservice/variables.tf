variable "app_name" {
  description = "Name of the microservice"
  type        = string
}

variable "image" {
  description = "Docker image for the container app"
  type        = string
}

variable "eureka_server_id" {
  description = "ID of the Eureka Server resource"
  type        = string
}

variable "config_server_id" {
  description = "ID of the Config Server resource"
  type        = string
}

variable "resource_group_id" {
  description = "ID of the resource group"
  type        = string
}

variable "environment_id" {
  description = "ID of the Container App Environment"
  type        = string
}

variable "location" {
  description = "Azure location"
  type        = string
}

variable "enable_ingress" {
  description = "Enable external ingress. Set to false for internal microservices, true for gateway"
  type        = bool
  default     = false
}

variable "gcp_registry_server" {
  description = "GCP Artifact Registry server hostname"
  type        = string
  default     = "us-central1-docker.pkg.dev"
}

variable "gcp_registry_username" {
  description = "GCP service account email for registry authentication"
  type        = string
}

variable "gcp_registry_password" {
  description = "GCP service account private key for registry authentication"
  sensitive   = true
  type        = string
}

variable "postgres_url" {
  type        = string
  description = "JDBC URL for PostgreSQL"
  default     = ""
}

variable "postgres_user" {
  type        = string
  description = "PostgreSQL user"
  default     = ""
}

variable "postgres_password" {
  type        = string
  description = "PostgreSQL password"
  sensitive   = true
  default     = ""
}

