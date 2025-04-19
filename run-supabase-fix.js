// Script to execute SQL fix against Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get the environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("Connecting to Supabase at:", supabaseUrl);
console.log("Using key (first 10 chars):", supabaseKey.substring(0, 10) + "...");

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL fix file
const sqlFixPath = path.join(__dirname, 'fix-database-schema.sql');
const sqlFix = fs.readFileSync(sqlFixPath, 'utf8');

// Split the SQL into separate statements
// This is a simple split that works for most cases, but doesn't handle all SQL syntax
const statements = sqlFix
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

// Execute each SQL statement
async function executeStatements() {
  console.log(`Executing ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`\nExecuting statement ${i + 1}/${statements.length}:`);
    console.log(statement.substring(0, 80) + (statement.length > 80 ? '...' : ''));
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error);
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    } catch (err) {
      console.error(`❌ Exception executing statement ${i + 1}:`, err);
    }
  }
  
  console.log("\nAll statements processed. Now checking database structure...");
  
  // Verify the tables and relationships
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('*')
    .limit(1);
  
  if (brandsError) {
    console.error("❌ Error checking brands table:", brandsError);
  } else {
    console.log("✅ Brands table exists and is accessible");
  }
  
  const { data: categories, error: categoriesError } = await supabase
    .from('brand_categories')
    .select('*')
    .limit(1);
  
  if (categoriesError) {
    console.error("❌ Error checking brand_categories table:", categoriesError);
  } else {
    console.log("✅ Brand categories table exists and is accessible");
    console.log("Sample category:", categories[0]);
  }
  
  // Try a join query to test the relationship
  const { data: joinData, error: joinError } = await supabase
    .from('brands')
    .select(`
      *,
      category_details:brand_categories(*)
    `)
    .limit(1);
  
  if (joinError) {
    console.error("❌ Error testing relationship:", joinError);
  } else {
    console.log("✅ Relationship between brands and brand_categories is working");
  }
}

// Execute the SQL statements
executeStatements().catch(err => {
  console.error("❌ Fatal error:", err);
}); 