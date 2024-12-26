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
    name: 'GlobalStandard'
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
      name: 'text-embedding-3-small'
      version: '1'
      format: 'OpenAI' 
    }
  }
  dependsOn: [
    gpt4Deployment
  ]
}

resource dalle3 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAiAccount
  name: 'dalle3'
  sku: {
    name: 'Standard'
    capacity: 1
  }
  properties: {
    model: {
      name: 'dall-e-3'
      format: 'OpenAI' 
    }
  }
}

resource gpt4oRT 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAiAccount
  name: 'gpt-4o-rt'
  sku: {
    name: 'GlobalStandard'
    capacity: 5
  }
  properties: {
    model: {
      name: 'gpt-4o-realtime-preview'
      version: '2024-10-01'
      format: 'OpenAI' 
    }
  }
  dependsOn: [
    embeddingDeployment
  ]
}


resource openAiContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(openAiAccount.name, logicAppPrincipalId, 'a001fd3d-188f-4b5d-821b-7da978bf7442') // Cognitive Services OpenAI Contributor role ID
  scope: openAiAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'a001fd3d-188f-4b5d-821b-7da978bf7442') 
    principalId: logicAppPrincipalId
  }
}


output id string = openAiAccount.id
