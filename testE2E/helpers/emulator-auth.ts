const EMULATOR_API = 'http://localhost:9099/identitytoolkit.googleapis.com/v1';

export async function createEmulatorUser(email: string, password: string, displayName?: string) {
  const response = await fetch(`${EMULATOR_API}/accounts:signUp?key=fake-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create emulator user: ${await response.text()}`);
  }

  const data = await response.json();

  if (displayName) {
    await fetch(`${EMULATOR_API}/accounts:update?key=fake-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken: data.idToken,
        displayName,
        returnSecureToken: true,
      }),
    });
  }

  return data;
}
