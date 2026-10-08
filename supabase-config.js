/**
 * =====================================================================
 *  SUPABASE CONNECTION SETTINGS
 *
 *  This is the ONLY place you paste your Supabase details.
 *
 *  In Supabase open your project, then:
 *     Project Settings > API Keys   (older projects: Settings > API)
 *
 *  1) SUPABASE_URL
 *       Your "Project URL", e.g.  https://abcdefghijkl.supabase.co
 *
 *  2) SUPABASE_ANON_KEY
 *       The PUBLIC key:
 *         - "Publishable key"  (starts with sb_publishable_...)   or
 *         - the older "anon" "public" key (a long text starting eyJ...)
 *
 *  NEVER paste a "secret" key, a "service_role" key or your database
 *  password here. This file is downloaded by every visitor's browser.
 *  The site refuses to start if it detects a secret key.
 *
 *  It is safe for the public key to be visible: the database rules
 *  (Row Level Security) only let visitors READ active products.
 * =====================================================================
 */
(function (SE) {
  var SUPABASE_URL = 'https://dpqrrndcliccfvuwvany.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_Xkl-oI6NgOeFZ6LkSSlatg_uu1o4LjI';

  // ---- do not edit below this line ----
  SE.supabaseConfig = { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
})(window.SE);
