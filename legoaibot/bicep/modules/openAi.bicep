param location string
param environment string
param projectName string
param logicAppPrincipalId string

resource openAiAccount 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: '${projectName}-${environment}-openai'
  location: location
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    customSubDomainName: '${projectName}-${environment}-openai'
    publicNetworkAccess: 'Enabled'
  }
}


resource gpt4Deployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAiAccount
  name: 'gpt-4o'
  sku: {
    name: 'Standard'
    capacity: 120
  }
  properties: {
    model: {
      name: 'gpt-4o'
      format: 'OpenAI' 
    }
  }
}

resource embeddingDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAiAccount
  name: 'embedding'
  sku: {
    name: 'Standard'
    capacity: 120
  }
  properties: {
    model: {
      name: 'text-embedding-ada-002'
      version: '2'
      format: 'OpenAI' 
    }
  }
  dependsOn: [
    gpt4Deployment
  ]
}


resource openAiContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(openAiAccount.name, logicAppPrincipalId, 'b05e14b8-7c5a-4b66-9b30-1b1a7f2b5cbc') // Cognitive Services OpenAI Contributor role ID
  scope: openAiAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b05e14b8-7c5a-4b66-9b30-1b1a7f2b5cbc') 
    principalId: logicAppPrincipalId
  }
}


output id string = openAiAccount.id
