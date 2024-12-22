param location string
param projectName string
param environment string
param storageAccountConnectionString string

resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: '${projectName}-${environment}-asp'
  location: location
  sku: {
    name: 'WS1'
    tier: 'WorkflowStandard'
  }
  properties: {
    reserved: true
  }
}


resource logicApp 'Microsoft.Web/sites@2024-04-01' = {
  name: '${projectName}-${environment}-logicapp'
  location: location
  kind: 'functionapp,workflowapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        { name: 'APP_KIND', value: 'workflowApp' }
        {
          name: 'AzureWebJobsStorage'
          value: storageAccountConnectionString
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~22'
        }
        { name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING', value: storageAccountConnectionString }
        { name: 'AzureFunctionsJobHost__extensionBundle__id', value: 'Microsoft.Azure.Functions.ExtensionBundle.Workflows' }
        { name: 'AzureFunctionsJobHost__extensionBundle__version', value: '[1.*, 2.0.0)' }
        { name: 'WEBSITE_CONTENTSHARE', value: toLower('${projectName}${environment}') }
      ]
    }
  }
  dependsOn: [
    appServicePlan
  ]
}

output principalId string = logicApp.identity.principalId
