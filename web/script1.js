// ---------------------------
// HABILITAR DRAG DESDE LA BARRA LATERAL
// ---------------------------
document.querySelectorAll(".draggable").forEach(img => {
  img.draggable = true;

  img.addEventListener("dragstart", e => {
    e.dataTransfer.setData("src", e.target.src);
    e.dataTransfer.setData("width", e.target.width);
  });
});

const dropzone = document.getElementById("dropzone");

dropzone.addEventListener("dragover", e => e.preventDefault());

dropzone.addEventListener("drop", e => {
  e.preventDefault();
  const src = e.dataTransfer.getData("src");
  const width = e.dataTransfer.getData("width");

  const newImg = document.createElement("img");
  newImg.src = src;
  newImg.style.width = width + "px";
  newImg.classList.add("placed");

  const rect = dropzone.getBoundingClientRect();
  newImg.style.position = "absolute";
  newImg.style.left = (e.clientX - rect.left - width / 2) + "px";
  newImg.style.top = (e.clientY - rect.top - width / 2) + "px";

  dropzone.appendChild(newImg);
  hacerMovible(newImg);

  newImg.animate(
    [{ transform: "scale(0.5)" }, { transform: "scale(1)" }],
    { duration: 150, easing: "ease-out" }
  );
});

// ---------------------------
// HACER PIEZAS MOVIBLES
// ---------------------------
function hacerMovible(el) {
  el.addEventListener("mousedown", e => {
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;

    function mover(ev) {
      const rect = dropzone.getBoundingClientRect();
      el.style.left = (ev.clientX - rect.left - shiftX) + "px";
      el.style.top = (ev.clientY - rect.top - shiftY) + "px";
    }

    document.addEventListener("mousemove", mover);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", mover);
    }, { once: true });
  });
}

// ---------------------------
// BORRAR TODO
// ---------------------------
document.getElementById("clearBtn").addEventListener("click", () => {
  dropzone.querySelectorAll(".placed").forEach(img => img.remove());
});

// ---------------------------
// P5: CAPTURA SIN DEFORMACIÓN
// ---------------------------
let pg;

function setup() {
  noCanvas();
}

document.getElementById("captureBtn").addEventListener("click", () => {

  const rect = dropzone.getBoundingClientRect();

  if (pg) pg.remove();
  pg = createGraphics(rect.width, rect.height);

  loadImage("../assets/cuerpo.png", imgBase => {

    const baseImg = document.querySelector(".imagen-cuerpo");
    const baseRect = baseImg.getBoundingClientRect();
    const dzRect = dropzone.getBoundingClientRect();

    const xBase = baseRect.left - dzRect.left;
    const yBase = baseRect.top - dzRect.top;
    const wBase = baseRect.width;
    const hBase = baseRect.height;

    pg.image(imgBase, xBase, yBase, wBase, hBase);

    const partes = Array.from(dropzone.querySelectorAll(".placed"));

    if (partes.length === 0) {
      save(pg, "captura.png");
      return;
    }

    let cargadas = 0;

    partes.forEach(el => {
      loadImage(el.src, img => {

        const elRect = el.getBoundingClientRect();

        const x = elRect.left - dzRect.left;
        const y = elRect.top - dzRect.top;
        const w = elRect.width;
        const h = elRect.height;

        pg.image(img, x, y, w, h);

        cargadas++;
        if (cargadas === partes.length) save(pg, "captura.png");
      });
    });

  });

});

