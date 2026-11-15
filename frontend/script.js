document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Navegação por rolagem ---------- */
  // targetId: null = volta para o topo da página
  const escrolar = [
    { btnId: "ini", targetId: null },
    { btnId: "sm", targetId: "saiba" },
    { btnId: "sn", targetId: "sobr" },
    { btnId: "jog", targetId: "jogar" },
    { btnId: "mais", targetId: "saiba" },
    { btnId: "nos", targetId: "sobr" },
    { btnId: "jogue", targetId: "jogar" },
  ];

  // itens do menu superior e a seção que cada um representa (em ordem)
  const itensMenu = [
    { id: "ini", targetId: null },
    { id: "sm", targetId: "saiba" },
    { id: "sn", targetId: "sobr" },
    { id: "jog", targetId: "jogar" },
  ]
    .map((i) => ({ ...i, el: document.getElementById(i.id) }))
    .filter((i) => i.el);

  function marcarAtivo(id) {
    itensMenu.forEach((i) => i.el.classList.toggle("ativo", i.id === id));
  }

  function irPara(targetId) {
    if (targetId === null) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const alvo = document.getElementById(targetId);
    if (alvo) alvo.scrollIntoView({ behavior: "smooth" });
  }

  escrolar.forEach((item) => {
    const el = document.getElementById(item.btnId);
    if (!el) return;
    if (item.targetId !== null && !document.getElementById(item.targetId)) return;

    el.addEventListener("click", () => {
      irPara(item.targetId);
      if (el.closest(".navbar")) marcarAtivo(item.btnId);
    });
  });

  // itens do menu acessíveis pelo teclado
  itensMenu.forEach((i) => {
    i.el.setAttribute("tabindex", "0");
    i.el.setAttribute("role", "link");
    i.el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        i.el.click();
      }
    });
  });

  // destaca no menu a seção que está na tela
  function atualizarMenu() {
    if (!itensMenu.length) return;
    const header = document.querySelector("header");
    const limite = (header ? header.offsetHeight : 0) + 80;
    let atual = "ini";

    itensMenu.forEach((i) => {
      if (i.targetId === null) return;
      const secao = document.getElementById(i.targetId);
      if (secao && secao.getBoundingClientRect().top <= limite) atual = i.id;
    });

    const fimDaPagina =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (fimDaPagina) atual = itensMenu[itensMenu.length - 1].id;

    marcarAtivo(atual);
  }

  window.addEventListener("scroll", atualizarMenu, { passive: true });
  window.addEventListener("resize", atualizarMenu);
  atualizarMenu();

  /* ---------- "Ver mais" dos cards ---------- */
  const btnVer = document.getElementById("ver");
  const cardsExtras = document.querySelectorAll(".card-oculto, .largo-oculto");

  if (btnVer && cardsExtras.length) {
    const rotulo = btnVer.querySelector(".ver");
    let aberto = false;

    btnVer.setAttribute("aria-expanded", "false");

    btnVer.addEventListener("click", () => {
      aberto = !aberto;
      cardsExtras.forEach((card) => card.classList.toggle("active", aberto));
      rotulo.textContent = aberto ? "Ver Menos" : "Ver Mais";
      btnVer.classList.toggle("aberto", aberto);
      btnVer.dataset.anim = aberto ? "abre" : "fecha";
      btnVer.setAttribute("aria-expanded", String(aberto));

      if (!aberto) {
        const secao = document.getElementById("saiba");
        if (secao) secao.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  document.querySelectorAll(".btn-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card-largo");
      const aberto = card.classList.toggle("aberto");
      btn.dataset.anim = aberto ? "abre" : "fecha";
      btn.setAttribute("aria-expanded", String(aberto));
      btn.querySelector("span").textContent = aberto ? "Ver Menos" : "Ver Mais";
    });
  });

  /* ---------- Botões com link (data-href) ---------- */
  document.querySelectorAll("[data-href]").forEach((el) => {
    el.addEventListener("click", () => {
      const url = el.dataset.href;
      if (el.hasAttribute("data-externo")) {
        window.open(url, "_blank", "noopener");
      } else {
        window.location.href = url;
      }
    });
  });

  /* ---------- Animação de entrada ---------- */
  const seletores = [
    ".texthero",
    ".imghero",
    ".saiba-mais h2",
    ".saiba-mais > p",
    ".card",
    ".card-oculto",
    ".card-largo",
    ".sobre h2",
    ".sobre > p",
    ".perc1",
    ".sobre a",
    ".jogue h2",
    ".jogos button",
    ".rod > div",
  ];

  const elementos = document.querySelectorAll(seletores.join(","));

  const semAnimacao =
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!semAnimacao) {
    const observador = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;

          const el = entrada.target;
          el.classList.add("visivel");
          obs.unobserve(el); // anima só uma vez

          // Depois que a entrada termina, remove as classes da animação
          // para que o efeito de hover (aumentar) responda sem atraso.
          const atraso = parseFloat(el.style.transitionDelay) || 0;
          setTimeout(
            () => {
              el.classList.remove("reveal", "visivel");
              el.style.transitionDelay = "";
            },
            (atraso + 0.7) * 1000 + 50,
          );
        });
      },
      { threshold: 0.15 },
    );

    elementos.forEach((el) => {
      el.classList.add("reveal");

      const irmaos = Array.from(el.parentElement.children).filter(
        (c) => c.classList.contains("reveal") || c.matches(seletores.join(",")),
      );
      const posicao = irmaos.indexOf(el);
      el.style.transitionDelay = `${Math.min(posicao, 5) * 0.1}s`;

      observador.observe(el);
    });
  }
});
