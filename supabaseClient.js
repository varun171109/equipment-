/**
 * The one place the Supabase browser client is created.
 * Settings come from js/supabase-config.js.
 *
 * Errors thrown here are for developers (they appear in the browser
 * console). Pages never show them to customers.
 */
(function (SE) {
  var client = null;

  function cleanUrl(url) {
    return String(url || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
  }

  function isConfigured() {
    var c = SE.supabaseConfig || {};
    var url = cleanUrl(c.url);
    var key = String(c.anonKey || '').trim();
    // Supabase project URLs are https. http is accepted only for a local dev server.
    var urlOk = /^https:\/\/[^\s]+$/.test(url) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(url);
    return urlOk && !/PASTE_/.test(url) &&
           key.length > 20 && !/PASTE_/.test(key);
  }

  /** True for secret / service-role keys, which must never be in a browser. */
  function isSecretKey(key) {
    if (/^sb_secret_/.test(key)) return true;
    try {
      var parts = key.split('.');
      if (parts.length === 3) {
        var payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload.role === 'service_role';
      }
    } catch (e) { /* not a JWT: fine */ }
    return false;
  }

  SE.supabase = {
    isConfigured: isConfigured,

    getClient: function () {
      if (client) return client;

      if (!isConfigured()) {
        throw new Error('Supabase is not configured. Paste your Project URL and public key into js/supabase-config.js.');
      }
      var c = SE.supabaseConfig;
      var key = String(c.anonKey).trim();
      if (isSecretKey(key)) {
        throw new Error('js/supabase-config.js contains a SECRET key. Remove it now and use the public (publishable / anon) key instead.');
      }
      if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        throw new Error('The Supabase library did not load. Check that js/vendor/supabase-js-2.117.3.umd.js exists.');
      }

      client = window.supabase.createClient(cleanUrl(c.url), key, {
        // No login in this phase: do not store or look for any session.
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });
      return client;
    }
  };
})(window.SE);
