document.querySelector("body").innerHTML =
  document.querySelector("body").innerHTML +
  `<div class="feedback-container">
<img src="src/icons/feedback.svg" alt="Feedback" class="feedback-icon" />
</div>
<div id="popup" class="hidden">
<div id="popup-content">
  <h2 id="popup-title">Zpětná vazba</h2>
  <img id="popup-close" src="src/icons/close.svg" alt="Close" />
  <input type="email" id="popup-email" placeholder="Váš e-mail" />
  <label style="text-align: left" for="popup-email"
    >nepoviné, ale hodí se v případech kdy je potřebné odpovědět</label
  >
  <textarea
    id="popup-textarea"
    placeholder="Vaše zpětná vazba"
  ></textarea>
  <button id="popup-submit">Poslat</button>
</div>
</div>`;

document.addEventListener("DOMContentLoaded", () => {
  const feedbackContainer = document.querySelector(".feedback-container");
  const popup = document.getElementById("popup");
  const popupClose = document.getElementById("popup-close");
  const popupSubmit = document.getElementById("popup-submit");
  const popupTextarea = document.getElementById("popup-textarea");
  const popupEmail = document.getElementById("popup-email");

  feedbackContainer.addEventListener("click", () => {
    popup.classList.remove("hidden");
  });

  popupClose.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      popup.classList.add("hidden");
    }
  });

  popupSubmit.addEventListener("click", async () => {
    const feedback = popupTextarea.value.trim();
    const email = popupEmail.value.trim();

    if (!feedback) {
      popupTextarea.style.outline = "2px solid red";
      return;
    } else {
      popupTextarea.style.outline = "";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const emailLabel = document.querySelector("label[for='popup-email']");
      popupEmail.style.outline = "2px solid red";
      emailLabel.style.color = "red";
      emailLabel.textContent =
        "neplatná emailová adresa, zkontrolujte její správnost";
      return;
    } else {
      const emailLabel = document.querySelector("label[for='popup-email']");
      popupEmail.style.outline = "";
      emailLabel.style.color = "";
      emailLabel.textContent =
        "nepoviné, ale hodí se v případech kdy je potřebné odpovědět";
    }

    const webhookUrl =
      "https://discord.com/api/webhooks/1363437930995253419/i3PnCXYd_OjOurG9-5VXDFq7Q9gSICp_VgeQz4Q12qfdK5Vhy9YGIvFDAzxXj8_C0L6M";
    const payload = {
      content: null,
      embeds: [
        {
          description:
            feedback +
            `\n\n` +
            `[Odpovědět](mailto:${
              email || "Anonymní"
            }?subject=Odpov%C4%9B%C4%8F%20na%20Va%C5%A1%C3%AD%20zp%C4%9Btnou%20vazbu)`,
          color: 16645629,
          author: {
            name: `Od: ${email || "Anonymní"}`,
          },
        },
      ],
      attachments: [],
    };

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error sending feedback:", error);
    } finally {
      popupTextarea.value = "";
      popupEmail.value = "";
      popup.classList.add("hidden");
    }
  });
});
