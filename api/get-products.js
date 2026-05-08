import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const productsDir = path.join(process.cwd(), '_products');
    
    if (!fs.existsSync(productsDir)) {
      return res.status(200).json([]);
    }

    const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
    const products = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(productsDir, file), 'utf8');
        const product = JSON.parse(content);
        product._filename = file.replace('.json', '');
        // Убираем __ которые добавляет Pages CMS
        if (product.wb_link) {
          product.wb_link = product.wb_link.replace(/__/g, '').trim();
        }
        products.push(product);
      } catch(e) {}
    }

    res.status(200).json(products);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
