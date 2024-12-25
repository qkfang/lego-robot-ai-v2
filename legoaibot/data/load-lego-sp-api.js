require('dotenv').config();
const fs = require('fs');
const { MongoClient } = require('mongodb');


async function main() {
    try {
        // legoapi

        // Read data from lego-sp-api.json
        const data = fs.readFileSync('./doc/lego-sp-api.json', 'utf8');
        const specJson = JSON.parse(data);
        
        const newJsonList = [];
        specJson.forEach(module => {
            module.SubModules.forEach(submodule => {
                submodule.Functions.forEach(func => {
                    const newJsonObject = {
                        Module_Name: module.Module_Name,
                        Module_Description: module.Module_Description,
                        SubModule_Name: submodule.SubModule_Name,
                        SubModule_Description: submodule.SubModule_Description,
                        Function_Name: func.Function_Name,
                        Function: func,
                    };
                    newJsonList.push(newJsonObject);
                });
            });

            module.Functions.forEach(func => {
                const newJsonObject = {
                    Module_Name: module.Module_Name,
                    Module_Description: module.Module_Description,
                    SubModule_Name: module.Module_Name,
                    SubModule_Description: module.Module_Description,
                    Function_Name: func.Function_Name,
                    Function: func,
                };
                newJsonList.push(newJsonObject);
            });
        });
        

        newJsonList.forEach((item, index) => {
            const fileName = `./docfile/lego_sp_api_${item.Module_Name}_${item.Function.Function_Name}.json`;
            fs.writeFileSync(fileName, JSON.stringify(item, null, 2), 'utf8');
            console.log(`File written: ${fileName}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        console.log('Disconnected from MongoDB');
    }
}


main().catch(console.error);