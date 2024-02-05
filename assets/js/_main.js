/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(function () {
  // FitVids init
  $("#main").fitVids();

  // Sticky sidebar
  var initiallySticky = $(".sidebar").hasClass("sticky");
  var stickySideBar = function () {
    var show =
      $(".author__urls-wrapper").find("button").length === 0
        ? $(window).width() > 1024 // width should match $large Sass variable
        : !$(".author__urls-wrapper").find("button").is(":visible");
    if (show) {
      if (initiallySticky) {
        $(".sidebar").addClass("sticky");
      }
    } else {
      $(".sidebar").removeClass("sticky");
    }
  };

  stickySideBar();

  $(window).resize(function () {
    stickySideBar();
  });

  // Follow menu drop down
  $(".author__urls-wrapper").find("button").on("click", function() {
    $(".author__urls").toggleClass("is--visible");
    $(".author__urls-wrapper").find("button").toggleClass("open");
  });

  // Close search screen with Esc key or toggle with predefined hotKey
  $(document).keyup(function (event) {
    // Define the desired hotkey (in this case, Ctrl + Shift + F)
    var searchHotkey = { ctrlKey: true, shiftKey: true, key: 'F' };

    if (event.keyCode === 27) {
      if ($(".initial-content").hasClass("is--hidden"))
        toggleSearch();
    }
    else if (event.ctrlKey === searchHotkey.ctrlKey &&
             event.shiftKey === searchHotkey.shiftKey &&
             event.key === searchHotkey.key) {
      toggleSearch();
    }
  });

  function toggleSearch() {
    $(".search-content").toggleClass("is--visible");
    $(".initial-content").toggleClass("is--hidden");

    if ($(".initial-content").hasClass("is--hidden")) {
      // set focus on input
      setTimeout(function () {
        $(".search-content").find("input").focus();
      }, 400);
    }
    else {
      // set focus back to the initial content otherwise the focus will not get back to the search input once again
      $(".initial-content").find("input").focus();
    }
  }

  // Search toggle
  $(".search__toggle").on("click", toggleSearch);

  // Smooth scrolling
  var scroll = new SmoothScroll('a[href*="#"]', {
    offset: 20,
    speed: 400,
    speedAsDuration: true,
    durationMax: 500
  });

  // Gumshoe scroll spy init
  if($("nav.toc").length > 0) {
    var spy = new Gumshoe("nav.toc a", {
      // Active classes
      navClass: "active", // applied to the nav list item
      contentClass: "active", // applied to the content

      // Nested navigation
      nested: false, // if true, add classes to parents of active link
      nestedClass: "active", // applied to the parent items

      // Offset & reflow
      offset: 20, // how far from the top of the page to activate a content area
      reflow: true, // if true, listen for reflows

      // Event support
      events: true // if true, emit custom events
    });
  }

  // add lightbox class to all image links
  $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']"
  ).has("> img").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: "image",
    tLoading: "Loading image #%curr%...",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.'
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: "mfp-zoom-in",
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace(
          "mfp-figure",
          "mfp-figure mfp-with-anim"
        );
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

  // Add anchors for headings
  $('.page__content').find('h1, h2, h3, h4, h5, h6').each(function() {
    var id = $(this).attr('id');
    if (id) {
      var anchor = document.createElement("a");
      anchor.className = 'header-link';
      anchor.href = '#' + id;
      anchor.innerHTML = '<span class=\"sr-only\">Permalink</span><i class=\"fab fa-slack-hash\"></i>';
      anchor.title = "Permalink";
      $(this).append(anchor);
    }
  });
});
