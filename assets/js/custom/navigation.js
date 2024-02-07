/* ==========================================================================
   Sidebar navigation and visualization helper scripts
   ========================================================================== */

$(function () {
  function adjustSidebar() {
    // Identify the URL of the loaded page
    var loadedPageUrl = window.location.pathname;

    // Get the "sidebar" element
    var sidebarElement = document.querySelector('.sidebar');
    // If "sidebar" element exists, find the corresponding navigator item within it
    if (sidebarElement) {
      // Get all <a> elements in the navigation list within the "sidebar"
      var navLinks = sidebarElement.querySelectorAll('.nav__list .nav-link');

      // Enumerate through each <a> element and remove the "active" class
      navLinks.forEach(navLink => {
        navLink.classList.remove('active');
      });

      // Find the corresponding navigator item with matching URL within the "sidebar"
      var matchingNavItem = sidebarElement.querySelector('.nav__list .nav-link[href="' + loadedPageUrl + '"]');

      // If a matching item is found, mark it as "active"
      if (matchingNavItem) {
        matchingNavItem.classList.add('active');

        // Expand all parent ul elements up to the nearest .nav__list
        var parentUl = matchingNavItem.closest('ul');
        while (parentUl) {
          var parentCheckbox = parentUl.previousElementSibling.previousElementSibling;
          if (parentCheckbox && parentCheckbox.tagName === 'INPUT' && parentCheckbox.type === 'checkbox')
            parentCheckbox.checked = true;

          var immediateParent = parentUl.parentElement;
          if (immediateParent.classList.contains('nav__list'))
            break;

          parentUl = immediateParent.closest('ul');
        }

        // Ensure the active item is visible within the "sidebar"
        // TODO: This one is also not too reliable, browser dependant,get a better solution
        matchingNavItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  // Function to apply all of our custom modifications on the self loaded pages
  function finalizeContent() {
    // Sync the sidebar with the current page url, migth be out of sync when the page is loaded initially from an inner url
    adjustSidebar();
    // There might be nav-links in the loaded new content as well (e.g.Next / Prev buttons
    // so, handle the links here as the last action
    updateNavLinks();
    // Add page heading anchors
    addPageAnchors();
    // Add toc to anchor scrolling
    addTocScrolling();
    // Add code block enhancements
    addCodeBlocksTitle();
  }

  // Function to load content based on relative URL
  function loadContentFromUrl(url) {
    var currContent = document.querySelector('article');

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Page not found');
        }
        return response.text();
      })
      .then(html => {
        // Parse the HTML string to create a DOM document
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        // Find the "article" element in the parsed document
        var newContent = doc.querySelector('article');

        // FIXME: This does not work, double check
        currContent.scrollTop;

        // As a workaround of the above, empty the old content, and with a short delay only, load the new one
        currContent.innerHTML = '';

        // Replace the old content, but only with a small delay, to make sure the content reset takes effect
        setTimeout(function () {
          // Replace the old content with the loaded content
          currContent.parentNode.replaceChild(newContent, currContent);
        
          // Add all our custom modifications to all the self loaded pages
          finalizeContent();
        }, 100);
      })
      .catch(error => {
        currContent.innerHTML = '<h2>Error loading content</h2>';
      });
  }

  // Function to handle link clicks
  function handleLinkClick(event) {
    event.preventDefault(); // Prevent default navigation behavior

    // Get the relative URL value and update the browser URL
    var anchorElement = event.currentTarget.closest('a');
    if (anchorElement) {
      var url = new URL(anchorElement.href).pathname;
      var isChanged = (url != window.location.pathname);
      history.pushState(null, null, url);

      // Load content based on the updated relative URL
      // but only if the url changed
      if (isChanged)
        loadContentFromUrl(url, isChanged);
    }
  }

  function updateNavLinks(event) {
    // Attach click event listeners to all links with class 'nav-link'
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', handleLinkClick);
    });
  }

  // TOC smooth scrolling
  function addTocScrolling() {
    const topOffset = 100;
    var scroll = new SmoothScroll('a[href*="#"]', {
      offset: topOffset,
      speed: 400,
      speedAsDuration: true,
      durationMax: 500
    });

    // Gumshoe scroll spy init
    if ($("nav.toc a").length > 0) {
      var spy = new Gumshoe("nav.toc a", {
        // Active classes
        navClass: "active", // applied to the nav list item
        contentClass: "active", // applied to the content

        // Nested navigation
        nested: false, // if true, add classes to parents of active link
        nestedClass: "active", // applied to the parent items

        // Offset & reflow
        offset: topOffset, // how far from the top of the page to activate a content area
        reflow: true, // if true, listen for reflows

        // Event support
        events: true // if true, emit custom events
      });
    }
  }

  // Add anchors for headings
  function addPageAnchors() {
    $('.page__content').find('h1, h2, h3, h4, h5, h6').each(function () {
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
  }

  // Initial load based on the relative URL if needed
  // (e.g. when an inner embedded page link is opened directly in a new tab)
  loadContentFromUrl(window.location.pathname);

  // Listen for popstate events and update content accordingly
  window.addEventListener('popstate', function () {
    loadContentFromUrl(window.location.pathname);
  });

});