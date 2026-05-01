terraform {
  required_version = "1.14.9"

  cloud {

    organization = "aek676"

    workspaces {
      name = "my-soccer-project"
    }
  }
}
