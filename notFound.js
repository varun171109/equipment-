(function (SE) {
  var h = SE.h;

  SE.pages.notFound = {
    title: 'Page not found',
    render: function () {
      return h('section', { class: 'section not-found' },
        h('div', { class: 'container' },
          h('h1', { class: 'page-title' }, 'Page not found'),
          h('p', null, 'The page you are looking for does not exist.'),
          h('a', { class: 'btn btn--primary', href: '#/' }, 'BACK TO HOME')
        )
      );
    }
  };
})(window.SE);
