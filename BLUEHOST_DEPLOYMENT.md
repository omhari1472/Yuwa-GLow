# Bluehost Shared Hosting Deployment Guide

## Overview
- **Frontend**: Static HTML files → `public_html/`
- **Backend**: Laravel API → `public_html/api/`

---

## Step 1: Create MySQL Database on Bluehost

1. Log in to your Bluehost cPanel
2. Go to **Databases** → **MySQL Databases**
3. Create a new database (e.g., `yuvaglow_db`)
4. Create a new MySQL user with a strong password
5. Add the user to the database with **ALL PRIVILEGES**
6. Note down:
   - Database name: `yourusername_yuvaglow_db`
   - Username: `yourusername_dbuser`
   - Password: `your_password`

---

## Step 2: Prepare Backend for Upload

### 2.1 Update `.env.production` with your Bluehost MySQL credentials

Edit `backend/.env.production`:
```
DB_DATABASE=yourusername_yuvaglow_db
DB_USERNAME=yourusername_dbuser
DB_PASSWORD=your_mysql_password
```

### 2.2 Remove development files before upload

Delete these from the backend folder before uploading:
- `.env` (the local development one)
- `database/database.sqlite`
- `storage/logs/*.log`

---

## Step 3: Upload Files via File Manager or FTP

### 3.1 Upload Frontend Files

Upload **everything inside `frontend/`** to `public_html/`:
```
public_html/
├── index.html
├── about.html
├── contact.html
├── products.html
├── blog.html
├── career.html
├── partners.html
├── gallery.html
├── privacy-policy.html
├── terms.html
├── css/
├── js/
├── assets/
└── admin/
```

### 3.2 Upload Backend (Laravel API)

Upload **everything inside `backend/`** to `public_html/api/`:
```
public_html/api/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/
├── resources/
├── routes/
├── storage/
├── vendor/
├── artisan
├── composer.json
└── .env.production → rename to .env
```

**Important**: After uploading, rename `.env.production` to `.env`

---

## Step 4: Configure Laravel's Public Directory

Bluehost will serve from `public_html/api/` but Laravel expects requests at `public_html/api/public/`.

### Option A: Using .htaccess (Recommended)

Create `public_html/api/.htaccess`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### Option B: Move public contents (Alternative)

1. Move everything from `api/public/` to `api/`
2. Update `api/index.php` paths accordingly

---

## Step 5: Set Folder Permissions

Via cPanel File Manager or SSH, set permissions:

```bash
# Storage and cache must be writable
chmod -R 775 public_html/api/storage
chmod -R 775 public_html/api/bootstrap/cache

# Create storage link (run via SSH or Bluehost terminal)
cd public_html/api
php artisan storage:link
```

If you don't have SSH access, create the symlink manually:
1. In File Manager, go to `public_html/api/public/`
2. Create a symbolic link named `storage` pointing to `../storage/app/public`

---

## Step 6: Run Database Migrations

### Via SSH (if available):
```bash
cd public_html/api
php artisan migrate --force
php artisan db:seed --force  # if you have seeders
```

### Via Bluehost Cron Job (alternative):
1. Go to cPanel → **Cron Jobs**
2. Add a one-time job:
   ```
   cd ~/public_html/api && php artisan migrate --force
   ```
3. Delete the cron job after it runs

### Via Web Route (emergency option):
Temporarily add this to `routes/web.php`:
```php
Route::get('/setup-db', function() {
    Artisan::call('migrate', ['--force' => true]);
    return 'Migrations complete!';
});
```
Visit `https://yuvaglow.com/api/setup-db` once, then **remove the route**.

---

## Step 7: Create Admin User

Via SSH or by temporarily adding a seeder route:

```bash
cd public_html/api
php artisan tinker
```

Then run:
```php
App\Models\AdminUser::create([
    'name' => 'Admin',
    'email' => 'admin@yuvaglow.com',
    'password' => bcrypt('your_secure_password')
]);
```

---

## Step 8: Configure CORS (if needed)

If you get CORS errors, check `config/cors.php` allows your domain:
```php
'allowed_origins' => ['https://yuvaglow.com', 'https://www.yuvaglow.com'],
```

---

## Step 9: SSL Certificate

1. In Bluehost cPanel, go to **Security** → **SSL/TLS**
2. Enable Free SSL for your domain
3. Force HTTPS redirect in `public_html/.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Final Directory Structure

```
public_html/
├── .htaccess              (force HTTPS)
├── index.html             (homepage)
├── about.html
├── contact.html
├── products.html
├── ... (other HTML files)
├── css/
├── js/
├── assets/
├── admin/
└── api/                   (Laravel backend)
    ├── .htaccess          (redirect to public/)
    ├── .env               (production config)
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── public/
    │   ├── .htaccess
    │   ├── index.php
    │   └── storage -> ../storage/app/public
    ├── routes/
    ├── storage/
    └── vendor/
```

---

## Testing Checklist

- [ ] Homepage loads: `https://yuvaglow.com`
- [ ] API responds: `https://yuvaglow.com/api/api/products/active`
- [ ] Admin panel loads: `https://yuvaglow.com/admin`
- [ ] Admin login works
- [ ] Image uploads work
- [ ] Contact form submits
- [ ] Partner application form works

---

## Troubleshooting

### 500 Internal Server Error
- Check `storage/logs/laravel.log` for errors
- Verify file permissions (775 for storage)
- Ensure `.env` file exists with correct DB credentials

### CORS Errors
- Update `config/cors.php` with your domain
- Clear config cache: `php artisan config:clear`

### Images Not Loading
- Run `php artisan storage:link`
- Check storage folder permissions

### Database Connection Error
- Verify MySQL credentials in `.env`
- Ensure database user has all privileges
- On Bluehost, database name format is usually `username_dbname`
