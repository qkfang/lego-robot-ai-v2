
$resourceGroupName = "rg-legoaibot"
$searchServiceName = "legoaibot-prd-search"
$apiKey = az search admin-key show --resource-group $resourceGroupName --service-name $searchServiceName --query "primaryKey" -o tsv
# $indexNames = @("legoaibot-flldoc", "legoaibot-sp3api", "legoaibot-sp3code", "legoaibot-sp3doc", "legoaibot-sp3snippet")
$indexNames = @("legoaibot-flldoc")

foreach ($indexName in $indexNames) {
    $requestUrl = "https://$searchServiceName.search.windows.net/indexes/$indexName/docs/index?api-version=2020-06-30"
    $requestBody = @{
        "value" = @(
            @{
                "@search.action" = "delete"
                "id" = "*"
            }
        )
    } | ConvertTo-Json

    # Send the request
    Invoke-RestMethod -Method Post -Uri $requestUrl -Headers @{ "Content-Type" = "application/json"; "api-key" = $apiKey } -Body $requestBody
}