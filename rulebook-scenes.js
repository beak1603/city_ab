(function () {
  "use strict";

  function apply2026Branding() {
    document.title = "2026 도시능력자";

    const brand = document.querySelector(".brand__text strong");
    if (brand) brand.textContent = "2026 도시능력자";

    const brandLink = document.querySelector(".brand");
    if (brandLink) brandLink.setAttribute("aria-label", "2026 도시능력자 홈");

    const heroTitle = document.getElementById("hero-title");
    if (heroTitle) heroTitle.textContent = "2026 도시능력자";

    const footerTitle = document.querySelector(".site-footer > p");
    if (footerTitle) footerTitle.textContent = "2026 도시능력자";
  }

  function initializeRulebook() {
  apply2026Branding();

  const GUIDE_ID = "guide-detail";
  const TOP_NAV_GUIDE_IDS = ["pre-game", "game-start", "other-systems"];
  let revealObserver = null;

  const guides = {
    "pre-game": {
      label: "게임 시작 전",
      scenes: [
        {
          title: "1. 준비",
          description: "12명의 플레이어가 모두 준비되면 인첸트룸으로 이동합니다",
        },
        {
          title: "2. 능력 추첨",
          description: "인첸트룸에서 능력 티켓으로 능력을 뽑습니다\n리롤은 단 한 번만 가능합니다",
        },
        {
          title: "3. 인첸트",
          description: "기본템을 인첸트하여 도시에서 싸울 준비를 마칩니다",
        },
        {
          title: "4. 최종 준비",
          steve: "./scene-final-ready-steve-v1.png",
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
          description: "- 맵 곳곳에는 일반/고급/희귀 상자가 랜덤 배치되어 있습니다\n- 식량 및 전술아이템이 포함되어 있으며, 아이템 종류는 상자등급별로 다르게 존재합니다\n- 필드상자는 주기적으로 재보급됩니다",
        },
        {
          title: "3. 토큰시스템",
          description: "맵 곳곳에있는 토큰생성소를 점령하거나 다른 플레이어를 킬하여 토큰을 획득하고 상점에서 필요한 아이템을 구입할 수 있습니다",
        },
        {
          title: "3-1. 토큰생성소",
          description: "- 토큰생성소는 총 8개입니다\n- 토큰생성소에 일정 시간 머무르면 자동으로 점령되며 충전된 토큰이 지급됩니다\n- 토큰생성소 점령 도중 다른 플레이어가 들어올 경우 점령은 취소됩니다\n- 토큰생성소에 토큰은 최대 5개까지 충전됩니다\n- 2개밖에 충전되지 않은 토큰생성소를 점령시 토큰 2개만 획득할 수 있습니다\n- 게임시작시 8개 중 2개만 활성화되며, 누군가 토큰 생성소 점령 완료 했을 경우 다른 토큰생성소가 활성화 됩니다\n- 일정시간 이후에는 모든 토큰생성소가 활성화됩니다",
          diagram: "token-stations",
        },
        {
          title: "3-2. 토큰상점",
          description: "- 판매품목은 전술 아이템/고급 능력 리롤권/보조능력이 있습니다\n- 전술 아이템은 전투에 필요한 기본적인 아이템들이 있습니다\n- 고급 능력 리롤권은 준수한 성능 이상의 능력으로 리롤할 수 있습니다\n- 보조능력은 처음 추첨한 능력 이외에 전투에 도움이 되는 간단한 보조능력입니다\n- 보조능력은 중복으로 구매할 수 없으며 새로운 보조능력 구매시 이전 보조능력은 사라집니다",
          villager: "./token-shop-librarian-v1.png",
        },
        {
          title: "4. 부활시스템",
          description: "- 게임 시작 후 일정시간 동안은 처치당해도 부활이 가능합니다\n- 처치 당했을시 주능력, 기본템 및 보유하고 있던 토큰을 제외하고 모두 시체상자에 드랍합니다\n- 일정시간 이후 부활이 불가능하며 이때 처치당할 시 탈락 처리됩니다",
          revival: "./revival-gravestone.png",
        },
      ],
    },
    "other-systems": {
      label: "보조능력",
      scenes: [
        {
          title: "보조능력 소개",
          abilities: [
            { name: "고속 추출기", image: "./support-high-speed-extractor.webp", description: "토큰 생성소 점령시간이 절반으로 줄어듭니다." },
            { name: "광역 탐색기", image: "./support-wide-area-scanner.webp", description: "필드상자 감지 범위를 2배 증가시킵니다." },
            { name: "돌풍 질주", image: "./support-gust-dash.webp", description: "바라보는 수평 방향으로 빠르게 돌진합니다." },
            { name: "비상 가속", image: "./support-emergency-boost.webp", description: "피해를 받고 체력이 일정 체력 이하가 되면 일정 시간 동안 빠른 이동 속도를 얻습니다." },
            { name: "상승 기류", image: "./support-updraft.webp", description: "사용 시 높게 뛰어오르며 그 순간만 낙하 피해를 무효화합니다." },
            { name: "생명 포식", image: "./support-life-devour.webp", description: "다른 플레이어를 처치하면 일시적으로 재생효과를 얻습니다." },
            { name: "생체 분석기", image: "./support-bio-analyzer.webp", description: "다른 플레이어들의 남은 체력을 확인할 수 있습니다." },
            { name: "위치 투영기", image: "./support-position-projector.webp", description: "사용 시 주변 플레이어 위치에 잔상을 남깁니다." },
            { name: "정화 장막", image: "./support-purifying-barrier.webp", description: "사용 시 본인에게 적용되는 해로운 효과들을 일시적으로 막습니다." },
            { name: "현상금 증폭기", image: "./support-bounty-amplifier.webp", description: "플레이어 처치 보상이 토큰 2개에서 3개로 증가합니다." },
          ],
        },
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
    stats.setAttribute("aria-label", "60개의 능력 20분의 시간 1명의 생존자");

    [
      { number: "60", label: "개의 능력" },
      { number: "20", label: "분의 시간" },
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

  // Draw the existing transparent sword at a larger size, with a contact
  // shadow and its own mirrored image fading into the shared scene floor.
  function drawGroundedSword(context, source, width, height) {
    const sourceBounds = [1259, 332, 263, 268];
    const targetBounds = [1230, 282, 320, 326];
    const floorY = 608;
    const reflectionScale = 0.36;
    const reflection = document.createElement("canvas");
    reflection.width = width;
    reflection.height = height;
    const reflectionContext = reflection.getContext("2d");

    if (reflectionContext) {
      reflectionContext.save();
      reflectionContext.translate(0, floorY * (1 + reflectionScale));
      reflectionContext.scale(1, -reflectionScale);
      reflectionContext.filter = "blur(2.5px)";
      reflectionContext.drawImage(source, ...sourceBounds, ...targetBounds);
      reflectionContext.restore();

      reflectionContext.globalCompositeOperation = "destination-in";
      const fade = reflectionContext.createLinearGradient(0, floorY, 0, floorY + 118);
      fade.addColorStop(0, "rgba(0, 0, 0, 0.28)");
      fade.addColorStop(0.2, "rgba(0, 0, 0, 0.19)");
      fade.addColorStop(0.6, "rgba(0, 0, 0, 0.065)");
      fade.addColorStop(1, "rgba(0, 0, 0, 0)");
      reflectionContext.fillStyle = fade;
      reflectionContext.fillRect(0, 0, width, height);
      context.drawImage(reflection, 0, 0);
    }

    const shadow = function (x, y, radiusX, radiusY, opacity) {
      context.save();
      context.translate(x, y);
      context.scale(radiusX, radiusY);
      const falloff = context.createRadialGradient(0, 0, 0, 0, 0, 1);
      falloff.addColorStop(0, "rgba(0, 0, 0, " + opacity + ")");
      falloff.addColorStop(0.4, "rgba(0, 0, 0, " + opacity * 0.62 + ")");
      falloff.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = falloff;
      context.fillRect(-1, -1, 2, 2);
      context.restore();
    };
    shadow(1304, floorY + 3, 136, 15, 0.25);
    shadow(1268, floorY + 1, 48, 6, 0.58);

    context.drawImage(source, ...sourceBounds, ...targetBounds);
  }

  // Measure transparency only: keep every source color and effect unchanged.
  function balanceSceneArtwork(element, canvas) {
    try {
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = element.naturalWidth;
        canvas.height = element.naturalHeight;
        canvas.getContext("2d").drawImage(element, 0, 0);
      }
      const width = canvas.width, height = canvas.height;
      const pixels = canvas.getContext("2d").getImageData(0, 0, width, height).data;
      let left = width, top = height, right = -1, bottom = -1;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (pixels[(y * width + x) * 4 + 3] < 20) continue;
          left = Math.min(left, x); right = Math.max(right, x);
          top = Math.min(top, y); bottom = Math.max(bottom, y);
        }
      }
      if (right < left) return;
      const visibleWidth = right - left + 1;
      const visibleHeight = bottom - top + 1;
      element.style.setProperty("--art-center-x", ((left + right + 1) / 2 / width * 100) + "%");
      element.style.setProperty("--art-center-y", ((top + bottom + 1) / 2 / height * 100) + "%");
      element.style.setProperty("--art-panel-height", (62 * height / visibleHeight) + "%");
      element.style.setProperty("--art-width-cap", (27 * height / visibleWidth) + "vw");
      element.style.setProperty("--art-mobile-height", (220 * height / visibleHeight) + "px");
      element.style.setProperty("--art-mobile-cap", (78 * height / visibleWidth) + "vw");
      element.classList.add("guide-scene__balanced-art");
    } catch (error) {
      // Retain the existing layout if a source cannot be measured.
    }
  }


  // Keep the source cubes intact and rebuild only their floor treatment.
  // Coordinates refer to the original 2048 x 768 field-box artwork.
  function drawGroundedFieldBoxes(context, source, width, height) {
    const boxes = [
      { outline: [[1298,414],[1398,395],[1463,419],[1463,535],[1357,562],[1299,533]],
        base: [[1299,532],[1357,562],[1463,535],[1403,508]], floor: 562 },
      { outline: [[1554,418],[1620,395],[1718,414],[1715,541],[1655,564],[1554,536]],
        base: [[1554,535],[1655,564],[1715,541],[1620,514]], floor: 564 },
      { outline: [[1411,486],[1494,455],[1594,478],[1592,611],[1521,645],[1413,618]],
        base: [[1413,617],[1521,645],[1592,611],[1494,582]], floor: 645 },
    ];
    const scaleX = width / 2048;
    const scaleY = height / 768;
    const trace = function (target, points) {
      target.beginPath();
      points.forEach(function (point, index) {
        if (index === 0) target.moveTo(point[0] * scaleX, point[1] * scaleY);
        else target.lineTo(point[0] * scaleX, point[1] * scaleY);
      });
      target.closePath();
    };
    const cutouts = boxes.map(function (box) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const target = canvas.getContext("2d");
      if (!target) return null;
      target.save();
      trace(target, box.outline);
      target.clip();
      target.drawImage(source, 0, 0, width, height);
      target.restore();
      return canvas;
    });

    // A small amount of reflected color hugs each base without a mirrored streak.
    const bounceColors = ["rgba(215,225,232,0.09)", "rgba(148,34,221,0.13)", "rgba(0,143,201,0.13)"];
    boxes.forEach(function (box, index) {
      context.save();
      context.filter = "blur(" + (4 * scaleX) + "px)";
      context.strokeStyle = bounceColors[index];
      context.lineWidth = 7 * scaleX;
      trace(context, box.base);
      context.stroke();
      context.restore();
    });

    // Spread the cast shadow beyond the cube so it stays visible at site scale.
    boxes.forEach(function (box) {
      const centerX = box.base.reduce(function (sum, point) { return sum + point[0]; }, 0) / box.base.length;
      const centerY = box.base.reduce(function (sum, point) { return sum + point[1]; }, 0) / box.base.length;
      const cast = box.base.map(function (point) {
        return [centerX + (point[0] - centerX) * 1.18 - 16,
          centerY + (point[1] - centerY) * 1.18 + 14];
      });
      context.save();
      context.filter = "blur(" + (9 * scaleX) + "px)";
      context.fillStyle = "rgba(0,0,0,0.86)";
      trace(context, cast);
      context.fill();

      // A dense soft edge directly touches both visible bottom faces.
      context.filter = "blur(" + (3 * scaleX) + "px)";
      context.fillStyle = "rgba(0,0,0,0.92)";
      context.strokeStyle = "rgba(0,0,0,0.88)";
      context.lineWidth = 14 * scaleX;
      context.lineJoin = "round";
      trace(context, box.base);
      context.fill();
      context.stroke();
      context.restore();
    });
    cutouts.forEach(function (canvas) {
      if (canvas) context.drawImage(canvas, 0, 0);
    });
  }

  function createScene(scene, index) {
    const section = document.createElement("section");
    section.className = "guide-scene";
    section.style.setProperty("--scene-index", String(index));

    if (scene.revival) {
      section.classList.add("guide-scene--revival");
      const artwork = document.createElement("img");
      artwork.className = "revival__art";
      artwork.src = scene.revival;
      artwork.alt = "묘비 앞 땅에서 솟아오르는 플레이어의 손";
      artwork.width = 1265;
      artwork.height = 1244;
      artwork.decoding = "async";
      section.appendChild(artwork);
    }

    if (scene.steve) {
      section.classList.add("guide-scene--final-ready");
      const steve = document.createElement("img");
      steve.className = "final-ready__steve";
      steve.src = scene.steve;
      steve.alt = "정면을 바라보며 결의를 다지는 스티브";
      steve.width = 1145;
      steve.height = 1374;
      steve.decoding = "async";
      section.appendChild(steve);
    }

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

    if (scene.villager) {
      section.classList.add("guide-scene--token-shop");
      const villager = document.createElement("img");
      villager.className = "token-shop__villager";
      villager.src = scene.villager;
      villager.alt = "토큰상점 사서 주민";
      villager.width = 1373;
      villager.height = 1146;
      villager.decoding = "async";
      section.appendChild(villager);
    }

    if (scene.abilities && scene.abilities.length) {
      section.classList.add("guide-scene--support-abilities");

      const copy = document.createElement("div");
      copy.className = "support-ability__copy";

      const heading = document.createElement("div");
      heading.className = "support-ability__heading";

      const title = document.createElement("h3");
      title.textContent = scene.title;

      const controls = document.createElement("div");
      controls.className = "support-ability__controls";
      controls.setAttribute("aria-label", "보조능력 넘기기");

      const previous = document.createElement("button");
      previous.type = "button";
      previous.className = "support-ability__arrow";
      previous.setAttribute("aria-label", "이전 보조능력");
      previous.textContent = "<";

      const next = document.createElement("button");
      next.type = "button";
      next.className = "support-ability__arrow";
      next.setAttribute("aria-label", "다음 보조능력");
      next.textContent = ">";

      controls.appendChild(previous);
      controls.appendChild(next);
      heading.appendChild(title);

      const featuredName = document.createElement("p");
      featuredName.className = "support-ability__featured-name";
      const abilityNames = scene.abilities.map(function (ability) {
        const name = document.createElement("span");
        name.textContent = ability.name;
        featuredName.appendChild(name);
        return name;
      });
      heading.appendChild(featuredName);

      const description = document.createElement("p");
      description.className = "support-ability__description";

      // Overlap the descriptions in one grid cell so the longest text reserves
      // enough space at every viewport width without moving the title or icons.
      const abilityTexts = scene.abilities.map(function (ability) {
        const text = document.createElement("span");
        text.textContent = ability.description || "";
        description.appendChild(text);
        return text;
      });

      copy.appendChild(heading);
      copy.appendChild(description);

      const stage = document.createElement("div");
      stage.className = "support-ability__stage";
      stage.setAttribute("aria-live", "polite");
      stage.tabIndex = 0;
      stage.setAttribute("role", "region");
      stage.setAttribute("aria-roledescription", "carousel");

      const cardFrame = document.createElement("article");
      cardFrame.className = "support-ability__card";

      // Keep every image mounted and decoded, and reserve one stable slide area.
      const viewport = document.createElement("div");
      viewport.className = "support-ability__viewport";
      const captions = document.createElement("div");
      captions.className = "support-ability__viewport";
      const cardNames = [];
      const cards = scene.abilities.map(function (ability) {
        const card = document.createElement("div");
        card.className = "support-ability__slide";

        const icon = document.createElement("span");
        icon.className = "support-ability__icon";
        icon.setAttribute("aria-hidden", "true");

        const image = document.createElement("img");
        image.className = "support-ability__image";
        image.src = ability.image;
        image.alt = "";
        image.draggable = false;
        image.decoding = "async";
        image.width = 900;
        image.height = 900;
        if (typeof image.decode === "function") {
          image.decode().catch(function () {});
        }
        icon.appendChild(image);

        const name = document.createElement("h4");
        name.className = "support-ability__name support-ability__slide";
        name.textContent = ability.name;
        card.appendChild(icon);
        captions.appendChild(name);
        cardNames.push(name);
        viewport.appendChild(card);
        return card;
      });

      const count = document.createElement("span");
      count.className = "support-ability__count";
      count.setAttribute("aria-hidden", "true");

      cardFrame.appendChild(viewport);
      cardFrame.appendChild(captions);
      cardFrame.appendChild(count);
      stage.appendChild(previous);
      stage.appendChild(cardFrame);
      stage.appendChild(next);

      let currentAbility = 0;
      let isAnimatingAbility = false;

      const renderAbility = function () {
        const ability = scene.abilities[currentAbility];
        abilityNames.concat(cardNames).forEach(function (name, nameIndex) {
          const active = nameIndex % scene.abilities.length === currentAbility;
          name.setAttribute("data-active", String(active));
          name.setAttribute("aria-hidden", String(!active));
        });
        abilityTexts.forEach(function (text, textIndex) {
          const active = textIndex === currentAbility;
          text.setAttribute("data-active", String(active));
          text.setAttribute("aria-hidden", String(!active));
        });
        description.hidden = !ability.description;
        cards.forEach(function (card, cardIndex) {
          const active = cardIndex === currentAbility;
          card.setAttribute("data-active", String(active));
          card.setAttribute("aria-hidden", String(!active));
        });
        count.textContent =
          String(currentAbility + 1).padStart(2, "0") +
          " / " +
          String(scene.abilities.length).padStart(2, "0");
        stage.setAttribute("aria-label", ability.name + ", " + (currentAbility + 1) + " / " + scene.abilities.length);
        const controlsDisabled =
          scene.abilities.length <= 1 || isAnimatingAbility;
        previous.disabled = controlsDisabled;
        next.disabled = controlsDisabled;
      };

      const moveAbility = function (direction) {
        if (isAnimatingAbility || scene.abilities.length <= 1) return;

        const nextAbility =
          (currentAbility + direction + scene.abilities.length) %
          scene.abilities.length;
        const outgoing = cards[currentAbility];
        const incoming = cards[nextAbility];
        const outgoingText = abilityTexts[currentAbility];
        const incomingText = abilityTexts[nextAbility];
        const outgoingName = abilityNames[currentAbility];
        const incomingName = abilityNames[nextAbility];
        const textPairs = [
          [outgoingText, incomingText],
          [outgoingName, incomingName],
          [cardNames[currentAbility], cardNames[nextAbility]],
        ];
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion || typeof incoming.animate !== "function") {
          currentAbility = nextAbility;
          renderAbility();
          return;
        }

        isAnimatingAbility = true;
        outgoing.setAttribute("data-leaving", "true");
        textPairs.forEach(function (pair) {
          pair[0].setAttribute("data-leaving", "true");
          pair.forEach(function (element) { element.style.willChange = "opacity"; });
        });
        outgoing.style.willChange = "transform, opacity";
        incoming.style.willChange = "transform, opacity";
        currentAbility = nextAbility;
        renderAbility();

        // Keep the icon slide; fade all copy in place without overlapping readable text.
        const options = {
          duration: 450,
          easing: "cubic-bezier(0.2, 0.72, 0.28, 1)",
          fill: "both",
        };
        const animations = [];
        const finishTransition = function () {
          outgoing.removeAttribute("data-leaving");
          textPairs.forEach(function (pair) { pair[0].removeAttribute("data-leaving"); });
          animations.forEach(function (animation) { animation.cancel(); });
          [outgoing, incoming].concat(...textPairs).forEach(function (card) {
            card.style.removeProperty("will-change");
          });
          isAnimatingAbility = false;
          renderAbility();
        };

        try {
          const animatePair = function (oldElement, newElement, exitTransform, enterTransform, restingTransform) {
            animations.push(oldElement.animate(
              [
                { opacity: 1, transform: restingTransform, offset: 0 },
                { opacity: 0, transform: exitTransform, offset: 1 },
              ],
              options
            ));
            animations.push(newElement.animate(
              [
                { opacity: 0, transform: enterTransform, offset: 0 },
                { opacity: 1, transform: restingTransform, offset: 1 },
              ],
              options
            ));
          };
          animatePair(
            outgoing, incoming,
            "translate3d(" + (-direction * 100) + "%, 0, 0)",
            "translate3d(" + (direction * 100) + "%, 0, 0)",
            "translate3d(0, 0, 0)"
          );
          const textOptions = { duration: options.duration, easing: "linear", fill: "both" };
          textPairs.forEach(function (pair) {
            animations.push(pair[0].animate(
              [
                { opacity: 1, offset: 0, easing: "ease-out" },
                { opacity: 0, offset: 0.32 },
                { opacity: 0, offset: 1 },
              ],
              textOptions
            ));
            animations.push(pair[1].animate(
              [
                { opacity: 0, offset: 0 },
                { opacity: 0, offset: 0.32, easing: "ease-in-out" },
                { opacity: 1, offset: 0.9 },
                { opacity: 1, offset: 1 },
              ],
              textOptions
            ));
          });
          // Set one clock origin explicitly, even if frame creation spans a paint.
          const sharedStart = document.timeline && document.timeline.currentTime;
          if (typeof sharedStart === "number") {
            animations.forEach(function (animation) { animation.startTime = sharedStart; });
          }
          Promise.all(animations.map(function (animation) {
            return animation.finished;
          })).then(finishTransition, finishTransition);
        } catch (error) {
          finishTransition();
        }
      };

      previous.addEventListener("click", function () {
        moveAbility(-1);
      });

      next.addEventListener("click", function () {
        moveAbility(1);
      });

      stage.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        moveAbility(event.key === "ArrowLeft" ? -1 : 1);
      });

      let swipeStart = null;
      stage.addEventListener("touchstart", function (event) {
        swipeStart = event.touches.length === 1
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : null;
      }, { passive: true });
      stage.addEventListener("touchend", function (event) {
        if (!swipeStart || !event.changedTouches.length) return;
        const deltaX = event.changedTouches[0].clientX - swipeStart.x;
        const deltaY = event.changedTouches[0].clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(deltaX) >= 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
          moveAbility(deltaX < 0 ? 1 : -1);
        }
      }, { passive: true });
      stage.addEventListener("touchcancel", function () { swipeStart = null; }, { passive: true });

      renderAbility();
      content.appendChild(copy);
      content.appendChild(stage);
      section.appendChild(shade);
      section.appendChild(content);
      return section;
    }

    if (scene.diagram === "token-stations") {
      section.classList.add("guide-scene--token-station");

      const copy = document.createElement("div");
      copy.className = "token-station__copy";

      const title = document.createElement("h3");
      title.textContent = scene.title;

      const description = document.createElement("p");
      description.className = "guide-scene__description token-station__description";
      description.textContent = scene.description;

      const diagram = document.createElement("div");
      diagram.className = "token-station__diagram";
      diagram.setAttribute("aria-hidden", "true");
      diagram.innerHTML = [
        "<img class='token-station__art' src='./token-stations-orbit-transparent.png?v=1' alt='' loading='lazy' decoding='async'/>",
        "<svg class='token-station__overlay' viewBox='0 0 1448 1086' preserveAspectRatio='xMidYMid slice' role='presentation' focusable='false'>",
        "<defs>",
        "<filter id='token-station-mask-soften' x='-35%' y='-35%' width='170%' height='170%'>",
        "<feGaussianBlur stdDeviation='2.5'/>",
        "</filter>",
        "<mask id='token-station-diamond-mask' maskUnits='userSpaceOnUse' x='0' y='0' width='1448' height='1086'>",
        "<rect x='0' y='0' width='1448' height='1086' fill='#000'/>",
        "<g class='token-station__nodes'>",
        "<path class='token-station__node token-station__node--active' data-x='724' data-y='118' transform='translate(724 118)' d='M0 -52 C6 -18 18 -6 52 0 C18 6 6 18 0 52 C-6 18 -18 6 -52 0 C-18 -6 -6 -18 0 -52 Z' fill='#fff' filter='url(#token-station-mask-soften)'/>",
        "<path class='token-station__node' data-x='1028' data-y='244' transform='translate(1028 244)' d='M0 -52 C6 -18 18 -6 52 0 C18 6 6 18 0 52 C-6 18 -18 6 -52 0 C-18 -6 -6 -18 0 -52 Z' fill='#fff' filter='url(#token-station-mask-soften)'/>",
        "<path class='token-station__node' data-x='1142' data-y='522' transform='translate(1142 522)' d='M0 -52 C6 -18 18 -6 52 0 C18 6 6 18 0 52 C-6 18 -18 6 -52 0 C-18 -6 -6 -18 0 -52 Z' fill='#fff' filter='url(#token-station-mask-soften)'/>",
        "<path class='token-station__node token-station__node--active' data-x='1027' data-y='792' transform='translate(1027 792)' d='M0 -52 C6 -18 18 -6 52 0 C18 6 6 18 0 52 C-6 18 -18 6 -52 0 C-18 -6 -6 -18 0 -52 Z' fill='#fff' filter='url(#token-station-mask-soften)'/>",
        "<path class='token-station__node' data-x='724' data-y='913' transform='translate(724 913)' d='M0 -52 C6 -18 18 -6 52 0 C18 6 6 18 0 52 C-6 18 -18 6 -52 0 C-18 -6 -6 -18 0 -52 Z' fill='#fff' filter='url(#token-station-mask-soften)'/>",
        "<path class='token-station__node' data-x='420' data-y='792' transform='translate(420 792)' d='M0 -52 C6 -18 18 -6 52 0 C18 6 6 18 0 52 C-6 18 -18 6 -52 0 C-18 -6 -6 -18 0 -52 Z' fill='#fff' filter='url(#token-station-mask-soften)'/>",
        "<path class='token-station__node' data-x='304' data-y='522' transform='translate(304 522)' d='M0 -52 C6 -18 18 -6 52 0 C18 6 6 18 0 52 C-6 18 -18 6 -52 0 C-18 -6 -6 -18 0 -52 Z' fill='#fff' filter='url(#token-station-mask-soften)'/>",
        "<path class='token-station__node' data-x='418' data-y='244' transform='translate(418 244)' d='M0 -52 C6 -18 18 -6 52 0 C18 6 6 18 0 52 C-6 18 -18 6 -52 0 C-18 -6 -6 -18 0 -52 Z' fill='#fff' filter='url(#token-station-mask-soften)'/>",
        "</g>",
        "</mask>",
        "</defs>",
        "<image class='token-station__active-art' href='./token-stations-orbit-transparent.png?v=1' x='0' y='0' width='1448' height='1086' preserveAspectRatio='xMidYMid meet' mask='url(#token-station-diamond-mask)'/>",
        "</svg>",
      ].join("");

      const captureLabel = document.createElement("span");
      captureLabel.className = "token-station__capture";
      captureLabel.textContent = "점령!";
      diagram.appendChild(captureLabel);

      const stationNodes = Array.from(
        diagram.querySelectorAll(".token-station__node")
      );
      const setActiveStations = function (activeIndexes) {
        stationNodes.forEach(function (node, nodeIndex) {
          node.classList.toggle(
            "token-station__node--active",
            activeIndexes.indexOf(nodeIndex) !== -1
          );
        });
      };
      const showCaptureLabel = function (sourceIndex) {
        const source = stationNodes[sourceIndex];
        if (!source || typeof captureLabel.animate !== "function") return;

        captureLabel.getAnimations().forEach(function (animation) {
          animation.cancel();
        });
        const sourceX = Number(source.getAttribute("data-x"));
        const sourceY = Number(source.getAttribute("data-y"));
        captureLabel.style.left =
          ((sourceX - 184) / 10.8).toFixed(3) + "%";
        captureLabel.style.top = (sourceY / 10.8).toFixed(3) + "%";

        let startTransform =
          "translate3d(-50%, -290%, 0) scale(0.94)";
        let visibleTransform =
          "translate3d(-50%, -350%, 0) scale(1)";
        let holdTransform =
          "translate3d(-50%, -360%, 0) scale(1)";
        let exitTransform =
          "translate3d(-50%, -410%, 0) scale(0.97)";

        if (sourceX > 724) {
          startTransform = "translate3d(105%, -10%, 0) scale(0.96)";
          visibleTransform = "translate3d(105%, -50%, 0) scale(1)";
          holdTransform = "translate3d(105%, -50%, 0) scale(1)";
          exitTransform = "translate3d(105%, -90%, 0) scale(0.98)";
        } else if (sourceX < 724) {
          startTransform = "translate3d(-205%, -10%, 0) scale(0.96)";
          visibleTransform = "translate3d(-205%, -50%, 0) scale(1)";
          holdTransform = "translate3d(-205%, -50%, 0) scale(1)";
          exitTransform = "translate3d(-205%, -90%, 0) scale(0.98)";
        }

        captureLabel.animate(
          [
            { opacity: 0, transform: startTransform },
            {
              opacity: 1,
              transform: visibleTransform,
              offset: 0.2,
            },
            {
              opacity: 1,
              transform: holdTransform,
              offset: 0.76,
            },
            { opacity: 0, transform: exitTransform },
          ],
          {
            duration: 2250,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          }
        );
      };

      const reduceTokenMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!reduceTokenMotion) {
        const animationSteps = [
          { delay: 3000, source: 0, active: [6, 3] },
          { delay: 2625, source: 3, active: [6, 5] },
          { delay: 2625, source: 6, active: [1, 5] },
          { delay: 2625, source: 5, active: [1, 7] },
          { delay: 2625, active: [0, 1, 2, 3, 4, 5, 6, 7] },
          { delay: 3000, active: [0, 3] },
        ];
        let animationStep = 0;

        const queueTokenStep = function () {
          const step = animationSteps[animationStep];
          window.setTimeout(function () {
            if (!section.isConnected) return;

            if (typeof step.source === "number") {
              showCaptureLabel(step.source);
            }
            setActiveStations(step.active);
            animationStep = (animationStep + 1) % animationSteps.length;
            queueTokenStep();
          }, step.delay);
        };

        queueTokenStep();
      }

      copy.appendChild(title);
      copy.appendChild(description);
      content.appendChild(copy);
      content.appendChild(diagram);
      section.appendChild(shade);
      section.appendChild(content);
      return section;
    }

    if (scene.title === "3. 토큰시스템") {
      section.classList.add("guide-scene--token-system");

      const iconCanvas = document.createElement("canvas");
      iconCanvas.className = "token-system__icon-layer";
      iconCanvas.setAttribute("aria-hidden", "true");

      const iconSource = new Image();
      iconSource.decoding = "async";
      iconSource.onload = function () {
        const width = iconSource.naturalWidth;
        const height = iconSource.naturalHeight;
        const context = iconCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (!context || !width || !height) return;

        iconCanvas.width = width;
        iconCanvas.height = height;
        context.drawImage(iconSource, 0, 0);

        const imageData = context.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        for (let offset = 0; offset < pixels.length; offset += 4) {
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          const pixelIndex = offset / 4;
          const x = pixelIndex % width;
          const y = Math.floor(pixelIndex / width);
          const greenDominance = green - Math.max(red, blue);
          const brightness = (red + green + blue) / 3;
          const insideHighlight =
            x > width * 0.6 &&
            x < width * 0.75 &&
            y > height * 0.34 &&
            y < height * 0.82;

          let alpha = Math.max(
            0,
            Math.min(255, (greenDominance - 3) * 12)
          );

          if (insideHighlight && brightness > 165) {
            alpha = Math.max(
              alpha,
              Math.min(255, (brightness - 165) * 5)
            );
          }

          pixels[offset + 3] = Math.min(
            pixels[offset + 3],
            Math.round(alpha)
          );
        }

        context.putImageData(imageData, 0, 0);
        balanceSceneArtwork(iconCanvas, iconCanvas);
      };
      iconSource.src = "./scene-token-system-v10.png";
      section.appendChild(iconCanvas);
    }

    const isolatedSceneIcons = {
      "1. 준비": {
        src: "./scene-preparation-check-v2.svg",
        directImage: true,
        alt: "마인크래프트 스타일 픽셀 체크표시",
        anchorX: 0.673,
      },
      "2. 능력 추첨": {
        src: "./scene-ability-question-v3.svg",
        directImage: true,
        alt: "마인크래프트 스타일 입체 픽셀 물음표",
        anchorX: 0.673,
      },
      "3. 인첸트": {
        src: "./scene-enchant-supplied-shadow-v4.png",
        directImage: true,
        bounds: [0.5, 0.81, 0.16, 0.99],
        focus: [0.65, 0.67, 0.17, 0.44],
        precut: true,
        anchorX: 0.65,
        colorFloor: 10,
        colorSolid: 22,
        brightnessFloor: 125,
        brightnessSolid: 155,
        contrastFloor: 7,
        contrastWeight: 0,
        alphaFloor: 26,
      },
      "1. 자기장": {
        src: "./scene-magnetic-v5.png",
        bounds: [0.48, 0.83, 0.14, 0.99],
        focus: [0.65, 0.67, 0.2, 0.43],
        anchorX: 0.65,
        colorFloor: 2,
        colorSolid: 256,
        brightnessFloor: 108,
        brightnessSolid: 256,
        contrastFloor: 7,
        contrastWeight: 0,
        alphaFloor: 0,
      },
      "2. 필드상자": {
        src: "./scene-field-box-v10.png",
        groundedFieldBoxes: true,
        bounds: [0.55, 0.9, 0.18, 0.995],
        focus: [0.74, 0.7, 0.18, 0.42],
        anchorX: 0.74,
        colorFloor: 10,
        colorSolid: 22,
        brightnessFloor: 110,
        brightnessSolid: 140,
        contrastFloor: 7,
        contrastWeight: 0,
        alphaFloor: 30,
      },
    };
    const isolatedIcon = isolatedSceneIcons[scene.title];

    if (isolatedIcon && isolatedIcon.directImage) {
      section.classList.add("guide-scene--isolated-icon");
      const suppliedImage = document.createElement("img");
      suppliedImage.className = "guide-scene__isolated-icon";
      suppliedImage.onload = function () { balanceSceneArtwork(suppliedImage); };
      suppliedImage.src = isolatedIcon.src;
      suppliedImage.alt = isolatedIcon.alt || "첨부한 인첸트 테이블 이미지";
      suppliedImage.width = 2172;
      suppliedImage.height = 724;
      suppliedImage.decoding = "async";
      suppliedImage.style.maxWidth = "none";
      suppliedImage.style.opacity = "1";
      suppliedImage.style.setProperty(
        "--scene-icon-anchor", `${isolatedIcon.anchorX * 100}%`
      );
      section.appendChild(suppliedImage);
    } else if (isolatedIcon) {
      section.classList.add("guide-scene--isolated-icon");

      const iconCanvas = document.createElement("canvas");
      iconCanvas.className = "guide-scene__isolated-icon";
      iconCanvas.setAttribute("aria-hidden", "true");
      iconCanvas.style.setProperty(
        "--scene-icon-anchor",
        `${isolatedIcon.anchorX * 100}%`
      );

      const iconSource = new Image();
      iconSource.decoding = "async";
      iconSource.onload = function () {
        const width = iconSource.naturalWidth;
        const height = iconSource.naturalHeight;
        const context = iconCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (!context || !width || !height) return;

        iconCanvas.width = width;
        iconCanvas.height = height;
        if (isolatedIcon.groundedFieldBoxes) {
          drawGroundedFieldBoxes(context, iconSource, width, height);
          balanceSceneArtwork(iconCanvas, iconCanvas);
          return;
        }
        if (isolatedIcon.groundedSword) {
          drawGroundedSword(context, iconSource, width, height);
          balanceSceneArtwork(iconCanvas, iconCanvas);
          return;
        }
        context.drawImage(iconSource, 0, 0);
        if (isolatedIcon.precut) {
          balanceSceneArtwork(iconCanvas, iconCanvas);
          return;
        }

        const softenedCanvas = document.createElement("canvas");
        softenedCanvas.width = width;
        softenedCanvas.height = height;
        const softenedContext = softenedCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (!softenedContext) return;

        softenedContext.filter = "blur(18px)";
        softenedContext.drawImage(iconSource, 0, 0);
        const softenedPixels = softenedContext.getImageData(
          0,
          0,
          width,
          height
        ).data;

        const imageData = context.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        const bounds = isolatedIcon.bounds;
        const featherX = 0.022;
        const featherY = 0.045;

        for (let offset = 0; offset < pixels.length; offset += 4) {
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          const pixelIndex = offset / 4;
          const xRatio = (pixelIndex % width) / width;
          const yRatio = Math.floor(pixelIndex / width) / height;
          const insideBounds =
            xRatio > bounds[0] &&
            xRatio < bounds[1] &&
            yRatio > bounds[2] &&
            yRatio < bounds[3];

          if (!insideBounds) {
            pixels[offset + 3] = 0;
            continue;
          }

          const highest = Math.max(red, green, blue);
          const lowest = Math.min(red, green, blue);
          const chroma = highest - lowest;
          const brightness = (red + green + blue) / 3;
          const localContrast =
            (Math.abs(red - softenedPixels[offset]) +
              Math.abs(green - softenedPixels[offset + 1]) +
              Math.abs(blue - softenedPixels[offset + 2])) /
            3;
          const colorAlpha = Math.max(
            0,
            Math.min(255, (chroma - isolatedIcon.colorFloor) * 14)
          );
          const brightAlpha = Math.max(
            0,
            Math.min(
              255,
              (brightness - isolatedIcon.brightnessFloor) * 5.5
            )
          );
          const contrastAlpha =
            Math.max(
              0,
              Math.min(
                255,
                (localContrast - isolatedIcon.contrastFloor) * 16
              )
            ) * isolatedIcon.contrastWeight;
          const focus = isolatedIcon.focus;
          const focusDistance = Math.sqrt(
            Math.pow((xRatio - focus[0]) / focus[2], 2) +
              Math.pow((yRatio - focus[1]) / focus[3], 2)
          );
          const focusFeather = Math.max(
            0,
            Math.min(1, (1.08 - focusDistance) / 0.18)
          );
          const edgeFeather = Math.max(
            0,
            Math.min(
              1,
              (xRatio - bounds[0]) / featherX,
              (bounds[1] - xRatio) / featherX,
              (yRatio - bounds[2]) / featherY,
              (bounds[3] - yRatio) / featherY
            )
          );

          const solidPixel =
            chroma >= isolatedIcon.colorSolid ||
            brightness >= isolatedIcon.brightnessSolid;
          const rawAlpha =
            (solidPixel
              ? 255
              : Math.max(colorAlpha, brightAlpha, contrastAlpha)) *
            edgeFeather *
            focusFeather;
          const cleanedAlpha =
            isolatedIcon.alphaFloor > 0
              ? Math.max(
                  0,
                  Math.min(
                    255,
                    (rawAlpha - isolatedIcon.alphaFloor) *
                      (255 / (255 - isolatedIcon.alphaFloor))
                  )
                )
              : rawAlpha;

          pixels[offset + 3] = Math.min(
            pixels[offset + 3],
            Math.round(cleanedAlpha)
          );
        }

        context.putImageData(imageData, 0, 0);
        balanceSceneArtwork(iconCanvas, iconCanvas);
      };
      iconSource.src = isolatedIcon.src;
      section.appendChild(iconCanvas);
    }

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
  closeGuide();

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


