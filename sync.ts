import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncBuckets() {
  console.log("Fetching list of products...");
  
  const { data: products, error: dbError } = await supabase
    .rpc("list_storefront_products", { p_limit: 1000 });
    
  if (dbError) {
    console.error("Failed to query products:", dbError);
    return;
  }

  for (const p of products || []) {
    const storage_path = p.image_storage_path;
    if (!storage_path) continue;
    
    console.log(`Copying ${storage_path}...`);
    
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from("product-images")
      .download(storage_path);
      
    if (downloadError) {
      console.error(`  Download failed for ${storage_path}:`, downloadError);
      continue;
    }
    
    const { error: uploadError } = await supabase
      .storage
      .from("storefront-images")
      .upload(storage_path, fileData, { upsert: true });
      
    if (uploadError) {
      console.error(`  Upload failed for ${storage_path}:`, uploadError);
    } else {
      console.log(`  Success for ${storage_path}`);
    }
  }
}

syncBuckets().then(() => console.log("Done")).catch(console.error);

