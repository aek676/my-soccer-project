variable "location" {
  type        = string
  default     = "norwayeast"
  description = "The Azure region to deploy resources in"
}

variable "prefix" {
  type        = string
  default     = "my-soccer-project"
  description = "A prefix for naming resources"
}

variable "config_server_uri" {
  type        = string
  description = "URI for the Spring Cloud Config Server Git repository"
}

variable "app_name" {
  type        = string
  description = "Name of the container app"
}

variable "image" {
  type        = string
  description = "Docker image for the container app"
}

variable "services" {
  type        = list(string)
  default     = ["comments-service", "ideal-team-service", "players-service"]
  description = "List of microservice names to deploy"
}
