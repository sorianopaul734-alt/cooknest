-- =====================================================
-- CookNest Database Schema
-- Run this once on your Railway MySQL database
-- =====================================================

-- Drop tables if you need a clean re-run (CAREFUL: deletes all data)
-- DROP TABLE IF EXISTS comments, cart, order_items, orders, recipes, settings, users;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,        -- stores a bcrypt HASH, never plain text
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- RECIPES ----------
CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  cat VARCHAR(80) NOT NULL,
  emoji VARCHAR(10) DEFAULT '🍴',
  description TEXT,
  ing JSON NOT NULL,                     -- array of ingredient strings
  steps JSON NOT NULL,                   -- array of step strings
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  reviews INT NOT NULL DEFAULT 0,
  added DATE DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- ORDERS ----------
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('Confirmed','Preparing','Out for Delivery','Delivered','Cancelled')
         NOT NULL DEFAULT 'Confirmed',
  payment_method VARCHAR(40) DEFAULT 'GCash',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------- ORDER ITEMS (line items per order) ----------
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  recipe_id INT NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  price_each DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- ---------- CART (persistent server-side cart per user) ----------
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_recipe (user_id, recipe_id)
);

-- ---------- COMMENTS / REVIEWS ----------
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------- SETTINGS (key/value store, e.g. fan favourite recipe id) ----------
CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(50) PRIMARY KEY,
  `value` VARCHAR(255)
);

INSERT INTO settings (`key`, `value`) VALUES ('fan_fav_id', '3')
  ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- =====================================================
-- SEED DATA — the 6 starter recipes from your frontend
-- =====================================================
INSERT INTO recipes (title, cat, emoji, description, ing, steps, price, rating, reviews, added) VALUES
('Spaghetti Bolognese','Italian','🍝','Rich meat sauce over al dente spaghetti — a timeless Italian staple perfected over hours.',
 JSON_ARRAY('500g ground beef','400g spaghetti','800g canned tomatoes','1 large onion','3 cloves garlic','2 tbsp olive oil','Salt & black pepper'),
 JSON_ARRAY('Bring a large pot of salted water to a boil and cook pasta until al dente. Drain and set aside.','Dice onion and mince garlic. Sauté in olive oil over medium heat until softened and fragrant, about 5 minutes.','Add ground beef to the pan. Break apart with a wooden spoon and cook until fully browned.','Pour in canned tomatoes, season generously with salt and pepper. Stir well and reduce heat.','Simmer the sauce uncovered for at least 20 minutes, stirring occasionally, until thickened.','Toss pasta with sauce. Serve topped with freshly grated parmesan and torn basil.'),
 199, 5.0, 3, '2024-01-10'),

('Chicken Curry','Asian','🍛','Aromatic coconut-based curry with tender chicken, warming spices and silky sauce.',
 JSON_ARRAY('500g chicken breast','400ml coconut milk','2 tbsp curry powder','1 onion','3 cloves garlic','1 tbsp fresh ginger','2 tbsp neutral oil','Salt to taste'),
 JSON_ARRAY('Heat oil in a deep pan. Sauté diced onion, garlic, and grated ginger over medium heat until golden.','Add chicken pieces and sear until sealed on all sides — don\'t stir too much so it colours nicely.','Stir in curry powder and cook for 60 seconds to bloom the spices.','Pour in coconut milk. Stir to combine and scrape up any browned bits from the bottom.','Simmer uncovered on low heat for 20 minutes until chicken is cooked through and sauce is thick.','Season with salt, serve over steamed jasmine rice with fresh coriander.'),
 179, 5.0, 3, '2024-01-15'),

('Chicken Adobo','Filipino','🍗','The national dish of the Philippines — tangy, savoury, and deeply satisfying with every bite.',
 JSON_ARRAY('1kg chicken pieces','½ cup soy sauce','¼ cup white cane vinegar','1 head garlic (crushed)','2 bay leaves','1 tsp black peppercorns','2 tbsp cooking oil','1 tsp sugar (optional)'),
 JSON_ARRAY('Combine chicken with soy sauce and vinegar in a bowl. Marinate for at least 30 minutes (overnight is better).','Heat oil in a wide pan over medium-high heat. Sauté the crushed garlic until golden and fragrant.','Add the marinated chicken along with all the marinade liquid, bay leaves, and peppercorns.','Bring to a boil, then reduce heat and simmer uncovered for 30 minutes, turning chicken halfway.','Optional: Remove chicken and pan-fry in a separate pan to caramelize and crisp the skin.','Reduce remaining sauce until slightly syrupy. Pour over chicken and serve with steamed rice.'),
 159, 5.0, 3, '2024-01-05'),

