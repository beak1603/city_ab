(function () {
  "use strict";

  function initializeRulebook() {

  const GUIDE_ID = "guide-detail";
  const TOP_NAV_GUIDE_IDS = ["pre-game", "game-start", "other-systems"];
  let revealObserver = null;

  const guides = {
    "pre-game": {
      label: "게임 시작 전",
      scenes: [
        {
          title: "1. 준비",
          description: "12명의 플레이어가 모두 준비 아이콘을 우클릭하여 준비완료되면 인첸트룸으로 이동합니다",
        },
        {
          title: "2. 능력 추첨",
          description: "인첸트룸에서 능력뽑기권을 사용해 능력을 뽑습니다\n리롤은 단 한번만 가능합니다",
        },
        {
          title: "3. 인첸트",
          description: "기본템을 인첸트하여 도시에서 싸울 준비를 마칩니다",
        },
        {
          title: "4. 최종 준비",
          description: "모든 플레이어가 최종 준비가 되면\n최후의 1인을 가리는 게임이 시작됩니다",
        },
      ],
    },
    "game-start": {
      label: "진행 방식",
      scenes: [
        {
          title: "1. 자기장",
          description: "자기장은 페이즈별로 줄어드며, 마지막 자기장 페이즈에는\n안전구역이 사라집니다",
        },
        {
          title: "2. 필드상자",
          description: "맵 곳곳에는 일반/고급/희귀 상자가 떨어져있습니다\n아이템은 등급별로 다르게 존재하며\n식량 및 전술아이템이 포함되어있습니다",
        },
        {
          title: "3. 토큰시스템",
          description: "맵 곳곳에있는 토큰생성소를 점령하여\n토큰을 획득하고 상점에서 필요한 아이템을 구입할 수 있습니다",
        },
        {
          title: "3-1. 토큰생성소",
          description: "토큰생성소는 총 6개 중 2개만 활성화되며\n활성화 위치는 일정시간이 지나면 지속적으로 바뀝니다",
        },
        {
          title: "3-2. 토큰상점",
          description: "획득한 토큰을 필요한 아이템, 능력 리롤권, 보조능력 등으로 구매할 수 있습니다",
        },
      ],
    },
    "other-systems": {
      label: "보조 능력",
      scenes: [
        { title: "보조 능력 소개" },
        { title: "추가 내용" },
      ],
    },
  };

  let activeGuide = null;

  function ensureScrollRevealStyle() {
    if (document.getElementById("city-scroll-reveal-style")) return;

    const style = document.createElement("style");
    style.id = "city-scroll-reveal-style";
    style.textContent = `
      .city-scroll-rise {
        opacity: 0;
        filter: blur(2px);
        transform: translate3d(0, 24px, 0);
        transition:
          opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 720ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 620ms ease;
        transition-delay: var(--city-rise-delay, 0ms);
        will-change: opacity, transform;
      }

      .city-scroll-rise.is-risen {
        opacity: 1;
        filter: blur(0);
        transform: translate3d(0, 0, 0);
      }

      /* Ability collection: reveal each card as a left-to-right wave. */
      #collection .collection-grid.city-scroll-rise {
        opacity: 1;
        filter: none;
        transform: none;
        transition: none;
        will-change: auto;
      }

      #collection .collection-grid.city-scroll-rise .collection-card {
        opacity: 0;
        transform: translate3d(0, 30px, 0) scale(0.97);
        transition:
          opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
      }

      #collection .collection-grid.city-scroll-rise.is-risen .collection-card {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }

      #collection .collection-grid .collection-card:nth-child(6n + 1) { transition-delay: 0ms; }
      #collection .collection-grid .collection-card:nth-child(6n + 2) { transition-delay: 70ms; }
      #collection .collection-grid .collection-card:nth-child(6n + 3) { transition-delay: 140ms; }
      #collection .collection-grid .collection-card:nth-child(6n + 4) { transition-delay: 210ms; }
      #collection .collection-grid .collection-card:nth-child(6n + 5) { transition-delay: 280ms; }
      #collection .collection-grid .collection-card:nth-child(6n + 6) { transition-delay: 350ms; }

      @media (max-width: 720px) {
        #collection .collection-grid .collection-card:nth-child(3n + 1) { transition-delay: 0ms; }
        #collection .collection-grid .collection-card:nth-child(3n + 2) { transition-delay: 85ms; }
        #collection .collection-grid .collection-card:nth-child(3n + 3) { transition-delay: 170ms; }
      }

      @media (prefers-reduced-motion: reduce) {
        .city-scroll-rise,
        #collection .collection-grid.city-scroll-rise .collection-card {
          opacity: 1 !important;
          filter: none !important;
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function installScrollReveal() {
    ensureScrollRevealStyle();

    const selector = [
      ".game-goal__heading .eyebrow",
      ".game-goal__heading h2",
      ".game-goal__stat",
      "#guide .section-heading .eyebrow",
      "#guide .section-heading h2",
      "#guide .section-heading > p",
      "#guide .guide-tabs",
      "#abilities .abilities__heading .eyebrow",
      "#abilities .abilities__heading h2",
      "#abilities .ability-control",
      "#collection .collection__heading .eyebrow",
      "#collection .collection__heading h2",
      "#collection .collection__heading > p",
      "#collection .collection-grid",
      ".site-footer > p",
      ".site-footer .to-top",
    ].join(",");

    const items = Array.from(document.querySelectorAll(selector)).filter(function (el) {
      return !el.dataset.cityScrollReveal;
    });

    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (el) {
        el.dataset.cityScrollReveal = "1";
        el.classList.add("city-scroll-rise", "is-risen");
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              requestAnimationFrame(function () {
                entry.target.classList.add("is-risen");
                revealObserver.unobserve(entry.target);
              });
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "-5% 0px -8% 0px",
        }
      );
    }

    items.forEach(function (el, index) {
      el.dataset.cityScrollReveal = "1";
      el.classList.add("city-scroll-rise");
      el.style.setProperty("--city-rise-delay", String((index % 4) * 70) + "ms");
      revealObserver.observe(el);
    });
  }

  function ensureGameGoal() {
    const guide = document.getElementById("guide");
    if (!guide || document.querySelector(".game-goal")) return;

    const section = document.createElement("section");
    section.className = "game-goal";
    section.setAttribute("aria-labelledby", "game-goal-heading");

    const heading = document.createElement("div");
    heading.className = "game-goal__heading";

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    const line = document.createElement("span");
    eyebrow.appendChild(line);
    eyebrow.appendChild(document.createTextNode(" GAME OBJECTIVE"));

    const title = document.createElement("h2");
    title.id = "game-goal-heading";
    title.textContent = "게임목표";

    heading.appendChild(eyebrow);
    heading.appendChild(title);

    const stats = document.createElement("div");
    stats.className = "game-goal__stats";
    stats.setAttribute("aria-label", "60개의 능력, 20분의 시간, 1명의 생존자");

    [
      { number: "60", label: "개의 능력," },
      { number: "20", label: "분의 시간," },
      { number: "1", label: "명의 생존자" },
    ].forEach(function (item) {
      const stat = document.createElement("div");
      stat.className = "game-goal__stat";

      const number = document.createElement("strong");
      number.textContent = item.number;

      const label = document.createElement("span");
      label.textContent = item.label;

      stat.appendChild(number);
      stat.appendChild(label);
      stats.appendChild(stat);
    });

    section.appendChild(heading);
    section.appendChild(stats);
    guide.parentNode.insertBefore(section, guide);
  }

  function getTabs() {
    return Array.from(document.querySelectorAll("#guide .guide-tab"));
  }

  function getTopNavLinks() {
    return Array.from(document.querySelectorAll(".top-nav a"));
  }

  function keepLabelsCurrent() {
    getTabs().forEach(function (tab) {
      const config = guides[tab.id];
      if (config && tab.textContent.trim() !== config.label) {
        tab.textContent = config.label;
      }
    });

    getTopNavLinks().forEach(function (link, index) {
      const guideId = TOP_NAV_GUIDE_IDS[index];
      const config = guides[guideId];
      if (!config) return;

      if (link.textContent.trim() !== config.label) {
        link.textContent = config.label;
      }
      if (link.getAttribute("href") !== "#guide") {
        link.setAttribute("href", "#guide");
      }
      if (link.dataset.guideTarget !== guideId) {
        link.dataset.guideTarget = guideId;
      }
    });
  }

  function createScene(scene, index) {
    const section = document.createElement("section");
    section.className = "guide-scene";
    section.style.setProperty("--scene-index", String(index));

    if (scene.image) {
      const image = document.createElement("div");
      image.className = "guide-scene__image";
      image.style.backgroundImage = 'url("' + scene.image + '")';
      image.setAttribute("aria-hidden", "true");
      section.appendChild(image);
    }

    const shade = document.createElement("div");
    shade.className = "guide-scene__shade";
    shade.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "guide-scene__content";

    const title = document.createElement("h3");
    title.textContent = scene.title;
    content.appendChild(title);

    if (scene.description) {
      const description = document.createElement("p");
      description.className = "guide-scene__description";
      description.textContent = scene.description;
      content.appendChild(description);
    }

    section.appendChild(shade);
    section.appendChild(content);
    return section;
  }

  function setSelected(id) {
    getTabs().forEach(function (tab) {
      const selected = tab.id === id;
      tab.classList.toggle("is-selected", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.setAttribute("tabindex", selected ? "0" : "-1");
    });

    getTopNavLinks().forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.guideTarget === id);
    });
  }

  function closeGuide() {
    const detail = document.getElementById(GUIDE_ID);
    activeGuide = null;
    setSelected(null);
    if (!detail) return;
    detail.classList.remove("is-open");
    detail.setAttribute("aria-hidden", "true");
  }

  function openGuide(id, forceOpen) {
    const config = guides[id];
    if (!config) return;

    const detail = document.getElementById(GUIDE_ID);
    const detailInner = detail && detail.querySelector(".guide-detail__inner");
    if (!detail || !detailInner) return;

    const isAlreadyOpen =
      activeGuide === id &&
      detail.classList.contains("is-open") &&
      detailInner.childElementCount > 0;

    if (isAlreadyOpen) {
      if (!forceOpen) closeGuide();
      return;
    }

    activeGuide = id;
    detailInner.replaceChildren();

    const panel = document.createElement("div");
    panel.className = "guide-detail__panel guide-detail__panel--scenes";
    panel.dataset.guideId = id;
    config.scenes.forEach(function (scene, index) {
      panel.appendChild(createScene(scene, index));
    });

    detailInner.appendChild(panel);
    setSelected(id);
    detail.classList.add("is-open");
    detail.setAttribute("aria-hidden", "false");
  }

  document.addEventListener(
    "click",
    function (event) {
      const topNavLink = event.target.closest && event.target.closest(".top-nav a[data-guide-target]");
      if (topNavLink && guides[topNavLink.dataset.guideTarget]) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openGuide(topNavLink.dataset.guideTarget, true);
        const guide = document.getElementById("guide");
        if (guide) {
          guide.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      const tab = event.target.closest && event.target.closest("#guide .guide-tab");
      if (!tab || !guides[tab.id]) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      openGuide(tab.id, false);
    },
    true
  );

  const labelObserver = new MutationObserver(function () {
    ensureGameGoal();
    keepLabelsCurrent();
    if (activeGuide) openGuide(activeGuide, true);
    installScrollReveal();
  });
  labelObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  ensureGameGoal();
  keepLabelsCurrent();
  installScrollReveal();
  openGuide("pre-game", true);

  window.addEventListener(
    "load",
    function () {
      ensureGameGoal();
      installScrollReveal();
    },
    { once: true }
  );
  window.setTimeout(function () {
    ensureGameGoal();
    installScrollReveal();
  }, 350);
  window.setTimeout(function () {
    ensureGameGoal();
    installScrollReveal();
  }, 1200);
  }

  let hasStarted = false;

  function startAfterHydration() {
    if (hasStarted) return;
    hasStarted = true;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(initializeRulebook);
    });
  }

  function hasHydrated() {
    const root = document.documentElement;
    return (
      root.classList.contains("intro-active") ||
      root.classList.contains("intro-seen") ||
      root.classList.contains("intro-complete")
    );
  }

  if (hasHydrated()) {
    startAfterHydration();
  } else {
    const hydrationObserver = new MutationObserver(function () {
      if (!hasHydrated()) return;
      hydrationObserver.disconnect();
      startAfterHydration();
    });
    hydrationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.setTimeout(function () {
      hydrationObserver.disconnect();
      startAfterHydration();
    }, 2500);
  }
})();
