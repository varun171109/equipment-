(function (SE) {
  var h = SE.h;
  var fmt = SE.format;
  var P = SE.pricing;

  SE.pages.cart = {
    title: 'Your Cart',
    render: function (ctx) {
      var S = SE.components.statusBlock;
      var heading = h('h1', { class: 'page-title', tabindex: '-1' }, 'Your Cart');
      var body = h('div', { class: 'cart-status' });

      // The cart stores only product ids and quantities. Names, images and
      // prices come from the product list loaded from Supabase.
      function load() {
        body.replaceChildren(S.loading());
        SE.productService.getProducts()
          .then(function (products) {
            if (!ctx.isActive()) return;
            // Nothing to price against: show the message but leave the saved cart untouched.
            if (!products.length) {
              body.replaceChildren(S.empty());
              return;
            }
            build(products);
          })
          .catch(function () {
            if (!ctx.isActive()) return;
            body.replaceChildren(S.error(load)); // saved cart is kept
          });
      }

      function build(products) {
        var byId = {};
        products.forEach(function (p) { byId[p.id] = p; });

        // Remove lines for products that no longer exist or are hidden (done once, before listening)
        var removed = 0;
        SE.cartService.getItems().forEach(function (i) {
          if (!byId[i.productId]) {
            SE.cartService.remove(i.productId);
            removed++;
          }
        });

        var listEl = h('div', { class: 'cart-list' });
        var countEl = h('span');
        var totalEl = h('strong', { class: 'cart-summary__total' });
        var lines = {};

        function createLine(product) {
          var image = SE.media.getProductImages(product)[0];
          var priceLine = h('p', { class: 'cart-line__price' });
          var tierPill = h('span', { class: 'tier-pill' });
          var hint = h('p', { class: 'cart-line__hint' });
          var subtotal = h('strong', { class: 'cart-line__subtotal' });

          var selector = SE.components.quantitySelector({
            id: 'cart-qty-' + product.id,
            label: 'Quantity for ' + product.name,
            live: false,
            onChange: function (q) { SE.cartService.setQuantity(product.id, q); }
          });

          var removeBtn = h('button', {
            class: 'link-button cart-line__remove', type: 'button',
            'aria-label': 'Remove ' + product.name + ' from cart',
            onclick: function () {
              SE.cartService.remove(product.id);
              heading.focus();
            }
          }, SE.icon('trash', 16), 'Remove');

          var el = h('article', { class: 'cart-line' },
            h('div', { class: 'cart-line__img' },
              h('img', { src: image.src, alt: image.alt, width: '240', height: '240' })),
            h('div', { class: 'cart-line__body' },
              h('h2', { class: 'cart-line__name' }, h('a', { href: '#/product/' + product.id }, product.name)),
              priceLine,
              h('p', { class: 'cart-line__tier' }, tierPill),
              hint,
              h('div', { class: 'cart-line__controls' },
                selector.el,
                h('p', { class: 'cart-line__subtotal-wrap' }, 'Subtotal: ', subtotal)
              ),
              removeBtn
            )
          );

          function update(qty) {
            var tier = P.getTier(qty);
            var unit = P.getPriceForQuantity(product, qty);
            priceLine.textContent = qty + ' × ' + fmt.price(unit) + ' / piece';
            tierPill.textContent = tier.label + ' pricing (' + P.getRangeLabel(tier) + ')';
            subtotal.textContent = fmt.price(P.getLineTotal(product, qty));
            var next = P.getNextTier(qty);
            hint.textContent = next
              ? 'Add ' + (next.min - qty) + ' more to get ' + next.label + ' pricing at ' + fmt.price(product.pricing[next.priceField]) + ' / piece.'
              : '';
            hint.hidden = !next;
            selector.setValue(qty, true);
          }

          return { el: el, update: update };
        }

        var checkoutBtn = h('button', { class: 'btn btn--dark btn--block', type: 'button', disabled: true }, 'PROCEED TO CHECKOUT');
        var summary = h('aside', { class: 'cart-summary', 'aria-label': 'Order summary' },
          h('h2', null, 'Summary'),
          h('div', { class: 'cart-summary__row' }, h('span', null, 'Total pieces'), countEl),
          h('div', { class: 'cart-summary__row cart-summary__row--total' }, h('span', null, 'Cart total'), totalEl),
          h('p', { class: 'cart-summary__note' },
            'Shipping and taxes are not calculated. Online checkout and payment will be added in a later phase.'),
          checkoutBtn,
          h('a', { class: 'btn btn--outline btn--block', href: '#/' }, 'CONTINUE SHOPPING')
        );

        var layout = h('div', { class: 'cart-layout' }, listEl, summary);
        var empty = h('div', { class: 'cart-empty' },
          h('p', null, 'Your cart is empty.'),
          h('a', { class: 'btn btn--primary', href: '#/' }, 'BROWSE EQUIPMENT')
        );
        var removedNotice = removed
          ? h('p', { class: 'notice' }, removed === 1
              ? 'An item in your cart is no longer available and was removed.'
              : removed + ' items in your cart are no longer available and were removed.')
          : null;

        function sync() {
          var items = SE.cartService.getItems().filter(function (i) { return byId[i.productId]; });
          var seen = {};
          var total = 0;
          var pieces = 0;

          items.forEach(function (item, index) {
            var product = byId[item.productId];
            seen[item.productId] = true;
            var line = lines[item.productId];
            if (!line) {
              line = createLine(product);
              lines[item.productId] = line;
            }
            line.update(item.quantity);
            if (listEl.children[index] !== line.el) listEl.insertBefore(line.el, listEl.children[index] || null);
            total += P.getLineTotal(product, item.quantity);
            pieces += item.quantity;
          });

          Object.keys(lines).forEach(function (id) {
            if (!seen[id]) {
              lines[id].el.remove();
              delete lines[id];
            }
          });

          countEl.textContent = String(pieces);
          totalEl.textContent = fmt.price(total);
          empty.hidden = items.length > 0;
          layout.hidden = items.length === 0;
        }

        body.replaceChildren(removedNotice, empty, layout);
        ctx.onLeave(SE.cartService.subscribe(sync));
        sync();
      }

      load();
      return h('section', { class: 'section' }, h('div', { class: 'container' }, heading, body));
    }
  };
})(window.SE);
