/**
 * Product data access: Supabase is the source of truth.
 *
 * Pages call getProducts() / getProductById() and receive products in
 * the same shape they used in Phase 1 (see mapRow), so the pricing
 * logic, product page and cart did not have to change.
 *
 * On any failure these functions log the real error to the console
 * (for the developer) and reject with a generic error. Pages show a
 * friendly message and never display the raw error.
 */
(function (SE) {
  // Only the columns the website needs.
  var COLUMNS = 'id, name, slug, description, short_description, material, length, weight, ' +
    'retail_price, bulk_20_price, bulk_50_price, stock_quantity, image_url, extra_specs, sort_order';
  var TBC = 'To be confirmed';

  /**
   * Database row -> product object used by the pages.
   * The URL id and the cart id are the product's slug, so Phase 1
   * links and carts saved in localStorage keep working.
   * Returns null for a row that is unusable (e.g. a missing price).
   */
  function mapRow(row) {
    var pricing = {
      retail: Number(row.retail_price),
      bulk20: Number(row.bulk_20_price),
      bulk50: Number(row.bulk_50_price)
    };
    var priceOk = [pricing.retail, pricing.bulk20, pricing.bulk50].every(function (n) {
      return isFinite(n) && n >= 0;
    });
    if (!row.slug || !row.name || !priceOk) {
      console.warn('[productService] Skipping a product with missing or invalid data:', row && row.slug);
      return null;
    }

    var specifications = [
      { label: 'Material', value: row.material || TBC },
      { label: 'Size / length', value: row.length || TBC },
      { label: 'Weight', value: row.weight || TBC }
    ];
    if (Array.isArray(row.extra_specs)) {
      row.extra_specs.forEach(function (s) {
        if (s && s.label && s.value) specifications.push({ label: String(s.label), value: String(s.value) });
      });
    }

    return {
      id: row.slug,
      dbId: row.id,
      name: row.name,
      shortDescription: row.short_description || '',
      description: row.description || '',
      images: row.image_url ? [{ src: row.image_url, alt: row.name }] : [], // [] = placeholders
      specifications: specifications,
      pricing: pricing,
      stockQuantity: row.stock_quantity // not used by the website yet
    };
  }

  function unavailable(context, error) {
    console.error('[productService] ' + context, error);
    return new Error('Products unavailable');
  }

  function query() {
    return SE.supabase.getClient().from('products').select(COLUMNS).eq('is_active', true);
  }

  SE.productService = {
    /** All active products in display order. Resolves to [] when there are none. */
    getProducts: function () {
      return Promise.resolve()
        .then(function () { return query().order('sort_order', { ascending: true }).order('name', { ascending: true }); })
        .then(function (res) {
          if (res.error) throw res.error;
          return (res.data || []).map(mapRow).filter(Boolean);
        })
        .catch(function (err) { throw unavailable('Could not load products.', err); });
    },

    /** One active product by slug, or null when it does not exist / is hidden. */
    getProductById: function (slug) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(slug))) return Promise.resolve(null);
      return Promise.resolve()
        .then(function () { return query().eq('slug', slug).limit(1); })
        .then(function (res) {
          if (res.error) throw res.error;
          return res.data && res.data.length ? mapRow(res.data[0]) : null;
        })
        .catch(function (err) { throw unavailable('Could not load product "' + slug + '".', err); });
    }
  };
  SE.productService.getProductBySlug = SE.productService.getProductById;
})(window.SE);
