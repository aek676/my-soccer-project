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

