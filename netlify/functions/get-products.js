const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const productsDir = path.join(process.cwd(), '_products');
    
    if (!fs.existsSync(productsDir)) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify([])
      };
    }

    const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
    const products = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(productsDir, file), 'utf8');
        const product = JSON.parse(content);
        product._filename = file.replace('.json', '');
        products.push(product);
      } catch(e) {}
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(products)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
