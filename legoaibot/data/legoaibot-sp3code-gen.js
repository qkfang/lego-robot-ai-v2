require('dotenv').config();
const fs = require('fs');

async function main() {
    // Read data from lego-sp-api.json
    const data = fs.readFileSync('./legoaibot-sp3code-raw.json', 'utf8');
    const specJson = JSON.parse(data);

    const newJsonList = [];
    specJson.forEach(code => {
        const newJsonObject = {
            Python_Code_Id: code.Python_Code_Id,
            Python_Code_Title: code.Python_Code_Title,
            Python_Code: code.Python_Code,
        };
        newJsonList.push(newJsonObject);
    });

     newJsonList.forEach((item, index) => {
         const fileName = `./legoaibot-sp3code-data/sp3code_${item.Python_Code_Id}.json`;
         fs.writeFileSync(fileName, JSON.stringify(item, null, 2), 'utf8');
         console.log(`File written: ${fileName}`);
     });

}

main().catch(console.error);