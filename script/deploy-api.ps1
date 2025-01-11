
az login
az account set --subscription c3a777c7-afcb-4fd8-84f9-096225a00f84
az extension add --name containerapp --upgrade


docker build --pull --rm -f "DOCKERFILE" -t legoaibot:latest "."
docker tag legoaibot:latest legoaibotprdacr.azurecr.io/legoaibot:v2
docker login legoaibotprdacr.azurecr.io -u legoaibotprdacr -p xxxx
docker push legoaibotprdacr.azurecr.io/legoaibot:v2

az containerapp up --name legoaibot-prd-api --image legoaibotprdacr.azurecr.io/legoaibot:v2 --resource-group rg-legoaibot --environment legorobot-containerappenv --ingress external
az containerapp update --name legoaibot-prd-api --image legoaibotprdacr.azurecr.io/legoaibot:v2 --resource-group rg-legoaibot 

