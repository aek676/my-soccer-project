variable "location" {
  type        = string
  default     = "norwayeast"
  description = "The Azure region to deploy resources in"
}

variable "prefix" {
  type        = string
  description = "A prefix for naming resources"
}

variable "config_server_uri" {
  type        = string
  description = "URI for the Spring Cloud Config Server Git repository"
}

variable "image" {
  type        = string
  description = "Docker image for the container app"
}

variable "java_services" {
  type        = list(string)
  description = "List of microservice names to deploy"
}

variable "supabase_url" {
  type        = string
  description = "JDBC URL for the Supabase PostgreSQL database"
}

variable "supabase_user" {
  type        = string
  description = "Supabase PostgreSQL database user"
}

variable "supabase_password" {
  type        = string
  description = "Supabase PostgreSQL database password"
  sensitive   = true
}
