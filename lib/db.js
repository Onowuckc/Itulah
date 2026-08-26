import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let dbInstance = null;
let dbError = null;

function getDbPath() {
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
  const sourcePath = path.resolve(process.cwd(), 'database.sqlite');
  
  if (isServerless && fs.existsSync('/tmp')) {
    const tmpPath = path.join('/tmp', 'database.sqlite');
    try {
      if (!fs.existsSync(tmpPath) && fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, tmpPath);
      }
      if (fs.existsSync(tmpPath)) {
        return tmpPath;
      }
    } catch (e) {
      console.error("Failed to copy database to /tmp:", e);
    }
  }

  return sourcePath;
}

function initDb() {
  if (dbInstance) return dbInstance;
  if (dbError) throw dbError;

  try {
    const dbPath = getDbPath();
    const db = new Database(dbPath, { verbose: console.log });

    // Initialize database schemas
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS features (
        key TEXT PRIMARY KEY,
        enabled INTEGER DEFAULT 0,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        shipping_address TEXT NOT NULL,
        city TEXT,
        state TEXT,
        items_json TEXT NOT NULL,
        total_amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        tracking_step INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price REAL,
        imageUrl TEXT,
        brochureUrl TEXT,
        featured INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        author TEXT,
        date TEXT,
        imageUrl TEXT
      );

      CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        productType TEXT,
        message TEXT NOT NULL,
        attachmentUrl TEXT,
        status TEXT DEFAULT 'New',
        date TEXT NOT NULL
      );
    `);

    // Seed default feature flags if empty or missing keys
    const defaultFeatures = [
      {
        key: 'feature_cart',
        enabled: 0,
        title: 'E-Commerce Cart & Item Selection',
        description: 'Enables interactive Add to Cart buttons, item quantity controls, and floating cart drawer across the product showcase.',
        category: 'Sales & Storefront'
      },
      {
        key: 'feature_checkout',
        enabled: 0,
        title: 'Direct Online Checkout & Orders',
        description: 'Enables customer checkout flow, delivery address capture, payment options (Card, Bank Transfer, POD), and order generation.',
        category: 'Sales & Storefront'
      },
      {
        key: 'feature_auth',
        enabled: 0,
        title: 'Customer User Sign Up & Login',
        description: 'Enables customer registration, secure sign in, and account credentials management.',
        category: 'Customer Portal'
      },
      {
        key: 'feature_dashboard',
        enabled: 0,
        title: 'Industry-Standard Customer Dashboard',
        description: 'Enables full customer portal at /account featuring live order status tracking, order history, address book, and invoice downloads.',
        category: 'Customer Portal'
      },
      {
        key: 'feature_wishlist',
        enabled: 0,
        title: 'Customer Wishlist & Saved Items',
        description: 'Enables customers to save products to a personal wishlist for fast future ordering.',
        category: 'Customer Experience'
      },
      {
        key: 'feature_reviews',
        enabled: 0,
        title: 'Product Ratings & Customer Reviews',
        description: 'Enables star ratings and verified buyer reviews on product catalog items.',
        category: 'Customer Experience'
      }
    ];

    const insertFeatureStmt = db.prepare(`
      INSERT OR IGNORE INTO features (key, enabled, title, description, category)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const feat of defaultFeatures) {
      insertFeatureStmt.run(feat.key, feat.enabled, feat.title, feat.description, feat.category);
    }

    // Seed default settings if empty
    const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
    if (settingsCount.count === 0) {
      const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
      insertSetting.run('companyName', 'Itulah Nigeria Limited');
      insertSetting.run('address', 'Plot 4 block 11 prince adesoji ajose street ogudu phase 2');
      insertSetting.run('phone', '+234 807 963 5408, +234 812 449 1283');
      insertSetting.run('email', 'Info@itulahng.com');
      insertSetting.run('adminEmail', 'Info@itulahng.com');
      insertSetting.run('adminPassword', 'News@090');
      insertSetting.run('ig_puls', '@Pulsnutrition_nigeria');
      insertSetting.run('ig_mikraid', '@mikraidng');
      insertSetting.run('ig_octopus', '@wildoctopus_mikraid');
      insertSetting.run('ig_pride', '@countrypride_mikraid');
      insertSetting.run('aboutText', 'Since inception, Itulah Nigeria Limited has been endowed with a successful history of providing quality services to a vast array of private and public sector clients. We commenced business on 1st January, 1989 and have consistently embarked on a series of dynamic and diversified business expansion initiatives.');
    } else {
      try {
        db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('address', 'Plot 4 block 11 prince adesoji ajose street ogudu phase 2');
        db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('phone', '+234 807 963 5408, +234 812 449 1283');
        db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('email', 'Info@itulahng.com');
        db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('adminEmail', 'Info@itulahng.com');
        db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('adminPassword', 'News@090');
      } catch (e) {
        console.error('Error updating settings table with credentials:', e);
      }
    }

    // Seed default products if empty
    const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
    if (productsCount.count === 0) {
      const insertProduct = db.prepare(`
        INSERT INTO products (name, category, description, price, imageUrl, brochureUrl, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      // Wild Octopus Products
      insertProduct.run('Wild Octopus Liqueur (Original)', 'beverages', 'A premium herbal liqueur crafted for the vibrant and refined palate. Balanced with exotic botanicals and smooth spirits.', 15000.0, '/img/wildOctopus1.jpeg', '/brochure_beverages.pdf', 1);
      insertProduct.run('Wild Octopus Reserve Liqueur', 'beverages', 'Premium barrel-aged herbal liqueur with deep amber warmth and spiced complexity.', 18500.0, '/img/WildOctopus2.jpeg', '/brochure_beverages.pdf', 1);
      insertProduct.run('Wild Octopus Craft Bottle (Limited)', 'beverages', 'Exclusive collector edition herbal spirit bottled in crystal craft decanters.', 22000.0, '/img/wildOctopus1.jpeg', '/brochure_beverages.pdf', 0);
      insertProduct.run('Country Pride Gin', 'beverages', 'A premium, locally refined gin with clean botanical notes. Perfect for classic cocktails or sipping neat.', 8500.0, '/img/alcoholic beverages.png', '/brochure_beverages.pdf', 0);
      insertProduct.run('Country Pride Whiskey (Cinnamon)', 'beverages', 'A warm, spiced cinnamon-infused whiskey that leaves a smooth, fiery, and aromatic finish.', 12000.0, '/img/alcoholic beverages.png', '/brochure_beverages.pdf', 1);
      insertProduct.run('Country Pride Whiskey (Classic)', 'beverages', 'The standard of rich, barrel-aged whiskey flavor. Notes of oak, vanilla, and dark honey.', 11000.0, '/img/alcoholic beverages.png', '/brochure_beverages.pdf', 0);

      // Fragrance & Perfumery Collection
      insertProduct.run('Fine Fragrance Oils (Aromatic N° 1)', 'fragrance', 'Exquisite fine fragrances formulated for perfumes and cosmetics, imported from leading global suppliers.', 4500.0, '/img/fragrance1.jpeg', '/brochure_fragrances.pdf', 1);
      insertProduct.run('Fine Fragrance Oils (Essence N° 2)', 'fragrance', 'High-concentration aromatic oils tailored for cosmetics, soaps, and luxury perfumery.', 4800.0, '/img/Fragrance2.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Royal Velvet Floral Oil (N° 3)', 'fragrance', 'Deep floral tones featuring jasmine, rose, and amber base accords.', 5200.0, '/img/Fragrance3.jpeg', '/brochure_fragrances.pdf', 1);
      insertProduct.run('Citrus & Botanical Flavour Oil (N° 4)', 'fragrance', 'Vibrant zesty citrus notes designed for beverages, confectionery, and personal care.', 4200.0, '/img/fragrance4.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Exotic Amber & Spice Essence (N° 5)', 'fragrance', 'Rich oriental spicy fragrance profile crafted for luxury unisex body sprays.', 5500.0, '/img/fragrance5.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Oceanic Breeze Eau De Parfum (N° 6)', 'fragrance', 'Crisp aquatic fragrance notes bringing long-lasting freshness.', 4900.0, '/img/Fragrance6.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Golden Vanilla & Sandalwood (N° 7)', 'fragrance', 'Smooth gourmand fragrance notes blending sweet vanilla bean with warm mysore sandalwood.', 5100.0, '/img/fragrance7.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Pure Botanical Extract (N° 8)', 'fragrance', '100% pure organic aromatic extracts for premium healthcare and aromatherapy.', 6000.0, '/img/fragrance8.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Midnight Musk Perfumery Oil (N° 9)', 'fragrance', 'Sensual musk notes for high-end designer fragrances.', 5800.0, '/img/fragrance9.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Tropical Fruit Essence (N° 10)', 'fragrance', 'Lush tropical flavour oil accords created for food & beverage flavoring.', 4600.0, '/img/fragrance10.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Fresh Green Tea Notes (N° 11)', 'fragrance', 'Revitalizing green leaf scent profile for spa lines and hotel amenities.', 4700.0, '/img/fragrance11.jpeg', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Luxury Cedarwood & Leather (N° 12)', 'fragrance', 'Sophisticated woody leather accords for premium grooming and prestige fragrances.', 5900.0, '/img/fragrance12.jpeg', '/brochure_fragrances.pdf', 0);

      insertProduct.run('Wendie Body Spray', 'fragrance', 'A fresh, alluring body spray with long-lasting floral and vanilla accents, suitable for active lifestyle.', 2500.0, '/img/bodySpray.png', '/brochure_fragrances.pdf', 0);
      insertProduct.run('Frais Body Spray', 'fragrance', 'A cool, refreshing masculine body spray that keeps you active and smelling clean all day.', 2500.0, '/img/bodySpray.png', '/brochure_fragrances.pdf', 1);

      // Nutrition
      insertProduct.run('PULS Nutritional Supplement (Whey Protein)', 'nutrition', 'Premium whey protein isolate formulated for muscular recovery, loaded with BCAAs and low carbs.', 32000.0, '/img/Nutrition.png', '/brochure_nutrition.pdf', 1);
      insertProduct.run('PULS Shaker & Water Bottle', 'nutrition', 'BPA-free leakproof shaker with stainless steel blending ball and storage compartment.', 4500.0, '/img/Nutrition.png', '/brochure_nutrition.pdf', 0);
    }

    // Seed default blogs if empty
    const blogsCount = db.prepare('SELECT COUNT(*) as count FROM blogs').get();
    if (blogsCount.count === 0) {
      const insertBlog = db.prepare(`
        INSERT INTO blogs (title, slug, content, category, author, date, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertBlog.run(
        'The Art of Crafting Wild Octopus Liqueur',
        'crafting-wild-octopus-liqueur',
        `<p>Wild Octopus Liqueur has quickly become one of the most sought-after lifestyle beverages. But what makes this herbal liqueur so special? It comes down to a dedication to heritage, flavor balance, and strict production quality.</p>
         <h3>The Botanical Blend</h3>
         <p>Every bottle of Wild Octopus is crafted using a unique combination of roots, seeds, and citrus peels. These ingredients are meticulously macerated to extract the rich aromatic oils that give the liqueur its signature golden glow and bitter-sweet harmony.</p>
         <h3>Serving Suggestions</h3>
         <p>Enjoy it chilled as a shot, or mix it with tonic water and a slice of lime for a refreshing afternoon beverage. Itulah Nigeria Limited is proud to distribute this premium drink across Nigeria, bringing premium lifestyle choices to your gatherings.</p>`,
        'Beverages',
        'M. O. Williams',
        'July 10, 2026',
        '/img/wildOctopus1.jpeg'
      );
    }

    dbInstance = db;
    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize SQLite database:', err);
    dbError = err;
    throw err;
  }
}

const db = new Proxy({}, {
  get(target, prop) {
    const instance = initDb();
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

export default db;
