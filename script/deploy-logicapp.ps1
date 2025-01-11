# az login

# Set the variables for your deployment
$resourceGroupName = "rg-legoaibot"
$appServiceName = "legoaibot-prd-logicapp"
$sourceFolderPath = "../apps/logicapp"
$logicAppPackagePath = "logicapp.zip"

# Zip the Logic App package
Compress-Archive -Path $sourceFolderPath -DestinationPath $logicAppPackagePath -Force

# Deploy the Logic App package
az webapp deployment source config-zip --resource-group $resourceGroupName --name $appServiceName --src $logicAppPackagePath