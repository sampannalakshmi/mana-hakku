# Mana Hakku Backend (foundation)

This is an early FastAPI backend for the Mana Hakku project. It currently has one
health-check endpoint. It is **not production-ready**, uses **demo data only**, and
does **not** yet store any student or scholarship data.

Do not enter Aadhaar numbers or other sensitive identity documents anywhere in this
project.

## 1. Requirements

- Windows with Python 3.13 or 3.14 installed (check with `py -0`).

## 2. Set up (run these in PowerShell)

```powershell
cd C:\Users\sampa\Downloads\Manna-Hakku\backend
py -3.14 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

If PowerShell says scripts are disabled when you activate the environment, run this
once and try again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## 3. Configure

Open `.env` in a text editor. Leave `DATABASE_URL` empty for now. Only add a
Supabase connection string there when you are ready, and never share or commit it.

## 4. Start the backend

```powershell
cd C:\Users\sampa\Downloads\Manna-Hakku\backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 5. Test the health check

With the server running, open a second PowerShell window and run:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

Expected result: `status` is `ok`, `database_configured` is `False`.

You can also open http://127.0.0.1:8000/api/health in a browser, or open
http://127.0.0.1:8000/docs for the interactive API page.

## 6. Stop the server

Press `Ctrl+C` in the server window.

## Notes

- The frontend files in the parent folder are not changed by this backend.
- Scholarship records in the frontend are demo entries and are not verified.
