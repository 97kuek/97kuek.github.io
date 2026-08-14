interface CommentRecord {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface CommentsResponse {
  ok: boolean;
  comments?: CommentRecord[];
  error?: string;
}

function createCommentElement(comment: CommentRecord, locale: string) {
  const item = document.createElement("li");
  const header = document.createElement("header");
  const name = document.createElement("strong");
  const time = document.createElement("time");
  const message = document.createElement("p");

  name.textContent = comment.name;
  time.dateTime = comment.createdAt;
  time.textContent = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ja-JP", {
    dateStyle: "medium",
  }).format(new Date(comment.createdAt));
  message.textContent = comment.message;

  header.append(name, time);
  item.append(header, message);
  return item;
}

async function initializeComments() {
  document.querySelectorAll<HTMLElement>("[data-comments-root]").forEach(async (root) => {
    if (root.dataset.bound === "true") return;
    root.dataset.bound = "true";

    const page = root.dataset.page ?? location.pathname;
    const locale = root.dataset.locale ?? "ja";
    const list = root.querySelector<HTMLOListElement>("[data-comments-list]");
    const state = root.querySelector<HTMLElement>("[data-comments-state]");
    const form = root.querySelector<HTMLFormElement>("[data-comments-form]");
    const formStatus = root.querySelector<HTMLElement>("[data-comments-form-status]");
    const submit = form?.querySelector<HTMLButtonElement>("button[type='submit']");
    let startedAt = Date.now();

    try {
      const response = await fetch(`/api/comments?page=${encodeURIComponent(page)}`, {
        headers: { accept: "application/json" },
      });
      const data = await response.json() as CommentsResponse;
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Could not load comments");

      const comments = data.comments ?? [];
      list?.replaceChildren(...comments.map((comment) => createCommentElement(comment, locale)));
      if (state) state.textContent = comments.length === 0 ? root.dataset.empty ?? "" : "";
    } catch (error) {
      console.error(error);
      if (state) state.textContent = root.dataset.error ?? "";
    }

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      submit?.setAttribute("disabled", "");
      if (formStatus) formStatus.textContent = "";

      try {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify({
            page,
            locale,
            name: data.get("name"),
            message: data.get("message"),
            website: data.get("website"),
            startedAt,
          }),
        });
        const result = await response.json() as CommentsResponse;
        if (!response.ok || !result.ok) throw new Error(result.error ?? "Could not submit comment");

        form.reset();
        startedAt = Date.now();
        if (formStatus) formStatus.textContent = root.dataset.success ?? "";
      } catch (error) {
        console.error(error);
        if (formStatus) formStatus.textContent = root.dataset.error ?? "";
      } finally {
        submit?.removeAttribute("disabled");
      }
    });
  });
}

initializeComments();
document.addEventListener("astro:page-load", initializeComments);
