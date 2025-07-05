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

# Set variables
ENVIRONMENT=$1
prefix="mir-chat"

# S3 for SAM deployment
BUCKET_NAME="makeitreal-chat-cicd"

# Define regular CloudFormation stacks
# Main network stack is one deployment, app resources get environment specific deployments
CF_STACK_ORDER=(
     "$prefix-s3:mir-chat-s3.yaml"\
    "$prefix-cloudfront-$ENVIRONMENT:mir-chat-cloudfront.yaml"
 )

# Define SAM stacks
SAM_STACK_ORDER=(

)

# Validate template using SAM
validate_template() {
    local TEMPLATE_FILE=$1
    echo "Validating template: $TEMPLATE_FILE"
    sam validate -t "$TEMPLATE_FILE" --lint
}

# Deploy CloudFormation stack
deploy_cf_stack() {
    local STACK_NAME=$1
    local TEMPLATE_FILE=$2

    echo "Deploying CloudFormation stack: $STACK_NAME with template: $TEMPLATE_FILE"
    aws cloudformation deploy \
        --template-file "$TEMPLATE_FILE" \
        --stack-name "$STACK_NAME" \
        --parameter-overrides Environment="$ENVIRONMENT" \
        --capabilities CAPABILITY_NAMED_IAM \
        --profile cts
}

deploy_sam_stack() {
    local STACK_NAME=$1
    local TEMPLATE_FILE=$2
    local BUCKET_KEY=$(basename "$TEMPLATE_FILE" .yaml | sed 's/\.yaml$//')

    echo "Building and deploying SAM stack: $STACK_NAME with template: $TEMPLATE_FILE"
    sam build -t "$TEMPLATE_FILE"
    sam deploy \
        --template-file .aws-sam/build/template.yaml \
        --stack-name "$STACK_NAME" \
        --s3-bucket "$BUCKET_NAME" \
        --s3-prefix "$BUCKET_KEY" \
        --parameter-overrides Environment="$ENVIRONMENT" \
        --capabilities CAPABILITY_NAMED_IAM \
        --resolve-image-repos \
        --no-fail-on-empty-changeset \
        --profile cts
}

# Validate all templates first
echo "Validating all templates..."
for STACK_ENTRY in "${CF_STACK_ORDER[@]}" "${SAM_STACK_ORDER[@]}"; do
    IFS=":" read -r STACK_NAME TEMPLATE_FILE <<< "$STACK_ENTRY"
    validate_template "$TEMPLATE_FILE"
done

# Click enter to continue
read -p "Press enter to continue with deployment"

# Deploy CloudFormation stacks
echo "Deploying CloudFormation stacks..."
for STACK_ENTRY in "${CF_STACK_ORDER[@]}"; do
    IFS=":" read -r STACK_NAME TEMPLATE_FILE <<< "$STACK_ENTRY"
    deploy_cf_stack "$STACK_NAME" "$TEMPLATE_FILE"
done

# Deploy SAM stacks
echo "Deploying SAM stacks..."
for STACK_ENTRY in "${SAM_STACK_ORDER[@]}"; do
    IFS=":" read -r STACK_NAME TEMPLATE_FILE <<< "$STACK_ENTRY"
    deploy_sam_stack "$STACK_NAME" "$TEMPLATE_FILE"
done