$resourceGroupName = "rg-legoaibot"
$storageAccountName = "legoaibotprdsa"
$containerName = "legoaibot-sp3api"
$filePath = "./legoaibot-sp3api-data/sp3api_App_app.display Constants.json"
$blobName = "sp3api_App_app.display Constants.json"

$storageAccountKey = az storage account keys list --resource-group $resourceGroupName --account-name $storageAccountName --query "[0].value" --output tsv
az storage blob upload --account-name $storageAccountName --account-key $storageAccountKey --container-name $containerName --name $blobName --file $filePath --overwrite



