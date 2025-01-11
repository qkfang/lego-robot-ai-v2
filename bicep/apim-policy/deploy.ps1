
az apim api policy create-or-update --resource-group rg-legoaibot --service-name legoaibot-prd-apim --api-id legoaibot-api --policy-id 667bd26116d86ad3425d6f8a --xml-content @legoaibot/bicep/api/chat.xml

az apim api policy create-or-update --resource-group rg-legoaibot --service-name legoaibot-prd-apim --api-id legoaibot-api --policy-id 667bd26116d86ad3425d6f8b --xml-content @legoaibot/bicep/api/image.xml

az apim api policy create-or-update --resource-group rg-legoaibot --service-name legoaibot-prd-apim --api-id legoaibot-api --policy-id 667bdfea4ba23e89dcc71f14 --xml-content @legoaibot/bicep/api/translate.xml

az apim api policy create-or-update --resource-group rg-legoaibot --service-name legoaibot-prd-apim --api-id legoaibot-api --policy-id 667bd306b624010834cd55d0 --xml-content @legoaibot/bicep/api/vision.xml

az apim api policy create-or-update --resource-group rg-legoaibot --service-name legoaibot-prd-apim --api-id legoaibot-api --policy-id 667bd32c619e54f3512c2aac --xml-content @legoaibot/bicep/api/dalle.xml
