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
          description: "맵 곳곳에있는 토큰생성소를 점령하여\n토큰을 획득하고 상점에서 필요한 아이템을 구입할 수 있습니다",
        },
        {
          title: "3-1. 토큰생성소",
          description: "- 토큰생성소는 총 8개입니다\n- 토큰생성소에 일정 시간 머무르면 자동으로 점령되며 충전된 토큰이 지급됩니다\n- 토큰생성소 점령 도중 다른 플레이어가 들어올 경우 점령은 취소됩니다\n- 토큰생성소에 토큰은 최대 5개까지 충전됩니다\n- 2개밖에 충전되지 않은 토큰생성소를 점령시 토큰 2개만 획득할 수 있습니다\n- 게임시작시 8개 중 2개만 활성화되며, 누군가 토큰 생성소 점령 완료 했을 경우 다른 토큰생성소가 활성화 됩니다\n- 일정시간 이후에는 모든 토큰생성소가 활성화됩니다",
          diagram: "token-stations",
        },
      ],
    },
    "other-systems": {
      label: "보조 능력",
      scenes: [
        {
          title: "보조 능력 소개",
          abilities: [
            {
              name: "보조 능력 01",
              description: "보조 능력에 대한 설명이 이곳에 표시됩니다.",
              icon: "?",
            },
            {
              name: "보조 능력 02",
              description: "두 번째 보조 능력에 대한 임시 설명입니다.",
              icon: "!",
            },
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
      controls.setAttribute("aria-label", "보조 능력 넘기기");

      const previous = document.createElement("button");
      previous.type = "button";
      previous.className = "support-ability__arrow";
      previous.setAttribute("aria-label", "이전 보조 능력");
      previous.textContent = "<";

      const next = document.createElement("button");
      next.type = "button";
      next.className = "support-ability__arrow";
      next.setAttribute("aria-label", "다음 보조 능력");
      next.textContent = ">";

      controls.appendChild(previous);
      controls.appendChild(next);
      heading.appendChild(title);

      const description = document.createElement("p");
      description.className = "support-ability__description";

      const abilityName = document.createElement("strong");
      const abilityText = document.createElement("span");
      description.appendChild(abilityName);
      description.appendChild(abilityText);

      copy.appendChild(heading);
      copy.appendChild(description);

      const stage = document.createElement("div");
      stage.className = "support-ability__stage";
      stage.setAttribute("aria-live", "polite");

      const card = document.createElement("article");
      card.className = "support-ability__card";

      const icon = document.createElement("span");
      icon.className = "support-ability__icon";
      icon.setAttribute("aria-hidden", "true");

      const count = document.createElement("span");
      count.className = "support-ability__count";
      count.setAttribute("aria-hidden", "true");

      card.appendChild(icon);
      card.appendChild(count);
      stage.appendChild(previous);
      stage.appendChild(card);
      stage.appendChild(next);

      let currentAbility = 0;
      let isAnimatingAbility = false;

      const renderAbility = function () {
        const ability = scene.abilities[currentAbility];
        abilityName.textContent = ability.name;
        abilityText.textContent = ability.description;
        icon.textContent = ability.icon || "?";
        count.textContent =
          String(currentAbility + 1).padStart(2, "0") +
          " / " +
          String(scene.abilities.length).padStart(2, "0");
        stage.setAttribute("aria-label", ability.name + ": " + ability.description);
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
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (
          reduceMotion ||
          typeof card.animate !== "function" ||
          typeof description.animate !== "function"
        ) {
          currentAbility = nextAbility;
          renderAbility();
          return;
        }

        isAnimatingAbility = true;
        card.style.willChange = "transform, opacity";
        description.style.willChange = "transform, opacity";
        renderAbility();

        const exitDistance = direction > 0 ? -44 : 44;
        const enterDistance = -exitDistance;
        const exitAnimation = card.animate(
          [
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
            {
              opacity: 0,
              transform:
                "translate3d(" + exitDistance + "px, 0, 0) scale(0.97)",
            },
          ],
          {
            duration: 220,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "both",
          }
        );
        const exitDescriptionAnimation = description.animate(
          [
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
            { opacity: 0, transform: "translate3d(0, 8px, 0)" },
          ],
          {
            duration: 180,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "both",
          }
        );

        Promise.all([
          exitAnimation.finished,
          exitDescriptionAnimation.finished,
        ])
          .then(function () {
            exitAnimation.cancel();
            exitDescriptionAnimation.cancel();
            currentAbility = nextAbility;
            renderAbility();

            const enterAnimation = card.animate(
              [
                {
                  opacity: 0,
                  transform:
                    "translate3d(" + enterDistance + "px, 0, 0) scale(0.97)",
                },
                { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
              ],
              {
                duration: 340,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "both",
              }
            );
            const enterDescriptionAnimation = description.animate(
              [
                { opacity: 0, transform: "translate3d(0, -8px, 0)" },
                { opacity: 1, transform: "translate3d(0, 0, 0)" },
              ],
              {
                duration: 320,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "both",
              }
            );

            return Promise.all([
              enterAnimation.finished,
              enterDescriptionAnimation.finished,
            ]).then(function () {
              enterAnimation.cancel();
              enterDescriptionAnimation.cancel();
            });
          })
          .then(function () {
            card.style.removeProperty("will-change");
            description.style.removeProperty("will-change");
            isAnimatingAbility = false;
            renderAbility();
          })
          .catch(function () {
            [card, description].forEach(function (element) {
              element.getAnimations().forEach(function (animation) {
                animation.cancel();
              });
              element.style.removeProperty("will-change");
              element.style.removeProperty("transform");
              element.style.removeProperty("opacity");
            });
            isAnimatingAbility = false;
            renderAbility();
          });
      };

      previous.addEventListener("click", function () {
        moveAbility(-1);
      });

      next.addEventListener("click", function () {
        moveAbility(1);
      });

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
        "<svg viewBox='0 0 600 600' role='presentation' focusable='false'>",
        "<defs>",
        "<filter id='token-station-glow' x='-40%' y='-40%' width='180%' height='180%'>",
        "<feGaussianBlur stdDeviation='10' result='blur'/>",
        "<feMerge><feMergeNode in='blur'/><feMergeNode in='SourceGraphic'/></feMerge>",
        "</filter>",
        "<radialGradient id='token-station-white' cx='38%' cy='30%' r='72%'>",
        "<stop offset='0%' stop-color='#ffffff'/><stop offset='100%' stop-color='#dbe9ff'/>",
        "</radialGradient>",
        "<radialGradient id='token-station-yellow' cx='38%' cy='30%' r='72%'>",
        "<stop offset='0%' stop-color='#fff774'/><stop offset='100%' stop-color='#ffd900'/>",
        "</radialGradient>",
        "</defs>",
        "<circle class='token-station__ring' cx='300' cy='300' r='210'/>",
        "<g class='token-station__nodes'>",
        "<circle class='token-station__node token-station__node--active' cx='300' cy='90' r='16'/>",
        "<circle class='token-station__node' cx='448' cy='152' r='16'/>",
        "<circle class='token-station__node' cx='510' cy='300' r='16'/>",
        "<circle class='token-station__node token-station__node--active' cx='448' cy='448' r='16'/>",
        "<circle class='token-station__node' cx='300' cy='510' r='16'/>",
        "<circle class='token-station__node' cx='152' cy='448' r='16'/>",
        "<circle class='token-station__node' cx='90' cy='300' r='16'/>",
        "<circle class='token-station__node' cx='152' cy='152' r='16'/>",
        "</g>",
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
        const sourceX = Number(source.getAttribute("cx"));
        const sourceY = Number(source.getAttribute("cy"));
        captureLabel.style.left = (sourceX / 6).toFixed(3) + "%";
        captureLabel.style.top = (sourceY / 6).toFixed(3) + "%";

        let startTransform =
          "translate3d(-50%, -190%, 0) scale(0.94)";
        let visibleTransform =
          "translate3d(-50%, -250%, 0) scale(1)";
        let holdTransform =
          "translate3d(-50%, -260%, 0) scale(1)";
        let exitTransform =
          "translate3d(-50%, -290%, 0) scale(0.97)";

        if (sourceX > 300) {
          startTransform = "translate3d(85%, -10%, 0) scale(0.96)";
          visibleTransform = "translate3d(85%, -50%, 0) scale(1)";
          holdTransform = "translate3d(85%, -50%, 0) scale(1)";
          exitTransform = "translate3d(85%, -90%, 0) scale(0.98)";
        } else if (sourceX < 300) {
          startTransform = "translate3d(-185%, -10%, 0) scale(0.96)";
          visibleTransform = "translate3d(-185%, -50%, 0) scale(1)";
          holdTransform = "translate3d(-185%, -50%, 0) scale(1)";
          exitTransform = "translate3d(-185%, -90%, 0) scale(0.98)";
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
              offset: 0.8,
            },
            { opacity: 0, transform: exitTransform },
          ],
          {
            duration: 3400,
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
          { delay: 6000, source: 0, active: [6, 3] },
          { delay: 5000, source: 3, active: [6, 5] },
          { delay: 5000, source: 6, active: [1, 5] },
          { delay: 5000, source: 5, active: [1, 7] },
          { delay: 5000, active: [0, 1, 2, 3, 4, 5, 6, 7] },
          { delay: 6000, active: [0, 3] },
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


