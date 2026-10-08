/**
 * Central site configuration.
 * Change the business name, logo, colours, pricing tiers and contact
 * details here; no component needs to be edited.
 */
(function (SE) {
  SE.config = {
    // ---- Branding (temporary, not finalised) -------------------------
    siteName: 'SILAMBAM EQUIPMENT',
    logo: {
      text: 'SILAMBAM EQUIPMENT', // text wordmark; first word light, rest gold
      imageUrl: null              // later: 'images/logo.svg' to use a real logo
    },

    // ---- Colours (applied as CSS variables at start-up) --------------
    colors: {
      primary: '#10251F',    // deep forest green
      secondary: '#0D1720',  // dark navy
      accent: '#C9A45C',     // muted gold
      background: '#F4F0E7'  // warm off-white
    },

    // ---- Money -------------------------------------------------------
    currency: { symbol: '₹', locale: 'en-IN' },

    // ---- Quantity pricing tiers -------------------------------------
    // `priceField` is the key inside each product's `pricing` object.
    // max: null means "no upper limit".
    tiers: [
      { key: 'retail', label: 'Retail',          min: 1,  max: 19,   priceField: 'retail' },
      { key: 'bulk20', label: 'Small Wholesale', min: 20, max: 49,   priceField: 'bulk20' },
      { key: 'bulk50', label: 'Academy / Bulk',  min: 50, max: null, priceField: 'bulk50' }
    ],
    maxQuantity: 9999,

    // Shows a small "placeholder content" note on the home and product pages.
    // Set to false once real prices and specifications are in.
    showPlaceholderNotice: true,

    // ---- Navigation --------------------------------------------------
    nav: [
      { label: 'HOME',    href: '#/',        route: 'home' },
      { label: 'ABOUT',   href: '#/about',   route: 'about' },
      { label: 'GALLERY', href: '#/gallery', route: 'gallery' },
      { label: 'CONTACT', href: '#/contact', route: 'contact' }
    ],

    // ---- Contact details (placeholders) -----------------------------
    contact: {
      whatsapp:  'Coming Soon',
      phone:     'Coming Soon',
      email:     'Coming Soon',
      instagram: 'Coming Soon',
      location:  'Coming Soon'
    },

    // ---- Storage -----------------------------------------------------
    storageKeys: { cart: 'silambamEquipment.cart.v1' }
  };

  // Small shared state container (e.g. message pre-filled on the contact form)
  SE.state = { contactPrefill: null };
  SE.components = {};
  SE.pages = {};
  SE.data = {};
})(window.SE = window.SE || {});
