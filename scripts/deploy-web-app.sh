#!/bin/bash

# Ensure environment variable is set and valid
if [ -z "$1" ]; then
    echo "Error: No environment specified. Please provide 'dev' or 'prod' as the first argument."
    exit 1
fi

if [[ "$1" != "dev" && "$1" != "prod" ]]; then
    echo "Error: Invalid environment '$1'. Only 'dev' or 'prod' are allowed."
    exit 1
fi

# Check for --backup flag
BACKUP=false
if [[ "$2" == "--backup" ]]; then
    BACKUP=true
fi

# Set environment variables
ENV=$1
if [[ "$ENV" == "prod" ]]; then
    BUCKET_NAME="makeitrealconsulting-chat"
    echo "Deploying to production bucket: $BUCKET_NAME"
    read -p "Press enter to continue - WARNING: This will deploy to the production bucket"
else
    BUCKET_NAME="makeitrealconsulting-chat"
    echo "Deploying to development bucket: $BUCKET_NAME"
    read -p "Press enter to continue"
fi

# Run build
echo "Running npx nuxi generate..."
npx nuxi generate
if [ $? -ne 0 ]; then
    echo "Error: npx nuxi generate failed. Aborting deployment."
    exit 1
fi

# Sync build folder to primary S3 bucket
echo "Syncing build folder to S3 bucket: $BUCKET_NAME"
aws s3 sync ./dist s3://$BUCKET_NAME --delete --profile cts

# Force-copy public assets into the S3 bucket
echo "Syncing public folder directly to S3..."
aws s3 sync ./public s3://$BUCKET_NAME --profile cts

if [ $? -ne 0 ]; then
    echo "Error: Failed to sync with primary S3 bucket. Aborting deployment."
    exit 1
fi


# Success message
echo "Deployment to $ENV environment completed successfully!"
exit 0
