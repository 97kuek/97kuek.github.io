interface ApiResponse {
  ok: boolean;
  error?: string;
}

function initializeContactForms() {
  document.querySelectorAll<HTMLFormElement>("[data-contact-form]").forEach((form) => {
    if (form.dataset.bound === "true") return;
    form.dataset.bound = "true";

    const status = form.querySelector<HTMLElement>("[data-contact-status]");
    const submit = form.querySelector<HTMLButtonElement>("button[type='submit']");
    const initialLabel = submit?.textContent ?? "";
    let startedAt = Date.now();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      if (submit) {
        submit.disabled = true;
        submit.textContent = form.dataset.sending ?? initialLabel;
      }
      if (status) status.textContent = "";

      try {
        const response = await fetch(form.dataset.endpoint ?? "/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            subject: data.get("subject"),
            message: data.get("message"),
            website: data.get("website"),
            locale: form.dataset.locale ?? "ja",
            startedAt,
          }),
        });
        const result = await response.json() as ApiResponse;
        if (!response.ok || !result.ok) throw new Error(result.error ?? "Contact request failed");

        form.reset();
        startedAt = Date.now();
        if (status) status.textContent = form.dataset.success ?? "";
      } catch (error) {
        console.error(error);
        if (status) status.textContent = form.dataset.error ?? "";
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = initialLabel;
        }
      }
    });
  });
}

initializeContactForms();
document.addEventListener("astro:page-load", initializeContactForms);
