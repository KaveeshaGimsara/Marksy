# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/60fcb7f7-86eb-4a3c-a285-16807acb8cc8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/60fcb7f7-86eb-4a3c-a285-16807acb8cc8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/60fcb7f7-86eb-4a3c-a285-16807acb8cc8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Push to GitHub (optional)

If you'd like to publish this project to GitHub under the name `Progress-Analyzer`, run the following in PowerShell (replace `<your-username>`):

```powershell
# Initialize git repo if needed
git init
git add .
git commit -m "Initial commit"

git branch -M main
# Add remote: replace with your GitHub repository URL
git remote add origin https://github.com/<your-username>/Progress-Analyzer.git

git push -u origin main
```

If you prefer the GitHub CLI, you can create and push in one command:

```powershell
gh auth login
gh repo create <your-username>/Progress-Analyzer --public --source=. --remote=origin --push
```

If you want me to run the push for you, install Git in the environment and provide the remote URL or give me permission to create the remote via the GitHub CLI.
