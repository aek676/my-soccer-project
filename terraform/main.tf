data "google_project" "current" {}

module "gcp" {
  source     = "./modules/gcp"
  project_id = data.google_project.current.project_id
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.prefix}-eureka"
  location = var.location
}

resource "azurerm_log_analytics_workspace" "law" {
  name                = "law-${var.prefix}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "env" {
  name                       = "cae-${var.prefix}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id
}

resource "azapi_resource" "eureka_server" {
  type      = "Microsoft.App/managedEnvironments/javaComponents@2025-10-02-preview"
  name      = "eureka-server"
  parent_id = azurerm_container_app_environment.env.id
  body = {
    properties = {
      componentType = "SpringCloudEureka"
    }
  }
}