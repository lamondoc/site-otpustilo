(function () {
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  var yearEl = document.getElementById("year");
  var cookieBar = document.getElementById("cookie");
  var cookieAccept = document.getElementById("cookie-accept");
  var cookieDecline = document.getElementById("cookie-decline");
  var bookingSection = document.getElementById("booking");
  var bookingConsent = document.getElementById("booking-consent");
  var bookingGo = document.getElementById("booking-go");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var mobileOverlay = document.getElementById("mobile-nav-overlay");
  var mobileDrawer = document.getElementById("mobile-nav-drawer");

  function setMobileNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    if (burger) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (mobileDrawer) {
      mobileDrawer.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (mobileOverlay) {
      mobileOverlay.setAttribute("aria-hidden", open ? "false" : "true");
    }
    document.body.style.overflow = open ? "hidden" : "";
  }

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  if (burger && nav) {
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !document.body.classList.contains("nav-open");
      setMobileNavOpen(open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileNav();
      });
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileNav);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMobileNav();
    }
  });

  (function initYandexReviews() {
    var section = document.getElementById("reviews");
    if (!section) return;
    var raw = (section.getAttribute("data-yandex-reviews-src") || "").trim();
    var invalid =
      !raw ||
      raw.indexOf("http") !== 0 ||
      /ВАШ|PLACEHOLDER|ORG_PLACEHOLDER|0000000000/i.test(raw);
    var iframes = document.querySelectorAll(".js-yandex-reviews-iframe");
    var fb = document.getElementById("yandex-reviews-fallback-page");
    if (!invalid) {
      iframes.forEach(function (f) {
        f.src = raw;
      });
      if (fb) fb.hidden = true;
    } else {
      iframes.forEach(function (f) {
        f.removeAttribute("src");
      });
      if (fb) fb.hidden = false;
    }
  })();

  var cookieKey = "cookie-consent-demo";
  try {
    if (cookieBar && !localStorage.getItem(cookieKey)) {
      requestAnimationFrame(function () {
        cookieBar.classList.add("is-visible");
      });
    }
  } catch (e) {}

  function hideCookie() {
    if (cookieBar) cookieBar.classList.remove("is-visible");
  }

  if (cookieAccept) {
    cookieAccept.addEventListener("click", function () {
      try {
        localStorage.setItem(cookieKey, "accept");
      } catch (e) {}
      hideCookie();
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener("click", function () {
      try {
        localStorage.setItem(cookieKey, "decline");
      } catch (e) {}
      hideCookie();
    });
  }

  if (bookingConsent && bookingGo && bookingSection) {
    var dikidiUrl = bookingSection.getAttribute("data-dikidi-url") || "https://dikidi.net/";
    function syncBookingButton() {
      bookingGo.disabled = !bookingConsent.checked;
    }
    bookingConsent.addEventListener("change", syncBookingButton);
    syncBookingButton();
    bookingGo.addEventListener("click", function () {
      if (!bookingConsent.checked) {
        return;
      }
      window.open(dikidiUrl, "_blank", "noopener,noreferrer");
    });
  }

  (function initServicesCarousel() {
    var track = document.getElementById("services-cards");
    var dotsRoot = document.getElementById("services-carousel-dots");
    var prevBtn = document.querySelector("[data-services-prev]");
    var nextBtn = document.querySelector("[data-services-next]");
    if (!track || !dotsRoot || !prevBtn || !nextBtn) return;

    var cards = track.querySelectorAll(".card");
    if (cards.length === 0) return;

    var mq = window.matchMedia("(max-width: 992px)");
    var dotButtons = [];
    var scrollEndTimer;

    function getStep() {
      var firstCard = track.querySelector(".card");
      if (!firstCard) return 280;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return firstCard.getBoundingClientRect().width + gap;
    }

    function getIndexFromScroll() {
      var step = getStep();
      if (step <= 0) return 0;
      var idx = Math.round(track.scrollLeft / step);
      return Math.min(cards.length - 1, Math.max(0, idx));
    }

    function syncDots() {
      var i = getIndexFromScroll();
      dotButtons.forEach(function (btn, j) {
        var on = j === i;
        btn.classList.toggle("is-active", on);
        if (on) {
          btn.setAttribute("aria-current", "true");
        } else {
          btn.removeAttribute("aria-current");
        }
      });
    }

    function syncArrows() {
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      var left = track.scrollLeft;
      prevBtn.disabled = left <= 2;
      nextBtn.disabled = left >= maxScroll - 2;
    }

    function updateNav() {
      syncDots();
      syncArrows();
    }

    function buildDots() {
      dotsRoot.innerHTML = "";
      dotButtons = [];
      for (var i = 0; i < cards.length; i++) {
        (function (index) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "services-carousel__dot";
          b.setAttribute("aria-label", "Перейти к услуге " + (index + 1));
          b.addEventListener("click", function () {
            var step = getStep();
            track.scrollTo({ left: index * step, behavior: "smooth" });
          });
          dotsRoot.appendChild(b);
          dotButtons.push(b);
        })(i);
      }
    }

    function onScroll() {
      updateNav();
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(updateNav, 120);
    }

    function applyMode() {
      if (mq.matches) {
        if (dotButtons.length !== cards.length) {
          buildDots();
        }
        updateNav();
      } else {
        dotsRoot.innerHTML = "";
        dotButtons = [];
        prevBtn.disabled = false;
        nextBtn.disabled = false;
      }
    }

    prevBtn.addEventListener("click", function () {
      if (prevBtn.disabled) return;
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", function () {
      if (nextBtn.disabled) return;
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      applyMode();
      if (mq.matches) {
        updateNav();
      }
    });

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", applyMode);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(applyMode);
    }
    applyMode();
    if (mq.matches) {
      requestAnimationFrame(function () {
        requestAnimationFrame(updateNav);
      });
    }
  })();

  document.querySelectorAll("[data-open-dialog]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-open-dialog");
      var dlg = id ? document.getElementById(id) : null;
      if (dlg && typeof dlg.showModal === "function") {
        dlg.showModal();
      }
    });
  });

  document.querySelectorAll("[data-close-dialog]").forEach(function (el) {
    el.addEventListener("click", function () {
      var dlg = el.closest("dialog");
      if (dlg && typeof dlg.close === "function") {
        dlg.close();
      }
    });
  });

  document.querySelectorAll(".service-dialog").forEach(function (dlg) {
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) {
        dlg.close();
      }
    });
  });

  (function initDiplomaLightbox() {
    var dlg = document.getElementById("diploma-lightbox");
    var imgEl = document.getElementById("diploma-lightbox-img");
    var strip = document.getElementById("diploma-lightbox-strip");
    var prevBtn = document.getElementById("diploma-prev");
    var nextBtn = document.getElementById("diploma-next");
    if (!dlg || !imgEl || !strip || !prevBtn || !nextBtn) return;

    var thumbs = Array.prototype.slice.call(
      document.querySelectorAll(".about-me__diploma .diploma-frame--thumb")
    );
    if (!thumbs.length) return;

    var mq = window.matchMedia("(max-width: 992px)");
    var currentIndex = 0;

    function getThumbImg(i) {
      var b = thumbs[i];
      return b ? b.querySelector("img") : null;
    }

    function ensureStripSlides() {
      if (strip.children.length) return;
      thumbs.forEach(function (btn, i) {
        var slide = document.createElement("div");
        slide.className = "diploma-lightbox__slide";
        slide.setAttribute("role", "listitem");
        slide.setAttribute("data-diploma-index", String(i));
        var im = document.createElement("img");
        im.alt = "";
        im.decoding = "async";
        slide.appendChild(im);
        strip.appendChild(slide);
      });
    }

    function syncStripFromThumbs() {
      ensureStripSlides();
      thumbs.forEach(function (btn, i) {
        var srcImg = btn.querySelector("img");
        var slide = strip.children[i];
        if (!srcImg || !slide) return;
        var im = slide.querySelector("img");
        if (!im) return;
        im.src = srcImg.currentSrc || srcImg.getAttribute("src") || "";
        im.alt = "";
      });
    }

    function applyDesktopView() {
      var srcImg = getThumbImg(currentIndex);
      if (!srcImg) return;
      imgEl.src = srcImg.currentSrc || srcImg.getAttribute("src") || "";
      imgEl.alt = "";
    }

    function scrollStripToIndex(behavior) {
      var slide = strip.children[currentIndex];
      if (!slide) return;
      slide.scrollIntoView({
        block: "center",
        behavior: behavior === undefined ? "auto" : behavior,
        inline: "nearest",
      });
    }

    function updateArrowDisabled() {
      var last = thumbs.length - 1;
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= last;
    }

    function refreshView(scrollBehavior) {
      if (mq.matches) {
        syncStripFromThumbs();
        scrollStripToIndex(scrollBehavior);
      } else {
        applyDesktopView();
      }
      updateArrowDisabled();
    }

    function openFromThumb(btn) {
      var idx = thumbs.indexOf(btn);
      if (idx < 0) return;
      currentIndex = idx;
      if (mq.matches) {
        syncStripFromThumbs();
      } else {
        applyDesktopView();
      }
      updateArrowDisabled();
      if (typeof dlg.showModal === "function") {
        dlg.showModal();
      }
      if (mq.matches) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            scrollStripToIndex("auto");
          });
        });
      }
    }

    function scrollBehaviorForNav() {
      if (!mq.matches) return "auto";
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    }

    prevBtn.addEventListener("click", function () {
      if (currentIndex <= 0) return;
      currentIndex -= 1;
      refreshView(scrollBehaviorForNav());
    });

    nextBtn.addEventListener("click", function () {
      if (currentIndex >= thumbs.length - 1) return;
      currentIndex += 1;
      refreshView(scrollBehaviorForNav());
    });

    dlg.addEventListener("keydown", function (e) {
      if (!dlg.open) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (!prevBtn.disabled) {
          e.preventDefault();
          prevBtn.click();
        }
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (!nextBtn.disabled) {
          e.preventDefault();
          nextBtn.click();
        }
      }
    });

    thumbs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        openFromThumb(btn);
      });
      btn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFromThumb(btn);
        }
      });
    });

    var stripScrollTimer;
    strip.addEventListener(
      "scroll",
      function () {
        if (!mq.matches || !dlg.open) return;
        clearTimeout(stripScrollTimer);
        stripScrollTimer = setTimeout(function () {
          var slides = strip.children;
          if (!slides.length) return;
          var rect = strip.getBoundingClientRect();
          var mid = rect.top + strip.clientHeight / 2;
          var best = 0;
          var bestDist = 1e9;
          for (var i = 0; i < slides.length; i++) {
            var r = slides[i].getBoundingClientRect();
            var c = r.top + r.height / 2;
            var d = Math.abs(c - mid);
            if (d < bestDist) {
              bestDist = d;
              best = i;
            }
          }
          if (best !== currentIndex) {
            currentIndex = best;
            updateArrowDisabled();
          }
        }, 100);
      },
      { passive: true }
    );
  })();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    document.documentElement.classList.add("has-scroll-fx");

    var progressEl = document.getElementById("scroll-progress");
    var heroBg = document.querySelector(".hero__bg");
    var headerEl = document.querySelector(".header");
    var scrollTicking = false;

    function updateScrollEffects() {
      scrollTicking = false;
      var y = window.scrollY || document.documentElement.scrollTop;
      var doc = document.documentElement;
      var maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      var ratio = Math.min(1, Math.max(0, y / maxScroll));

      if (progressEl) {
        progressEl.style.width = ratio * 100 + "%";
      }
      if (heroBg) {
        heroBg.style.transform =
          "translate3d(0, " + Math.round(y * 0.16) + "px, 0) scale(1.08)";
      }
      if (headerEl) {
        headerEl.classList.toggle("is-scrolled", y > 32);
      }
    }

    function onScroll() {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateScrollEffects);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollEffects();

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal-on-scroll").forEach(function (el) {
      el.classList.add("is-inview");
    });
  }

  // Smooth scroll to top for logo links
  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
})();
