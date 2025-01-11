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


// var indexProperties = json(loadTextContent('legoaibot-index-v1.json'))

// resource legoaibotIndex 'Microsoft.Search/searchServices/indexes@2024-06-01-Preview' = {
//   name: 'legoaibot-index-v1'
//   parent: searchService
//   properties: {
//     fields: indexProperties.fields
//     vectorSearch: indexProperties.vectorSearch
//   }
// }


resource aiSearchContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(searchService.name, logicAppPrincipalId, '8ebe5a00-799e-43f5-93ac-243d3dce84a7') // Search Index Data Contributor
  scope: searchService
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '8ebe5a00-799e-43f5-93ac-243d3dce84a7') // Search Index Data Contributor
    principalId: logicAppPrincipalId
  }
}


output id string = searchService.id
