require('dotenv').config();
const fs = require('fs');

async function main() {
    // Read data from lego-sp-api.json
    const data = fs.readFileSync('./legoaibot-sp3api-raw.json', 'utf8');
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
        const fileName = `./legoaibot-sp3api-data/sp3api_${item.Module_Name}_${item.Function.Function_Name}.json`;
        fs.writeFileSync(fileName, JSON.stringify(item, null, 2), 'utf8');
        console.log(`File written: ${fileName}`);
    });

}


main().catch(console.error);