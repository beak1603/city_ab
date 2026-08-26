(function () {
  "use strict";

  const GUIDE_ID = "guide-detail";
  const TOP_NAV_GUIDE_IDS = ["pre-game", "game-start", "other-systems"];

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
