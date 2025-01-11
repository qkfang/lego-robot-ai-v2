$resourceGroupName = "rg-legoaibot"
$storageAccountName = "legoaibotprdsa"
$containerName = "legoaibot-sp3code"
$filePath = "./legoaibot-sp3code-data/sp3code_code_1.json"
$blobName = "sp3code_code_1.json"

$storageAccountKey = az storage account keys list --resource-group $resourceGroupName --account-name $storageAccountName --query "[0].value" --output tsv
az storage blob upload --account-name $storageAccountName --account-key $storageAccountKey --container-name $containerName --name $blobName --file $filePath --overwrite



