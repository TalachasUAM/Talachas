
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
  const width = parseInt(e.dataTransfer.getData("width"));

  const newImg = document.createElement("img");
  newImg.src = src;
  newImg.style.width = width + "px";
  newImg.classList.add("placed");
  newImg.style.position = "absolute";

 const rect = dropzone.getBoundingClientRect();
  newImg.style.left = (e.clientX - rect.left - width / 2) + "px";
  newImg.style.top = (e.clientY - rect.top - width / 2) + "px";

  dropzone.appendChild(newImg);
  makeMovable(newImg);

  newImg.animate(
    [{ transform: "scale(0.5)" }, { transform: "scale(1)" }],
    { duration: 150, easing: "ease-out" }
  );
});

function makeMovable(el) {
  el.addEventListener("mousedown", e => {
    e.preventDefault();
    const rect = dropzone.getBoundingClientRect();
    const shiftX = e.clientX - el.getBoundingClientRect().left;
    const shiftY = e.clientY - el.getBoundingClientRect().top;

    function move(ev) {
      el.style.left = (ev.clientX - rect.left - shiftX) + "px";
      el.style.top = (ev.clientY - rect.top - shiftY) + "px";
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", move);
    }, { once: true });
  });

  el.ondragstart = () => false;
}

document.getElementById("clearBtn").addEventListener("click", () => {
  dropzone.querySelectorAll(".placed").forEach(img => img.remove());
});
