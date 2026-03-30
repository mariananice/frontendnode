const BASE_URL = 'http://localhost:4000';

/*export async function getUsuarios() {
  const res . = await fetch(`${BASE_URL}/api/usuarios`); // esto aún no existe, pero lo crearemos luego
  return res.json();
}*/

export async function crearUsuario(datos) {
  const res = await fetch(`${BASE_URL}/api/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos), 
  });
  return res.json();
}

export async function login(datos) {
  const res = await fetch(`${BASE_URL}/api/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return res.json();
}