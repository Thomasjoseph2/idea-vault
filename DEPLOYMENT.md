

## 1. Create Free AWS Account

Create a free account at: [https://aws.amazon.com/](https://aws.amazon.com/)
Use Amazon Web Services to access Amazon EC2.

---

## 2. Create and Launch an EC2 Instance

* Choose:

  * OS → **Ubuntu 24.04 LTS**
  * Instance → `t3.micro` (free tier) or `t3.small`
* Create/download key pair (`.pem`)
* Allow inbound rules:

  * SSH (22)
  * HTTP (80)
  * HTTPS (443)

---

## 3. Connect to EC2 via SSH

```bash
ssh -i "your-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

---

## 4. Update System & Install Git

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git -y
```

---

## 5. Install Node.js (LTS Version Recommended)

Install Node.js **24 LTS** (stable for production):

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

---

## 6. Clone Your Project

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

## 7. Install Dependencies & Build App

### Frontend (React)

```bash
cd frontend
npm install
npm run build
```

### Backend (Express)

```bash
cd ../backend
npm install
cp .env.example .env
nano .env
```

👉 Add your environment variables like:

```
MONGODB_URI=your_connection_string
```

⚠️ Never commit `.env` to GitHub.

---

## 8. Run App with PM2

Install PM2 globally:

```bash
sudo npm install -g pm2
```

Start your server:

```bash
pm2 start server.js --name "app-name"
```

Useful commands:

```bash
pm2 status
pm2 logs
pm2 restart app-name
pm2 stop app-name
pm2 delete app-name
```

Enable auto-start on reboot:

```bash
pm2 startup
# Run the generated command
pm2 save
```

---

## 9. Configure EC2 Security Group

Ensure inbound rules allow:

* SSH (22)
* HTTP (80)
* HTTPS (443)

(Optional) Allow custom app port if testing (e.g., 5000)

---

## 10. Install and Configure Nginx

Install:

```bash
sudo apt install -y nginx
```

Edit config:

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace with:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Test config:

```bash
sudo nginx -t
```

Reload:

```bash
sudo systemctl reload nginx
```

---

## 11. Setup Domain (DNS)

In your domain provider:

* Add A Record:

```
Type: A
Value: <EC2_PUBLIC_IP>
```

---

## 12. Enable HTTPS with Let’s Encrypt

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Generate SSL:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Test renewal:

```bash
sudo certbot renew --dry-run
```

---

## ✅ Final Result

* Your app runs via **PM2**
* Traffic handled by **Nginx**
* Secure HTTPS enabled
* Auto-restart on crash/reboot

---

## 🔥 Common Issues (Add this to your video)

* App not opening → check Security Group ports
* Nginx error → run `sudo nginx -t`
* App crash → check `pm2 logs`
* Wrong port → match Node app & Nginx config

---

## 🎯 Pro Tips

* Always use **LTS Node.js** in production
* Use PM2 for reliability
* Never expose raw app ports publicly
* Use Nginx for clean routing and security



---

## 13. Automate Deployments with GitHub Actions (CI/CD)

We have set up an automated CI/CD pipeline using GitHub Actions! Every time you push code to the main branch, GitHub will automatically:
1. **Run your automated tests** (to ensure the code isn't broken).
2. **Securely SSH into your EC2 server**.
3. **Pull the latest code, build the frontend, and restart PM2**.

### Setup Instructions

For the pipeline to securely access your AWS server, you must add your server's credentials to your GitHub Repository Secrets.

1. Go to your repository on GitHub.
2. Click **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret** and add the following exactly:

* **Name:** HOST
  * **Secret:** Your EC2 Public IP address (e.g., 3.7.106.209)
* **Name:** USERNAME
  * **Secret:** ubuntu
* **Name:** KEY
  * **Secret:** Open your .pem file in a text editor and paste the ENTIRE contents here (including the -----BEGIN RSA PRIVATE KEY----- lines).

Once saved, simply push a code change to the main branch and click the **Actions** tab in GitHub to watch the magic happen!
