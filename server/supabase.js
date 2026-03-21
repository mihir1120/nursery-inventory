const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://dzlukwpryfwatpybfxkp.supabase.co";
const supabaseKey = "YOUR_sb_publishable_key_here";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;