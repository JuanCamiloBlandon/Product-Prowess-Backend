terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

data "azurerm_resource_group" "existing" {
  name = "TerraformResourceGroup"
}

data "azurerm_container_registry" "existing" {
  name                = "acrterraformproductprowess"
  resource_group_name = data.azurerm_resource_group.existing.name
}

data "azurerm_public_ip" "existing_public_ip" {
  name                = "ip-estatica-backend"
  resource_group_name = data.azurerm_resource_group.existing.name
}

resource "null_resource" "docker_push" {
  provisioner "local-exec" {
    command = "echo 'Docker image pushed to ACR'"
  }
}

resource "azurerm_container_group" "aci" {
  name                = "mycontainerinstance2" 
  location            = data.azurerm_resource_group.existing.location
  resource_group_name = data.azurerm_resource_group.existing.name
  os_type             = "Linux"
  ip_address_type     = "Public"
  ip_address          = data.azurerm_public_ip.existing_public_ip.ip_address
  container {
    name   = "my-container"
    image  = "${data.azurerm_container_registry.existing.login_server}/product-prowess-backend:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 3000
      protocol = "TCP"
    }
  }

  image_registry_credential {
    server   = data.azurerm_container_registry.existing.login_server
    username = data.azurerm_container_registry.existing.admin_username
    password = data.azurerm_container_registry.existing.admin_password
  }

  depends_on = [null_resource.docker_push, data.azurerm_container_registry.existing]
}