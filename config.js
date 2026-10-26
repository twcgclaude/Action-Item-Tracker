/* ===================================================================
   TWCG Action Item Tracker - connection settings
   Fill in the three values below ONCE (README, Step 3), then leave this file alone.
   Re-publishing index.html never changes your data, and this file is safe to keep in GitHub:
   the "anon / publishable" key is meant to be public because the database only answers
   signed-in users (see supabase_setup.sql).

   NEVER put a "service_role" key or your database password in this file.
   =================================================================== */
window.TWCG_CONFIG = {
  // Supabase > Project Settings > API > Project URL
  SUPABASE_URL: "https://rjqszqfiwetgoufcpeir.supabase.co",

  // Supabase > Project Settings > API > "anon" public key (or the "publishable" key)
  SUPABASE_ANON_KEY: "sb_publishable_lneiGb8X2-ZxcC16jB7StA_X_lQa8mE",

  // The e-mail of the ONE shared team user you create in Supabase (README, Step 2).
  // It never receives mail and people never type it - they only type the team password.
  TEAM_EMAIL: "hswift@juneaucc.com"

  // Optional: if your company network blocks cdn.jsdelivr.net, save supabase.js
  // in this folder (README, Troubleshooting) and uncomment:
  // , SUPABASE_LIB_URL: "supabase.js"
};
