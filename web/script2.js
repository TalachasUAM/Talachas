const SUPABASE_URL = "https://ngkvjytxrgzgzvvaxnpk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na3ZqeXR4cmd6Z3p2dmF4bnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTYwMDEsImV4cCI6MjA3NzQ5MjAwMX0.dR2v9oZscjcu71VpO56wzSUcMLYXDS8YS_WB0i7pp1E";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const input = document.getElementById('photoInput');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');
const previewContainer = document.getElementById('previewContainer');

async function loadGallery() {
  const { data, error } = await supabase
    .from('proyecto')
    .select('*')
    .order('url', { ascending: false });

  if (error) {
    console.error('Error al cargar la galería:', error);
    return;
  }

  gallery.innerHTML = '';
  data.forEach(item => {
    const img = document.createElement('img');
    img.src = item.url;
    gallery.appendChild(img);
  });
}

input.addEventListener('change', () => {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewContainer.innerHTML = '';
      const img = document.createElement('img');
      img.src = e.target.result;
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  } else {
    previewContainer.innerHTML = '';
  }
});

uploadBtn.addEventListener('click', async () => {
  const file = input.files[0];
  if (!file) return alert('Selecciona una imagen primero.');

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Subiendo...";

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('Fotos').upload(fileName, file);

  if (error) {
    alert('Error al subir imagen: ' + error.message);
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Subir Foto";
    return;
  }

  const { data: publicUrlData } = supabase.storage.from('Fotos').getPublicUrl(fileName);
  const imageUrl = publicUrlData.publicUrl;

  const { error: insertError } = await supabase.from('proyecto').insert([{ url: imageUrl }]);

  if (insertError) {
    alert('Error al guardar en la base de datos: ' + insertError.message);
    console.error(insertError);
  } else {
    previewContainer.innerHTML = '';
    input.value = '';
    await loadGallery();
  }

  uploadBtn.disabled = false;
  uploadBtn.textContent = "Subir Foto";
});

loadGallery();