/**
 * Cart storage (localStorage only in Phase 1).
 *
 * Only { productId, quantity } is stored. Names, images and prices are
 * looked up from the product data each time, so price changes apply to
 * items already in the cart. Later this can be backed by Supabase.
 */
(function (SE) {
  var KEY = SE.config.storageKeys.cart;
  var listeners = [];
  var items = load();

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      var merged = [];
      parsed.forEach(function (entry) {
        if (!entry || typeof entry.productId !== 'string') return;
        var qty = SE.pricing.clampQuantity(entry.quantity);
        var existing = merged.filter(function (m) { return m.productId === entry.productId; })[0];
        if (existing) existing.quantity = SE.pricing.clampQuantity(existing.quantity + qty);
        else merged.push({ productId: entry.productId, quantity: qty });
      });
      return merged;
    } catch (e) {
      return [];
    }
  }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* private mode: keep in memory */ }
  }

  function emit() {
    var snapshot = getItems();
    listeners.slice().forEach(function (fn) { fn(snapshot); });
  }

  function getItems() {
    return items.map(function (i) { return { productId: i.productId, quantity: i.quantity }; });
  }

  function find(productId) {
    return items.filter(function (i) { return i.productId === productId; })[0];
  }

  // Keep several open tabs in sync.
  window.addEventListener('storage', function (event) {
    if (event.key === KEY) {
      items = load();
      emit();
    }
  });

  SE.cartService = {
    getItems: getItems,

    /** Total number of pieces across all lines. */
    getCount: function () {
      return items.reduce(function (sum, i) { return sum + i.quantity; }, 0);
    },

    /** Adds to an existing line, or creates one. */
    add: function (productId, quantity) {
      var qty = SE.pricing.clampQuantity(quantity);
      var line = find(productId);
      if (line) line.quantity = SE.pricing.clampQuantity(line.quantity + qty);
      else items.push({ productId: productId, quantity: qty });
      save();
      emit();
    },

    setQuantity: function (productId, quantity) {
      var line = find(productId);
      if (!line) return;
      line.quantity = SE.pricing.clampQuantity(quantity);
      save();
      emit();
    },

    remove: function (productId) {
      items = items.filter(function (i) { return i.productId !== productId; });
      save();
      emit();
    },

    clear: function () {
      items = [];
      save();
      emit();
    },

    /** Calls fn whenever the cart changes. Returns an unsubscribe function. */
    subscribe: function (fn) {
      listeners.push(fn);
      return function () { listeners = listeners.filter(function (l) { return l !== fn; }); };
    }
  };
})(window.SE);
