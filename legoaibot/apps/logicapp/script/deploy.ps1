# Set variables
$resourceGroupName = "YourResourceGroupName"
$location = "YourLocation"
$templateFile = "path/to/template.json"
$parametersFile = "path/to/parameters.json"

# Login to Azure
az login

# Create resource group if it doesn't exist
$resourceGroup = az group show --name $resourceGroupName --output json
if (-not $resourceGroup) {
    az group create --name $resourceGroupName --location $location
}

# Deploy the Logic App
az deployment group create `
    --resource-group $resourceGroupName `
    --template-file $templateFile `
    --parameters @$parametersFile

Write-Output "Deployment completed successfully."