terraform {
  required_version = "1.15.1"

  cloud {

    organization = "aek676"

    workspaces {
      name = "my-soccer-project"
    }
  }
}
