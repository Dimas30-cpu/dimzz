window.addEventListener("load", () => {
  const loginAudio = document.getElementById("loginAudio");
  loginAudio.play().catch(() => {
    document.body.addEventListener("click", () => loginAudio.play(), { once: true });
  });
});

function login() {
  const u = document.getElementById("username").value.trim().toUpperCase();
  const p = document.getElementById("password").value.trim().toUpperCase();
  if (u === "DIMZZ" && p === "BRUTAL") {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("appPage").classList.remove("hidden");
    document.getElementById("loginAudio").pause();
    document.getElementById("mainAudio").classList.remove("hidden");
    document.getElementById("mainAudio").play().catch(() => {
      document.body.addEventListener("click", () => document.getElementById("mainAudio").play(), { once: true });
    });
  } else {
    alert("Username atau password salah!");
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function enhanceImage() {
  const input = document.getElementById("inputImage");
  const preview = document.getElementById("preview");
  const effect = document.getElementById("effectSelect").value;
  if (!input.files[0]) return alert("Pilih gambar terlebih dahulu.");
  const reader = new FileReader(), img = new Image();
  reader.onload = e => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = "none";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (effect === "smooth") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "blur(2px)";
        ctx.drawImage(img, 0, 0);
        ctx.filter = "none";
      } else {
        let d = ctx.getImageData(0, 0, canvas.width, canvas.height), data = d.data;
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i], g = data[i+1], b = data[i+2];

          if (effect === "brighten") {
            r *= 1.08; g *= 1.08; b *= 1.08; r += 10; g += 10; b += 10;
          }
          else if (effect === "efiko") {
            r = (r-128)*1.55+128; g = (g-128)*1.55+128; b = (b-128)*1.55+128;
            r = r*1.375+5; g = g*1.375+5; b = b*1.375+5;
          }
          else if (effect === "brutal") {
            const base = 128;
            r = (r - base) * 1.05 + base;
            g = (g - base) * 1.1 + base;
            b = (b - base) * 1.7 + base;
            if (b > 190) b += 40;
            if (g > 180) g += 20;
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
            data[i]   = r;
            data[i+1] = g;
            data[i+2] = b;
            continue;
          }
          else if (effect === "capcut") {
            r = (r - 128) * 1.12 + 128;
            g = (g - 128) * 1.08 + 128;
            b = (b - 128) * 1.02 + 128;
            r = r * 1.18 + 18;
            g = g * 1.12 + 8;
            b = b * 0.92 - 4;
          }
          else if (effect === "hdpremium") {
            r = (r - 128) * 1.3 + 128;
            g = (g - 128) * 1.2 + 128;
            b = (b - 128) * 1.5 + 128;
            r = Math.min(255, r * 0.95);
            g = Math.min(255, g * 1.05);
            b = Math.min(255, b * 1.3 + 20);
            data[i]   = Math.max(0, Math.min(255, r));
            data[i+1] = Math.max(0, Math.min(255, g));
            data[i+2] = Math.max(0, Math.min(255, b));
            continue;
          }

          data[i]     = Math.min(255, Math.max(0, r));
          data[i+1]   = Math.min(255, Math.max(0, g));
          data[i+2]   = Math.min(255, Math.max(0, b));
        }
        ctx.putImageData(d, 0, 0);
      }

      if (effect === "brutal") {
        ctx.filter = "contrast(1.3) saturate(1.6) brightness(1.2) drop-shadow(0 0 15px #00aaff) drop-shadow(0 0 25px #0066ff)";
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
      } else if (effect === "hdpremium") {
        ctx.filter = "contrast(1.4) saturate(1.8) brightness(1.3) drop-shadow(0 0 20px #00ffff) drop-shadow(0 0 30px #0066ff)";
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
      } else {
        ctx.filter = "contrast(1.2) saturate(1.3) brightness(1.1)";
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
      }

      preview.src = "";
      setTimeout(() => {
        preview.src = canvas.toDataURL("image/png");
        preview.style.opacity = "0";
        preview.style.transform = "translateY(30px)";
        setTimeout(() => {
          preview.style.opacity = "1";
          preview.style.transform = "translateY(0)";
        }, 50);
      }, 50);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "Gambar-HD-Anime-Style.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
