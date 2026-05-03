# Node.js Full Stack Deployment Guide
Steps to deploy a Node.js/React app to an AWS EC2 instance using PM2, NGINX as a reverse proxy, and TLS/SSL certificates from LetsEncrypt.

## 1. Create Free AWS Account
Create a free AWS Account at https://aws.amazon.com/

## 2. Create and Launch an EC2 instance and SSH into machine
I recommend creating a `t2.micro` (free tier) or `t2.medium` ubuntu machine (Ubuntu 24.04 LTS) for this demo.

Connect to your server via SSH:
```bash
ssh -i "your-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

## 3. Install Node and NPM (Node 22)
We will install Node.js version 22 directly from the NodeSource repository.
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```
Verify installation:
```bash
node --version
```

## 4. Clone your project from Github
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

## 5. Install dependencies and test app
Since the Express backend serves the React frontend, build the frontend first:
```bash
# Frontend build
cd frontend
npm install
npm run build 

# Backend setup
cd ../backend
npm install
cp .env.example .env
```
*(Remember to open `.env` using nano and add your `MONGODB_URI` string)*

Install PM2 globally and start the Node server:
```bash
sudo npm i pm2 -g
pm2 start server.js --name "ideavault"
```

**Other helpful PM2 commands:**
```bash
pm2 show ideavault
pm2 status
pm2 restart ideavault
pm2 stop ideavault
pm2 logs      # Show log stream
pm2 flush     # Clear logs
```

To make sure the app starts when the Ubuntu machine reboots:
```bash
pm2 startup ubuntu
# Follow the on-screen instructions, paste the generated command, then run:
pm2 save
```

## 6. Setup Firewall / EC2 Security Group
Go to your AWS Console > EC2 Dashboard > Click your instance > Security tab > Click the Security Group.
Add the following Inbound Rules from the Source `0.0.0.0/0`:
* **SSH (Port 22)**
* **HTTP (Port 80)**
* **HTTPS (Port 443)**

## 7. Install NGINX and configure
```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/default
```

Delete the default content and add the following to the location part of the server block. Make sure to replace `yourdomain.com` with your actual domain:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000; # The port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Check NGINX config syntax:
```bash
sudo nginx -t
```

Restart NGINX to apply changes:
```bash
sudo systemctl reload nginx
```

## 8. Add TLS/SSL with LetsEncrypt
*(You must have pointed an A-Record from your DNS provider to your EC2 IP before doing this)*

Install Certbot:
```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

Generate the TLS/SSL certificates (Certbot will automatically configure your NGINX files to redirect HTTP to HTTPS):
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Only valid for 90 days. Test the automatic renewal process with:
```bash
sudo certbot renew --dry-run
```
