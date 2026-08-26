(function () {
  "use strict";

  const GUIDE_ID = "guide-detail";
  const TOP_NAV_GUIDE_IDS = ["pre-game", "game-start", "other-systems"];

  const guides = {
    "pre-game": {
      label: "게임 시작 전",
      scenes: [
        { title: "준비" },
        { title: "추가 내용" },
      ],
    },
    "game-start": {
      label: "진행 방식",
      scenes: [
        { title: "자기장" },
        { title: "추가 내용" },
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
    section.appendChild(shade);
    section.appendChild(content);
    return section;
  }

  function setSelected(id) {
    getTabs().forEach(function (tab) {
      const selected = tab.id === id;
      tab.classList.toggle("is-selected", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
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

    if (activeGuide === id) {
      if (!forceOpen) closeGuide();
      return;
    }

    const detail = document.getElementById(GUIDE_ID);
    const detailInner = detail && detail.querySelector(".guide-detail__inner");
    if (!detail || !detailInner) return;

    activeGuide = id;
    detailInner.replaceChildren();

    const panel = document.createElement("div");
    panel.className = "guide-detail__panel guide-detail__panel--scenes";
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

  const labelObserver = new MutationObserver(keepLabelsCurrent);
  labelObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  keepLabelsCurrent();
  closeGuide();
})();
