# Tracker

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

This project was created using `bun init` in bun v1.3.13. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Docker

Build and run the production stack on a machine with Docker:

```bash
cp .env.example .env
docker compose up -d --build
```

The app container runs the Bun/Hono backend and serves the built frontend. Caddy listens on ports `80` and `443` and proxies to the app.

## EC2 Deployment

1. Point DNS for `cost.ojrd.space` to your EC2 instance public IP with an `A` record.
2. Open inbound EC2 security group ports `22`, `80`, and `443`.
3. Install Docker Engine and the Docker Compose plugin on the EC2 instance.
4. Push this repo to GitHub with `main` as the deploy branch.
5. Add these GitHub repository secrets:
   - `EC2_HOST`: EC2 public IP or hostname
   - `EC2_USER`: SSH user, usually `ubuntu` for Ubuntu AMIs or `ec2-user` for Amazon Linux
   - `EC2_SSH_KEY`: private key that can SSH into the instance
   - `EC2_SSH_PORT`: optional, defaults to `22`
   - `EC2_APP_DIR`: optional, defaults to `$HOME/tracker`
6. Push to `main` or run the `Deploy` workflow manually.

On the first deploy, Caddy will request a TLS certificate for `cost.ojrd.space`. DNS must already point to the instance, and ports `80`/`443` must be reachable.

### Ubuntu EC2 Docker Setup

Run this once on an Ubuntu EC2 instance:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

Log out and SSH back in after adding your user to the `docker` group.
