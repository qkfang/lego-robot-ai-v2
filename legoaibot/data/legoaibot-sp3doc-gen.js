require('dotenv').config();
const fs = require('fs');

async function main() {
    // Read data from lego-sp-api.json
    const data = fs.readFileSync('./legoaibot-sp3doc-raw.json', 'utf8');
    const specJson = JSON.parse(data);

    const newJsonList = [];
    specJson.forEach(code => {
        const newJsonObject = {
            doc_id: code.doc_id,
            doc_title: code.doc_title,
            doc_text: code.doc_text,
        };
        newJsonList.push(newJsonObject);
    });

     newJsonList.forEach((item, index) => {
         const fileName = `./legoaibot-sp3doc-data/sp3doc_${item.doc_id}.json`;
         fs.writeFileSync(fileName, JSON.stringify(item, null, 2), 'utf8');
         console.log(`File written: ${fileName}`);
     });

}

main().catch(console.error);