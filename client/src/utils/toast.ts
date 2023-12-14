const listen = () => {
  const btn = document.querySelector("#toast button");
  btn?.addEventListener("click", () => remove());
};

const remove = () => {
  document.getElementById("toast")?.classList.remove("show");
};

export const toast = (body?: { title?: string; message?: string }) => {
  const title = body?.title || "Fristroop Development";
  const message = body?.message || "Hello World!";

  listen();

  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toast-title");
  const toastBody = document.getElementById("toast-body");

  const ok = toast && toastTitle && toastBody;
  if (!ok) return alert(`${title}\n${message}`);

  toastTitle!.innerHTML = title;
  toastBody!.innerHTML = message;

  toast.classList.add("show");

  setTimeout(() => {
    remove();
  }, 5000);
};
