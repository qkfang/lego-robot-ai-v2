$resourceGroupName = "rg-legoaibot"
$storageAccountName = "legoaibotprdsa"
$containerName = "legoaibot-sp3snippet"
$filePath = "./legoaibot-sp3snippet-data/sp3snippet_code_1.json"
$blobName = "sp3snippet_code_1.json"

$storageAccountKey = az storage account keys list --resource-group $resourceGroupName --account-name $storageAccountName --query "[0].value" --output tsv
az storage blob upload --account-name $storageAccountName --account-key $storageAccountKey --container-name $containerName --name $blobName --file $filePath --overwrite



