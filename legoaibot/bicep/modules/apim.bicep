// modules/apim.bicep
param location string
param projectName string
param environment string

resource apim 'Microsoft.ApiManagement/service@2024-06-01-preview' = {
  name: '${projectName}-${environment}-apim'
  location: location
  sku: {
    name: 'Consumption'
    capacity: 0
  }
  properties: {
    publisherEmail: 'admin@contoso.com'
    publisherName: 'Contoso'
  }
}

resource api 'Microsoft.ApiManagement/service/apis@2023-09-01-preview' = {
  parent: apim
  name: 'legoaibot-api'
  properties: {
    displayName: 'legoaibot-api'
    path: 'legoaibot-api'
    value: loadTextContent('legoaibot-api.json')
    format: 'openapi+json'
    protocols: [
      'https'
    ]
  }
}
