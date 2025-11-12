# Infrastructure: DigitalOcean + Ansible

This folder provisions a DigitalOcean Droplet with Terraform and configures/deploys the app using Ansible and Docker Compose.

## Prereqs
- Terraform >= 1.5
- Ansible >= 2.14
- DigitalOcean Personal Access Token
- An SSH key in your DO account (name), and the private/public keys locally (`~/.ssh/id_rsa`)

## Terraform (DigitalOcean)
Files under `infrastructure/terraform` provision:
- VPC (10.10.0.0/16)
- Ubuntu 22.04 Droplet
- Firewall allowing 22, 80, 443, 3008, 5001

### Variables
- `do_token` (string, required)
- `region` (default `blr1`)
- `ssh_key_name` (string, required; must match an existing DO SSH key name)
- `droplet_size` (default `s-1vcpu-2gb`)
- `image` (default `ubuntu-22-04-x64`)
- `project_name` (default `personal-library`)

### Usage
```bash
# From project root (WSL shell)
cd infrastructure/terraform
export TF_VAR_do_token="<your_do_token>"
terraform init
terraform apply -var="ssh_key_name=<your-do-ssh-key-name>"
# Note the droplet_ip output
```

## Ansible (Configure + Deploy)
Inventory and roles under `infrastructure/ansible`:
- `roles/docker`: installs Docker Engine + compose plugin
- `roles/app`: clones the repo on the droplet and runs `docker compose up -d --build`

### Inventory
Edit `infrastructure/ansible/inventory.ini` and replace `${DROPLET_IP}` with the IP from Terraform output `droplet_ip`.

### Run
```bash
cd infrastructure/ansible
ansible -i inventory.ini -m ping app
ansible-playbook -i inventory.ini site.yml
```

### Notes
- The playbook builds images on the droplet using your existing `compose.yaml` and Dockerfiles.
- If you prefer pulling Docker Hub images instead, update `compose.yaml` services to use `image:` instead of `build:`.
- Default Ansible user is `ansible` created via cloud-init. It uses your local `~/.ssh/id_rsa.pub` for auth.
