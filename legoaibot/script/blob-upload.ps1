# Define variables
$resourceGroupName = "rg-legoaibot"
$storageAccountName = "legoaibotprdsa"
$containerName = "legoaibotdoc"
$filePath = "../file/doc1.pdf"


$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$blobName = "doc1_$timestamp.pdf"


# Get the storage account key
$storageAccountKey = az storage account keys list --resource-group $resourceGroupName --account-name $storageAccountName --query "[0].value" --output tsv

# Upload the file
az storage blob upload --account-name $storageAccountName --account-key $storageAccountKey --container-name $containerName --name $blobName --file $filePath

Write-Output "File uploaded successfully to blob storage."

