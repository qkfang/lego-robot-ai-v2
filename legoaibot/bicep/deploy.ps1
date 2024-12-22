# Variables
$resourceGroupName = "rg-legoaibot"
$templateFile = "main.bicep"
$parameterFile = "main.parameters.json"

# Login to Azure
# az login

# Set the subscription (optional)
# az account set --subscription "c3a777c7-afcb-4fd8-84f9-096225a00f84"

# Create resource group (if it doesn't exist)
# az group create --name $resourceGroupName --location "eastus"

# Deploy the Bicep template
az deployment group create --resource-group $resourceGroupName --template-file $templateFile --parameters $parameterFile


