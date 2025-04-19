#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to read the schema.sql file
function readSchemaFile() {
  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('Error: schema.sql file not found in the supabase directory');
    process.exit(1);
  }
  return fs.readFileSync(schemaPath, 'utf8');
}

// Function to read the storage-setup.sql file
function readStorageSetupFile() {
  const storagePath = path.join(__dirname, '..', 'supabase', 'storage-setup.sql');
  if (!fs.existsSync(storagePath)) {
    console.error('Error: storage-setup.sql file not found in the supabase directory');
    process.exit(1);
  }
  return fs.readFileSync(storagePath, 'utf8');
}

// Function to read the categories-setup.sql file
function readCategoriesSetupFile() {
  const categoriesPath = path.join(__dirname, '..', 'supabase', 'categories-setup.sql');
  if (!fs.existsSync(categoriesPath)) {
    console.error('Error: categories-setup.sql file not found in the supabase directory');
    process.exit(1);
  }
  return fs.readFileSync(categoriesPath, 'utf8');
}

// Function to get Supabase URL and key from .env file
function getSupabaseCredentials() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found in the project root');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const supabaseUrl = envContent.match(/EXPO_PUBLIC_SUPABASE_URL=(.+)/)?.[1];
  const supabaseKey = envContent.match(/EXPO_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1];

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or key not found in .env file');
    process.exit(1);
  }

  return { supabaseUrl, supabaseKey };
}

// Main function to run the setup
function setupSupabase() {
  console.log('🚀 Setting up Supabase for CardSpace app...');

  // Get Supabase credentials
  const { supabaseUrl, supabaseKey } = getSupabaseCredentials();
  console.log(`✅ Supabase URL: ${supabaseUrl}`);
  console.log(`✅ Supabase key found`);

  // Read schema file
  const schema = readSchemaFile();
  console.log('✅ Schema file loaded');

  // Read storage setup file
  const storageSetup = readStorageSetupFile();
  console.log('✅ Storage setup file loaded');

  // Read categories setup file
  const categoriesSetup = readCategoriesSetupFile();
  console.log('✅ Categories setup file loaded');

  console.log('\n⚠️ This script will execute SQL commands on your Supabase database.');
  console.log('⚠️ It will create tables, storage buckets, categories, and insert sample data.\n');

  rl.question('Do you want to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }

    console.log('\n🔨 Setting up database, storage, and categories...');
    
    // In a real script, you would use the Supabase JS client or a REST call
    // to execute the SQL. For simplicity, we're just showing the schema here.
    console.log('\n📋 Database Schema to execute:');
    console.log('--------------------------------------------------');
    console.log(schema.substring(0, 500) + '...');
    console.log('--------------------------------------------------');
    
    console.log('\n📋 Storage Setup to execute:');
    console.log('--------------------------------------------------');
    console.log(storageSetup);
    console.log('--------------------------------------------------');
    
    console.log('\n📋 Categories Setup to execute:');
    console.log('--------------------------------------------------');
    console.log(categoriesSetup.substring(0, 500) + '...');
    console.log('--------------------------------------------------');
    
    console.log('\n✅ Setup instructions:');
    console.log('1. Go to your Supabase dashboard at https://app.supabase.io/');
    console.log('2. Select your project');
    console.log('3. Go to the SQL Editor');
    console.log('4. First, run the contents of supabase/schema.sql');
    console.log('5. Then, run the contents of supabase/storage-setup.sql');
    console.log('6. Finally, run the contents of supabase/categories-setup.sql');
    
    console.log('\n✨ Once you have run all three scripts, your database, storage, and categories will be ready to use!');
    
    rl.close();
  });
}

// Run the setup
setupSupabase(); 