('Pancit Canton','Filipino','🍜','Stir-fried egg noodles loaded with vegetables and your choice of pork or chicken.',
 JSON_ARRAY('250g canton noodles','200g pork belly (sliced thin)','1 cup cabbage (shredded)','1 carrot (julienned)','3 tbsp soy sauce','2 cups chicken broth','2 cloves garlic','Calamansi to serve'),
 JSON_ARRAY('Blanch canton noodles in boiling water for 2 minutes, drain and set aside.','Sauté garlic in oil, add pork and cook until browned. Season lightly with soy sauce.','Add carrots and cabbage. Stir-fry for 2 minutes until just tender but still crisp.','Pour in chicken broth and remaining soy sauce. Bring to a rolling boil.','Add noodles and toss constantly until all liquid is absorbed and noodles are coated.','Serve with calamansi halves on the side and a dash of patis if desired.'),
 139, 5.0, 3, '2024-02-01'),

('Caesar Salad','Healthy','🥗','Crisp romaine with hand-whisked dressing, golden croutons, and aged parmesan.',
 JSON_ARRAY('1 head romaine lettuce','½ cup Caesar dressing','1 cup croutons','¼ cup parmesan (shaved)','2 tbsp fresh lemon juice','Freshly cracked black pepper'),
 JSON_ARRAY('Wash romaine thoroughly and spin dry. Tear into generous bite-sized pieces.','Whisk Caesar dressing together with fresh lemon juice until smooth and emulsified.','Add lettuce to a large wide bowl. Pour dressing and toss well to coat every leaf.','Add most of the croutons and parmesan. Toss once more gently.','Transfer to serving plates. Top with remaining croutons, parmesan, and generous black pepper.','Serve immediately — the croutons lose their crunch within minutes.'),
 119, 4.7, 3, '2024-02-10'),

('Leche Flan','Dessert','🍮','Classic Filipino caramel custard — silky, burnished, and utterly indulgent.',
 JSON_ARRAY('10 egg yolks','1 can (300ml) condensed milk','1 can (370ml) evaporated milk','1 tsp vanilla extract','1 cup white sugar (for caramel)','2 tbsp water'),
 JSON_ARRAY('Combine sugar and water in a heavy llanera over low heat. Do not stir — swirl gently until a deep amber caramel forms. Remove from heat.','Let caramel cool slightly and harden in the llanera. It will crack slightly as you tilt it — this is fine.','Whisk egg yolks in a bowl until smooth. Add condensed milk, evaporated milk, and vanilla. Whisk until combined.','Strain the custard mixture twice through a fine-mesh sieve to remove bubbles and chalazae.','Pour carefully over the set caramel. Cover tightly with foil.','Steam over low-medium heat for 45 minutes, or bake in a water bath at 160°C for 50 minutes. A toothpick should come out clean.'),
 129, 5.0, 3, '2024-01-20');

-- =====================================================
-- ADMIN ACCOUNT
-- The password below is a bcrypt hash of: Admin#2026!
-- IMPORTANT: log in once with this, then change the password
-- via the admin UI (or just re-hash a new one — see note at bottom).
-- =====================================================
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@cooknest.com', '$2b$10$replace_with_real_hash_see_instructions_below', 'admin')
ON DUPLICATE KEY UPDATE role = 'admin';

-- NOTE ON THE HASH ABOVE:
-- Bcrypt hashes are generated with a random salt each time, so I cannot
-- safely hardcode one here for you to copy-paste blindly. Instead:
--   1. Run the backend's seed script (see backend/seedAdmin.js) which
--      hashes a password of YOUR choosing and inserts it correctly, OR
--   2. Register normally through POST /users/register, then run:
--        UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
