terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "web" {
  image  = "ubuntu-22-04-x64"
  name   = "devops-project"
  region = "nyc1"
  size   = "s-1vcpu-2gb"
  
  ssh_keys = [digitalocean_ssh_key.default.fingerprint]
  
  user_data = <<-EOF
    #!/bin/bash
    apt update
    apt install -y docker.io docker-compose git
    systemctl enable docker
    systemctl start docker
    usermod -aG docker root
  EOF
}

resource "digitalocean_ssh_key" "default" {
  name       = "devops-key"
  public_key = file("/home/pathum_vimukthi/.ssh/id_rsa.pub")
}

output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}