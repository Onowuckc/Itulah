import Database from 'better-sqlite3';
import path from 'path';

// Define database file path in the root folder
const dbPath = path.resolve(process.cwd(), 'database.sqlite');

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
  insertSetting.run('address', 'Plot 12, Mikado House, Adeola Hopewell Street, Victoria Island, Lagos, Nigeria');
  insertSetting.run('phone', '+234 1 234 5678, +234 803 123 4567');
  insertSetting.run('email', 'Info@itulahng.com');
  insertSetting.run('adminEmail', 'Info@itulahng.com');
  insertSetting.run('adminPassword', 'News@090');
  insertSetting.run('ig_puls', '@Pulsnutrition_nigeria');
  insertSetting.run('ig_security', '@mikadomsc');
  insertSetting.run('ig_mikraid', '@mikraidng');
  insertSetting.run('ig_octopus', '@wildoctopus_mikraid');
  insertSetting.run('ig_pride', '@countrypride_mikraid');
  insertSetting.run('aboutText', 'Since inception, Itulah Nigeria Limited (formerly known as Mikado Nigeria Limited) has been endowed with a successful history of providing quality services to a vast array of private and public sector clients. We commenced business on 1st January, 1989 and have consistently embarked on a series of dynamic and diversified business expansion initiatives.');
} else {
  // Ensure email and adminPassword in settings table are synchronized with latest credentials
  try {
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

  // --- Category: Alcoholic Beverages ---
  insertProduct.run(
    'Wild Octopus Liqueur',
    'beverages',
    'A premium herbal liqueur crafted for the vibrant and refined palate. Balanced with exotic botanicals and smooth spirits.',
    15000.0,
    '/img/WildOctopus.png',
    '/brochure_beverages.pdf',
    1
  );
  insertProduct.run(
    'Country Pride Gin',
    'beverages',
    'A premium, locally refined gin with clean botanical notes. Perfect for classic cocktails or sipping neat.',
    8500.0,
    '/img/alcoholic beverages.png',
    '/brochure_beverages.pdf',
    0
  );
  insertProduct.run(
    'Country Pride Whiskey (Cinnamon)',
    'beverages',
    'A warm, spiced cinnamon-infused whiskey that leaves a smooth, fiery, and aromatic finish.',
    12000.0,
    '/img/alcoholic beverages.png',
    '/brochure_beverages.pdf',
    1
  );
  insertProduct.run(
    'Country Pride Whiskey (Classic)',
    'beverages',
    'The standard of rich, barrel-aged whiskey flavor. Notes of oak, vanilla, and dark honey.',
    11000.0,
    '/img/alcoholic beverages.png',
    '/brochure_beverages.pdf',
    0
  );

  // --- Category: CCTV / Surveillance Systems ---
  insertProduct.run(
    'IP Security Camera (HD)',
    'cctv',
    'High-definition IP network camera with smart motion tracking, night vision, and cloud recording features.',
    45000.0,
    '/img/cctv.png',
    '/brochure_security.pdf',
    1
  );
  insertProduct.run(
    'Dome Infrared Camera',
    'cctv',
    'Vandal-resistant dome surveillance camera suitable for indoor and outdoor secure monitoring.',
    32000.0,
    '/img/cctv.png',
    '/brochure_security.pdf',
    0
  );
  insertProduct.run(
    'PTZ Camera (Pan-Tilt-Zoom)',
    'cctv',
    'Advanced surveillance PTZ camera with 30x optical zoom, auto-tracking, and remote directional controls.',
    85000.0,
    '/img/cctv.png',
    '/brochure_security.pdf',
    1
  );
  insertProduct.run(
    'DVR / NVR Multi-Channel Recorder',
    'cctv',
    'Professional network video recorder supporting up to 16 channels, secure hard drive bays, and mobile access.',
    75000.0,
    '/img/cctv.png',
    '/brochure_security.pdf',
    0
  );

  // --- Category: Locks & Physical Security ---
  insertProduct.run(
    'Padlock GRANIT® Heavy Duty',
    'locks',
    'High-security lock featuring premium German engineering, rust-resistant solid steel body, and drill protection.',
    28000.0,
    '/img/physical locks.png',
    '/brochure_security.pdf',
    1
  );
  insertProduct.run(
    'Combination Locks (Keyless)',
    'locks',
    'Convenient keyless combination security lock for lockers, doors, and toolboxes with reset codes.',
    12500.0,
    '/img/physical locks.png',
    '/brochure_security.pdf',
    0
  );
  insertProduct.run(
    'KeyGarage® KeySafe Box',
    'locks',
    'Secure wall-mountable digital keysafe for storing access keys, cards, and dynamic entry access.',
    18500.0,
    '/img/physical locks.png',
    '/brochure_security.pdf',
    0
  );
  insertProduct.run(
    'Marine Padlocks (Rust-Free)',
    'locks',
    '100% rust-free chrome-plated brass padlocks built specifically for coastal and high-humidity environments.',
    15000.0,
    '/img/physical locks.png',
    '/brochure_security.pdf',
    0
  );

  // --- Category: Fire Alarm & Safety Systems ---
  insertProduct.run(
    'Fire Alarm Control Panel',
    'fire',
    'Analog addressable fire detection panel with backup battery power and multi-zone sensor integrations.',
    120000.0,
    '/img/FireAlarm.png',
    '/brochure_security.pdf',
    0
  );
  insertProduct.run(
    'Wireless Smoke Detector',
    'fire',
    'Optical smoke detector with inter-connectable alarm sirens and long-life lithium battery systems.',
    9500.0,
    '/img/FireAlarm.png',
    '/brochure_security.pdf',
    1
  );

  // --- Category: Communication & PABX ---
  insertProduct.run(
    'Samsung SMT-i5343 IP Phone',
    'telephony',
    'Premium executive enterprise IP phone featuring color screen, Bluetooth, and programmable touch keys.',
    65000.0,
    '/img/communicationAndLandline.png',
    '/brochure_telecom.pdf',
    1
  );
  insertProduct.run(
    'Gigaset DX800A All-in-One',
    'telephony',
    'Hybrid desktop phone system supporting VoIP, ISDN, and landlines with clean audio and digital directory.',
    55000.0,
    '/img/communicationAndLandline.png',
    '/brochure_telecom.pdf',
    0
  );

  // --- Category: Fragrance Products & Personal Care ---
  insertProduct.run(
    'Fine Fragrance Oils',
    'fragrance',
    'Exquisite fine fragrances formulated for perfumes and cosmetics, imported from leading global suppliers.',
    4500.0,
    '/img/Fragrance.png',
    '/brochure_fragrances.pdf',
    1
  );
  insertProduct.run(
    'Wendie Body Spray',
    'fragrance',
    'A fresh, alluring body spray with long-lasting floral and vanilla accents, suitable for active lifestyle.',
    2500.0,
    '/img/bodySpray.png',
    '/brochure_fragrances.pdf',
    0
  );
  insertProduct.run(
    'Frais Body Spray',
    'fragrance',
    'A cool, refreshing masculine body spray that keeps you active and smelling clean all day.',
    2500.0,
    '/img/bodySpray.png',
    '/brochure_fragrances.pdf',
    1
  );

  // --- Category: PULS Nutrition ---
  insertProduct.run(
    'PULS Nutritional Supplement (Whey Protein)',
    'nutrition',
    'Premium whey protein isolate formulated for muscular recovery, loaded with BCAAs and low carbs.',
    32000.0,
    '/img/Nutrition.png',
    '/brochure_nutrition.pdf',
    1
  );
  insertProduct.run(
    'PULS Shaker & Water Bottle',
    'nutrition',
    'BPA-free leakproof shaker with stainless steel blending ball and storage compartment.',
    4500.0,
    '/img/Nutrition.png',
    '/brochure_nutrition.pdf',
    0
  );

  // --- Category: Cleaning Solutions ---
  insertProduct.run(
    'Diversey Industrial Detergent',
    'cleaning',
    'Professional-grade heavy-duty cleaning and sanitizing agent for commercial and hospitality industries.',
    18000.0,
    '/img/cctv.png', // Fallback or standard image placeholder
    '/brochure_cleaning.pdf',
    0
  );
}

// Seed default blogs if empty
const blogsCount = db.prepare('SELECT COUNT(*) as count FROM blogs').get();
if (blogsCount.count === 0) {
  const insertBlog = db.prepare(`
    INSERT INTO blogs (title, slug, content, category, author, date, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertBlog.run(
    'How to Choose the Best CCTV Cameras for Your Business',
    'choosing-best-cctv-cameras',
    `<p>Security is paramount for any business operation in Nigeria. When designing a surveillance system for your office or warehouse, several factors must be considered to make an informed investment.</p>
     <h3>1. Understanding Camera Types</h3>
     <p>Dome cameras are excellent for indoor areas as they are compact and less obtrusive. Bullet cameras are best for long-range outdoor views, making them visual deterrents. PTZ (Pan-Tilt-Zoom) cameras provide active tracking capabilities, allowing operators to pan, tilt, and zoom onto targets.</p>
     <h3>2. Resolving Resolution Needs</h3>
     <p>HD cameras (1080p and above) are recommended to capture facial features or license plates clearly. Ensure your NVR/DVR storage has enough capacity to handle high-definition recordings.</p>
     <p>At Itulah Nigeria Limited, we provide customized consultations to help design, configure, and install the perfect surveillance solutions tailored to your building blueprint.</p>`,
    'Security',
    'Itulah Security Team',
    'July 15, 2026',
    '/img/cctv.png'
  );

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
    '/img/WildOctopus.png'
  );
}

export default db;
