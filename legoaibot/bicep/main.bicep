param location string = resourceGroup().location
param projectName string = 'legoaibot'
param environment string = 'dev'

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${projectName}-appinsights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

// deploy azure ai search
module aiSearch 'modules/aiSearch.bicep' = {
  name: 'aiSearch'
  params: {
    location: location
    environment: environment
    projectName: projectName
    logicAppPrincipalId: logicApp.outputs.principalId
  }
}

// deploy azure openai service
module openAi 'modules/openAi.bicep' = {
  name: 'openAi'
  params: {
    location: location
    environment: environment
    projectName: projectName
    logicAppPrincipalId: logicApp.outputs.principalId
  }
}


// deploy storage account
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: '${projectName}${environment}sa'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}


// deploy azure logic app
module logicApp 'modules/logicApp.bicep' = {
  name: 'logicApp'
  params: {
    location: location
    environment: environment
    projectName: projectName
    storageAccountName: storageAccount.name
    storageAccountConnectionString: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=core.windows.net;AccountKey=${listKeys(storageAccount.id, '2021-04-01').keys[0].value}'
    appInsightsId: appInsights.id
  }
}


// Assign Contributor role to Logic App for AI Search, OpenAI, and Storage Account
resource logicAppContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(subscription().id, logicApp.name, 'ba92f5b4-2d11-453d-a403-e96b0029c9fe') // Contributor role ID
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe') // Contributor role ID
    principalId: logicApp.outputs.principalId
  }
}
