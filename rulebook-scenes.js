(function () {
  "use strict";

  // Keep the supplied shop artwork and its responsive placement together.
  const shopStyle = document.createElement("style");
  shopStyle.textContent = `
    #guide .guide-scene--token-shop .token-shop__villager {
      top: 50%; bottom: auto; transform: translateY(-50%);
      width: 34%; max-width: 680px; height: auto; object-position: center;
    }
    #guide .guide-scene--token-shop .guide-scene__content {
      padding-right: 43%;
    }
    #guide .guide-scene--token-shop .guide-scene__description {
      white-space: pre-line; overflow-wrap: break-word;
    }
    @media (max-width: 1100px) {
      #guide .guide-scene--token-shop .guide-scene__content {
        grid-row: 1; padding: 30px 22px 24px;
      }
      #guide .guide-scene--token-shop .token-shop__villager {
        position: relative; grid-row: 2; top: auto; right: auto; bottom: auto;
        width: calc(100% - 44px); max-width: 680px; height: auto;
        margin: 0 auto 30px; transform: none;
      }
    }
  `;
  document.head.appendChild(shopStyle);


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
          description: "맵 곳곳에있는 토큰생성소를 점령하거나 다른 플레이어를 처치하여 토큰(2개)을 획득하고 상점에서 필요한 아이템을 구입할 수 있습니다",
        },
        {
          title: "3-1. 토큰생성소",
          description: "- 토큰생성소는 총 8개입니다\n- 토큰생성소에 일정 시간 머무르면 자동으로 점령되며 충전된 토큰이 지급됩니다\n- 토큰생성소 점령 도중 다른 플레이어가 들어올 경우 점령은 취소됩니다\n- 토큰생성소에 토큰은 최대 5개까지 충전됩니다\n- 2개밖에 충전되지 않은 토큰생성소를 점령시 토큰 2개만 획득할 수 있습니다\n- 게임시작시 8개 중 2개만 활성화되며, 누군가 토큰 생성소 점령 완료 했을 경우 다른 토큰생성소가 활성화 됩니다\n- 일정시간 이후에는 모든 토큰생성소가 활성화됩니다",
          diagram: "token-stations",
        },
        {
          title: "3-2. 토큰상점",
          description: "- 토큰상점은 맵 중앙 단 하나 존재하며 언제든 사용 가능합니다\n- 토큰상점 주변은 중립지대이며 진입하는 모든 플레이어는 저항효과를 얻습니다\n- 판매품목은 전술 아이템/고급 능력 리롤권/보조능력이 있습니다\n- 전술 아이템은 전투에 필요한 기본적인 아이템들이 있습니다\n- 고급 능력 리롤권은 준수한 성능 이상의 능력으로 리롤할 수 있습니다\n- 보조능력은 처음 추첨한 능력 이외에 전투에 도움이 되는 간단한 보조능력입니다\n- 보조능력은 중복으로 구매할 수 없으며 새로운 보조능력 구매시 이전 보조능력은 사라집니다",
          villager: "data:image/png;base64,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",
        },
        {
          title: "4. 부활시스템",
          description: "- 게임 시작 후 일정시간 동안은 처치당해도 부활이 가능합니다\n- 처치 당했을시 주능력, 기본템 및 보유하고 있던 토큰을 제외하고 모두 시체상자에 드랍합니다\n- 일정시간 이후 부활이 불가능하며 이때 처치당할 시 탈락 처리됩니다",
          revival: "./revival-gravestone.png",
        },
      ],
    },
    "other-systems": {
      label: "보조능력 및 기타시스템",
      scenes: [
        {
          title: "보조능력 소개",
          abilities: [
            { name: "상승 기류", category: "mobility", image: "./support-updraft.webp", description: "사용 시 높게 뛰어오르며 그 순간만 낙하 피해를 무효화합니다." },
            { name: "돌풍 질주", category: "mobility", image: "./support-gust-dash.webp", description: "바라보는 수평 방향으로 빠르게 돌진합니다." },
            { name: "비상 가속", category: "survival", image: "./support-emergency-boost.webp", description: "피해를 받고 체력이 일정 체력 이하가 되면 일정 시간 동안 빠른 이동 속도를 얻습니다." },
            { name: "생명 포식", category: "survival", image: "./support-life-devour.webp", description: "다른 플레이어를 처치하면 일시적으로 재생효과를 얻습니다." },
            { name: "정화 장막", category: "survival", image: "./support-purifying-barrier.webp", description: "사용 시 본인에게 적용되는 해로운 효과들을 일시적으로 막습니다." },
            { name: "위치 투영기", category: "information", image: "./support-position-projector.webp", description: "사용시 일정 반경 이내 다른 플레이어들의 위치를 잔상으로 남깁니다" },
            { name: "생체 분석기", category: "information", image: "./support-bio-analyzer.webp", description: "다른 플레이어들의 남은 체력을 확인할 수 있습니다." },
            { name: "고속 추출기", category: "resource", image: "./support-high-speed-extractor.webp", description: "토큰 생성소 점령시간이 절반으로 줄어듭니다." },
            { name: "현상금 증폭기", category: "resource", image: "./support-bounty-amplifier.webp", description: "플레이어 처치 보상이 토큰 2개에서 3개로 증가합니다." },
            { name: "광역 탐색기", category: "resource", image: "./support-wide-area-scanner.webp", description: "필드상자 감지 범위를 2배 증가시킵니다." },
          ],
        },
        {
          title: "PVP 시스템",
          cornerArt: { kind: "pvp", src: "./scene-pvp-swords-v2.png", alt: "교차한 마인크래프트 검과 PVP 글자", width: 1254, height: 1254 },
          description: "- PVP를 못하셔도 괜찮습니다!\n- 연타 시스템 도입으로 마우스를 광클해도 최대 데미지로 타격할 수 있습니다",
        },
        {
          title: "점프패드",
          cornerArt: { kind: "jump-pad", src: "./scene-jump-pad-v2.png", alt: "초록색 화살표가 솟아오르는 마인크래프트 점프패드", width: 1254, height: 1254 },
          description: "- 맵 곳곳에는 점프패드가 있습니다\n- 점프패드별로 점프 높이가 다릅니다\n- 점프패드로 떨어지면 낙하피해를 입지 않습니다",
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
    stats.setAttribute("aria-label", "41개의 능력 20분의 시간 1명의 생존자");

    [
      { number: "41", label: "개의 능력" },
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
    const collectionNotice = document.querySelector(".collection__heading > p");
    if (collectionNotice && collectionNotice.textContent !== "추가 예정") {
      collectionNotice.textContent = "추가 예정";
    }

    // Keep the launcher action present after React replaces the initial HTML.
    const heroActions = document.querySelector(".hero__actions");
    if (heroActions && !heroActions.querySelector(".launcher-download")) {
      const download = document.createElement("a");
      download.className = "primary-button launcher-download";
      download.href = "https://drive.google.com/file/d/1X9WeHQPAHwNyIzLri-WAyy2JafIur5Op/view?usp=drivesdk";
      const label = document.createElement("span");
      label.textContent = "런쳐 다운로드";
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 20 20");
      icon.setAttribute("aria-hidden", "true");
      const path = document.createElementNS(icon.namespaceURI, "path");
      path.setAttribute("d", "M10 3v10M6 9l4 4 4-4M4 14v3h12v-3");
      icon.appendChild(path);
      download.append(label, icon);
      heroActions.appendChild(download);
    }

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

  // Composite a floor shadow beneath the unchanged supplied question-mark image.
  function drawGroundedQuestion(context, source, width, height) {
    context.save();
    context.scale(width / 1254, height / 1254);
    context.translate(635, 1090);
    context.scale(180, 40);
    const shadow = context.createRadialGradient(0, 0, 0, 0, 0, 1);
    shadow.addColorStop(0, "rgba(0, 0, 0, 0.62)");
    shadow.addColorStop(0.45, "rgba(0, 0, 0, 0.35)");
    shadow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = shadow;
    context.fillRect(-1, -1, 2, 2);
    context.restore();

    context.save();
    context.scale(width / 1254, height / 1254);
    context.filter = "blur(8px)";
    context.fillStyle = "rgba(0, 0, 0, 0.58)";
    context.beginPath();
    context.moveTo(492, 1061);
    context.lineTo(651, 1109);
    context.lineTo(767, 1061);
    context.lineTo(610, 1024);
    context.closePath();
    context.fill();
    context.restore();
    context.drawImage(source, 0, 0, width, height);
  }

  function createScene(scene, index) {
    const section = document.createElement("section");
    section.className = "guide-scene";
    section.style.setProperty("--scene-index", String(index));

    if (scene.cornerArt) {
      section.classList.add("guide-scene--corner-art", "guide-scene--" + scene.cornerArt.kind);
      const artwork = document.createElement("img");
      artwork.className = "guide-scene__corner-art";
      artwork.src = scene.cornerArt.src;
      artwork.alt = scene.cornerArt.alt;
      artwork.width = scene.cornerArt.width;
      artwork.height = scene.cornerArt.height;
      artwork.decoding = "async";
      const layout = document.createElement("div");
      layout.className = "guide-scene__corner-layout";
      const stage = document.createElement("div");
      stage.className = "guide-scene__corner-stage";
      stage.appendChild(artwork);
      layout.appendChild(stage);
      section.appendChild(layout);
    }

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
      villager.alt = "토큰상점: 일반 전술아이템, 보조능력, 고급 능력 리롤권";
      villager.width = 340;
      villager.height = 144;
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
      const categoryLabels = { mobility: "이동", survival: "생존", information: "정보", resource: "자원" };
      const appendAbilityName = function (element, ability) {
        element.classList.add("support-ability__name-row");
        const badge = document.createElement("span");
        badge.className = "support-ability__category";
        badge.setAttribute("data-category", ability.category);
        badge.textContent = categoryLabels[ability.category];
        const label = document.createElement("span");
        label.className = "support-ability__name-label";
        label.textContent = ability.name;
        element.appendChild(badge);
        element.appendChild(label);
      };
      const abilityNames = scene.abilities.map(function (ability) {
        const name = document.createElement("span");
        appendAbilityName(name, ability);
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
        appendAbilityName(name, ability);
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

// Measure the existing artwork first so softer floor edges do not resize the emerald.
        context.putImageData(imageData, 0, 0);
        balanceSceneArtwork(iconCanvas, iconCanvas);
        const smoothstep = function (from, to, value) {
          const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
          return t * t * (3 - 2 * t);
        };
        for (let offset = 0; offset < pixels.length; offset += 4) {
          const x = ((offset / 4) % width) / width;
          const y = Math.floor(offset / 4 / width) / height;
          // Keep every emerald pixel intact; fade only the surrounding floor.
          const belowIcon = smoothstep(0.795, 0.815, y);
          const outsideIcon = smoothstep(0.047, 0.08, Math.abs(x - 0.704));
          const floorOnly = Math.max(belowIcon, outsideIcon * smoothstep(0.73, 0.79, y));
          const sideFade = 1 - smoothstep(0.033, 0.091, Math.abs(x - 0.704));
          const endFade = 1 - smoothstep(0.82, 0.995, y);
          const floorOpacity = sideFade * endFade * 0.78;
          pixels[offset + 3] = Math.round(pixels[offset + 3] * (1 - floorOnly + floorOnly * floorOpacity));
        }
        context.putImageData(imageData, 0, 0);

      };
      iconSource.src = "./scene-token-system-v10.png";
      section.appendChild(iconCanvas);
    }

    const isolatedSceneIcons = {
      "1. 준비": {
        src: "./scene-preparation-check-supplied-v1.png",
        width: 1254,
        height: 1254,
        directImage: true,
        alt: "마인크래프트 스타일 픽셀 체크표시",
        anchorX: 0.673,
      },
      "2. 능력 추첨": {
        src: "./scene-ability-question-supplied-v1.png",
        groundedQuestion: true,
        alt: "마인크래프트 스타일 입체 픽셀 물음표",
        anchorX: 0.673,
      },
      "3. 인첸트": {
        src: "./scene-enchant-supplied-v5.png",
        width: 1402,
        height: 1122,
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
      suppliedImage.width = isolatedIcon.width || 2172;
      suppliedImage.height = isolatedIcon.height || 724;
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
        if (isolatedIcon.groundedQuestion) {
          drawGroundedQuestion(context, iconSource, width, height);
          balanceSceneArtwork(iconCanvas, iconCanvas);
          return;
        }
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

