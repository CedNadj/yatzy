// Wrapper around fetch for easier calls
export async function api(url, options={}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

export const startGame = () => api("/api/game", {method:"POST"});
export const roll = () => api("/api/roll-dices", {method:"POST"});
export const score = cat => api(`/api/score/${cat}`, {method:"POST"});
export const getState = () => api("/api/state");
