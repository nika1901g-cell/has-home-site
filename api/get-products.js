import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const productsDir = path.join(process.cwd(), '_products');
    
    if (!fs.existsSync(productsDir)) {
      return res.status(200).json([]);
    }

    const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.json') || f.endsWith('.md'));
    const products = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(productsDir, file), 'utf8');
        let product = {};

        if (file.endsWith('.json')) {
          product = JSON.parse(content);
        } else {
          // Читаем .md файлы от Pages CMS
          const lines = content.split('\n');
          let inFrontmatter = false;
          for (const line of lines) {
            if (line.trim() === '---') { inFrontmatter = !inFrontmatter; continue; }
            if (inFrontmatter && line.includes(':')) {
              const [key, ...val] = line.split(':');
              const value = val.join(':').trim().replace(/^["']|["']$/g, '');
              const k = key.trim();
              if (k === 'price') product[k] = Number(value);
              else product[k] = value;
            }
          }
        }

        if (product.wb_link) {
          product.wb_link = product.wb_link.replace(/__/g, '').trim();
        }
        product._filename = file.replace(/\.(json|md)$/, '');
        if (product.title) products.push(product);
      } catch(e) {}
    }

    res.status(200).json(products);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
