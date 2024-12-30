param location string
param projectName string
param environment string
param mongoDbUserName string
param mongoDbPassword string


/* *************************************************************** */
/* Azure Cosmos DB for MongoDB vCore */
/* *************************************************************** */
resource mongoCluster 'Microsoft.DocumentDB/mongoClusters@2023-03-01-preview' = {
  name: '${projectName}-${environment}-mongo'
  location: location
  properties: {
    administratorLogin: mongoDbUserName
    administratorLoginPassword: mongoDbPassword
    serverVersion: '5.0'
    nodeGroupSpecs: [
      {
        kind: 'Shard'
        sku: 'M25'
        diskSizeGB: 128
        enableHa: false
        nodeCount: 1
      }
    ]
  }
}

resource mongoFirewallRulesAllowAzure 'Microsoft.DocumentDB/mongoClusters/firewallRules@2023-03-01-preview' = {
  parent: mongoCluster
  name: 'allowAzure'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource mongoFirewallRulesAllowAll 'Microsoft.DocumentDB/mongoClusters/firewallRules@2023-03-01-preview' = {
  parent: mongoCluster
  name: 'allowAll'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '255.255.255.255'
  }
}
