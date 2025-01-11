param subIdShared_Search string
param rgName string

resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: '${projectName}-${environment}-win-asp'
  scope: resourceGroup(subIdShared_Search, rgName)
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
