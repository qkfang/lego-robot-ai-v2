param location string
param environment string
param projectName string

resource searchService 'Microsoft.Search/searchServices@2020-08-01' = {
  name: '${projectName}-${environment}-search'
  location: location
  sku: {
    name: 'standard'
  }
  properties: {
    replicaCount: 1
    publicNetworkAccess: 'enabled'
    partitionCount: 1
  }
}
