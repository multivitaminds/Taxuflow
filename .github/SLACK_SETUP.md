# Slack Notifications Setup Guide

This guide will help you set up Slack notifications for your Taxu landing page project.

## Prerequisites

- Admin access to your Slack workspace
- Admin access to your GitHub repository

## Step 1: Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Enter app name: `Taxu CI/CD Notifications`
5. Select your workspace
6. Click **"Create App"**

## Step 2: Enable Incoming Webhooks

1. In your app settings, click **"Incoming Webhooks"** in the left sidebar
2. Toggle **"Activate Incoming Webhooks"** to **On**
3. Click **"Add New Webhook to Workspace"**
4. Select the channel where you want notifications (e.g., `#taxu-deployments`)
5. Click **"Allow"**
6. Copy the **Webhook URL** (it looks like `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX`)

## Step 3: Add Webhook to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `SLACK_WEBHOOK_URL`
5. Value: Paste the webhook URL from Step 2
6. Click **"Add secret"**

## Step 4: Configure Vercel Slack Integration (Optional)

For Vercel deployment notifications:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Taxu project
3. Go to **Settings** → **Integrations**
4. Search for **"Slack"**
5. Click **"Add Integration"**
6. Follow the prompts to connect your Slack workspace
7. Select the channel for deployment notifications

## Notification Types

Your project will now send Slack notifications for:

### GitHub Actions Notifications
- ✅ **CI Success/Failure** - When linting and type checking pass or fail
- 🚀 **Production Deployments** - When code is pushed to main branch
- 📝 **Pull Requests** - When PRs are opened, updated, or merged
- 🔄 **Workflow Status** - When any workflow completes

### Vercel Notifications (if configured)
- 🎉 **Successful Deployments** - When preview or production deploys succeed
- ❌ **Failed Deployments** - When deployments fail
- 🔍 **Build Logs** - Links to build logs for debugging

## Customization

### Change Notification Channel

To send notifications to a different channel:
1. Go back to your Slack app settings
2. Add a new webhook for the desired channel
3. Update the `SLACK_WEBHOOK_URL` secret in GitHub

### Customize Notification Content

Edit the workflow files in `.github/workflows/` to customize:
- Message text and formatting
- Which events trigger notifications
- Additional information to include

### Disable Specific Notifications

To disable certain notifications, edit `.github/workflows/slack-notifications.yml`:
- Comment out or remove the job you don't want
- Modify the `if` conditions to filter events

## Testing

To test your Slack notifications:

1. **Test PR Notifications**: Create a test pull request
2. **Test CI Notifications**: Push code that triggers the CI workflow
3. **Test Deployment Notifications**: Merge a PR to main branch

## Troubleshooting

### Notifications Not Appearing

1. Verify the webhook URL is correct in GitHub secrets
2. Check that the Slack app has permission to post in the channel
3. Review GitHub Actions logs for error messages
4. Ensure the workflow files are in the correct location (`.github/workflows/`)

### Webhook URL Expired

If your webhook stops working:
1. Generate a new webhook URL in Slack
2. Update the `SLACK_WEBHOOK_URL` secret in GitHub
3. Test with a new commit or PR

## Support

For issues with:
- **Slack integration**: Check [Slack API documentation](https://api.slack.com/messaging/webhooks)
- **GitHub Actions**: Check [GitHub Actions documentation](https://docs.github.com/en/actions)
- **Vercel integration**: Check [Vercel Slack integration docs](https://vercel.com/integrations/slack)
