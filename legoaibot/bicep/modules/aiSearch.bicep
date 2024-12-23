param location string
param environment string
param projectName string
param logicAppPrincipalId string

resource searchService 'Microsoft.Search/searchServices@2024-06-01-preview' = {
  name: '${projectName}-${environment}-search'
  location: location
  sku: {
    name: 'standard'
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    replicaCount: 1
    publicNetworkAccess: 'enabled'
    partitionCount: 1
    disableLocalAuth: false
    authOptions: {
        aadOrApiKey: {
            aadAuthFailureMode: 'http401WithBearerChallenge'
        }
    }
    disabledDataExfiltrationOptions: []
  }
}

resource aiSearchContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(searchService.name, logicAppPrincipalId, 'b24988ac-6180-42a0-ab88-20f7382dd24c') // Contributor role ID
  scope: searchService
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b24988ac-6180-42a0-ab88-20f7382dd24c') // Contributor role ID
    principalId: logicAppPrincipalId
  }
}


output id string = searchService.id
