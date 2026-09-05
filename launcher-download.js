(() => {
  "use strict";
  // Parts are joined in order to preserve the original executable byte for byte.
  const parts = ["./downloads/AbilityLauncher.part1", "./downloads/AbilityLauncher.part2"];
  const expectedSize = 14084608;
  const expectedHash = "b3feee24d0154dfcef83df4db461905586af4978a1b533e6f4b9e8fd1f2e246c";
  let downloading = false;

  document.addEventListener("click", async (event) => {
    const button = event.target.closest?.(".launcher-download");
    if (!button || downloading) return;
    downloading = true;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    const label = button.querySelector(".launcher-download__label");
    label.textContent = "다운로드 중…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    try {
      const buffers = await Promise.all(parts.map(async (url) => {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Download failed: " + response.status);
        return response.arrayBuffer();
      }));
      const file = new Blob(buffers, { type: "application/octet-stream" });
      if (file.size !== expectedSize) throw new Error("Incomplete download");
      const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
      const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
      if (hash !== expectedHash) throw new Error("Download integrity mismatch");
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "AbilityLauncher.exe";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      label.textContent = "런쳐 다운로드";
    } catch (error) {
      controller.abort();
      label.textContent = "다시 다운로드";
      window.alert("런쳐를 다운로드하지 못했어요. 잠시 후 다시 눌러주세요.");
    } finally {
      clearTimeout(timeout);
      downloading = false;
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  });
})();
