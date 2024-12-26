# az login

# Set the variables for your deployment
$resourceGroupName = "rg-legoaibot"
$appServiceName = "legoaibot-prd-web"
$sourceFolderPath = "../apps/web"
$appPackagePath = "webapp.zip"


# Navigate to the source folder
Push-Location $sourceFolderPath

# Install Node.js dependencies
npm install

# Build the project (if applicable)
npm run build

# Navigate back to the script directory
Pop-Location


# Zip the Logic App package
Compress-Archive -Path $sourceFolderPath -DestinationPath $appPackagePath -Force

# Deploy the Logic App package
az webapp deployment source config-zip --resource-group $resourceGroupName --name $appServiceName --src $appPackagePath

