export async function generateLogo(
  name: string,
  industry: string,
  tone: string
) {
  const res = await fetch("http://127.0.0.1:8000/generate-logo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      industry,
      tone,
    }),
  });

  if (!res.ok) {
    throw new Error("Logo generation failed");
  }

  return res.json();
}