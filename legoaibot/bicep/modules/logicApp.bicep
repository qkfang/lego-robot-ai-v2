param location string
param projectName string
param environment string
param storageAccountConnectionString string
param appInsightsId string

resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: '${projectName}-${environment}-aspl'
  location: location
  sku: {
    name: 'WS1'
    tier: 'WorkflowStandard'
    size: 'WS1'
    family: 'WS'
  }
  kind: 'elastic'
  properties: {
    reserved: false
  }
}

var logicAppName = '${projectName}-${environment}-logicapp'
resource logicApp 'Microsoft.Web/sites@2024-04-01' = {
  name: logicAppName
  location: location
  kind: 'functionapp,workflowapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    publicNetworkAccess: 'Enabled'
    siteConfig: {
      appSettings: [
        { name: 'APP_KIND', value: 'workflowApp' }
        { name: 'AzureWebJobsStorage', value: storageAccountConnectionString}
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'dotnet' }
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~22' }
        { name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING', value: storageAccountConnectionString }
        {
          name: 'AzureFunctionsJobHost__extensionBundle__id'
          value: 'Microsoft.Azure.Functions.ExtensionBundle.Workflows'
        }
        { name: 'AzureFunctionsJobHost__extensionBundle__version', value: '[1.*, 2.0.0)' }
        { name: 'WEBSITE_CONTENTSHARE', value: toLower('${projectName}${environment}') }
        { name: 'openai_chat_deployment_id', value: '' }
        { name: 'openai_embedding_deployment_id', value: '' }
        { name: 'openai_api_key', value: '' }
        { name: 'openai_endpoint', value: '' }
        { name: 'aisearch_admin_key', value: '' }
        { name: 'aisearch_endpoint', value: '' }
        { name: 'tokenize_function_url', value: '' }
        { name: 'aisearch_searchServiceEndpoint', value: 'https://legoaibot-prd-search.search.windows.net' }
        { name: 'APPINSIGHTS_INSTRUMENTATIONKEY', value: appInsightsId }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: 'InstrumentationKey=${appInsightsId};IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/;' }
        { name: 'AzureBlob_connectionString', value: storageAccountConnectionString }
        { name: 'openai_openAIEndpoint', value: 'https://legoaibot-prd-openai.openai.azure.com' }
      ]
    }
  }
  dependsOn: [
    appServicePlan
  ]
}

output principalId string = logicApp.identity.principalId
