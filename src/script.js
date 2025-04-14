document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  const tgInitData = tg.initData || "Нет данных";
  const responseEl = document.getElementById("response");

  document.getElementById("tginitdata").textContent = tgInitData;

  const API_URL = "https://bba696ane0o20k9gad7p.containers.yandexcloud.net/api";
  const ycToken =
    "t1.9euelZqPzp6TkpHOk5OYlcabzM_KmO3rnpWakpqXiZGcx5zIzZ7HjM6Yk8_l8_cqcwxA-e8NDBYq_N3z92ohCkD57w0MFir8zef1656VmszNk5vGzZaQzJfKjMuVjcad7_zF656VmszNk5vGzZaQzJfKjMuVjcad.Ohksi3QVCIrWwkXaJky7zgpdy1OlK-UUjIho-Anj5SyiTXsDPwiTtrMRUDhAPgrQJrpylIeCdozI8YVcDLQpAQ";
  let appToken = null;

  async function sendRequest(url, method, body = null, auth = false) {
    try {
      const yandexToken = ycToken;

      const headers = {
        "Content-Type": "application/json",
        Authorization: yandexToken,
      };

      if (auth && appToken) {
        headers["X-App-Token"] = appToken;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        mode: "cors",
      });

      console.log(`Response headers: ${response.headers}`);
      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        responseEl.className = "success";
        responseEl.textContent = JSON.stringify(data, null, 2);
        return data;
      } else {
        const errorText = await response.text();
        responseEl.className = "error";
        responseEl.textContent = `Error ${response.status}: ${errorText}`;
        throw new Error(`${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      responseEl.className = "error";
      responseEl.textContent = "Error: " + error.message;
    }
  }

  document.getElementById("signinBtn").addEventListener("click", async () => {
    const data = await sendRequest(`${API_URL}/auth/signin`, "POST", {
      telegramInitData: tgInitData,
    });

    if (data && data.token) {
      appToken = data.token;
      console.log("App Token:", appToken);
      document.getElementById("whoamiBtn").disabled = false;
      document.getElementById("giftCraftBtn").disabled = false;
      document.getElementById("giftListBtn").disabled = false;

      // Показываем полученный токен приложения
      responseEl.textContent += "\n\nПолучен токен приложения: " + appToken;
    }
  });

  document.getElementById("whoamiBtn").addEventListener("click", async () => {
    if (!appToken) {
      responseEl.textContent = "Please sign in first";
      return;
    }
    await sendRequest(`${API_URL}/auth/whoami`, "GET", null, true);
  });

  document
    .getElementById("giftCraftBtn")
    .addEventListener("click", async () => {
      await sendRequest(`${API_URL}/gifts/craft`, "GET", null, true);
    });

  document.getElementById("giftListBtn").addEventListener("click", async () => {
    await sendRequest(`${API_URL}/gifts/list`, "GET", null, true);
  });
});
