

# Define variables
subscriptionId="c3a777c7-afcb-4fd8-84f9-096225a00f84"
resourceGroupName="rg-legoaibot"
location="eastus"
serviceName="legoaibot-prd-apim"
accessToken="Bearer xxxxx"
contentType="application/json"
policyValue=$(cat chat.xml)
# az account get-access-token --resource https://management.azure.com/

curl -X PUT "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.ApiManagement/service/$serviceName/apis/legoaibot-api/operations/667bd26116d86ad3425d6f8a/policies/policy?api-version=2023-09-01-preview" \
     -H "Authorization: $accessToken" \
     -d @"{ \
  'properties': { \
    'format': 'xml', \
    'value': '<policies> <inbound /> <backend>    <forward-request />  </backend>  <outbound /></policies>' \
  } \
}
"

