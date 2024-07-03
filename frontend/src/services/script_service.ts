export async function get_script(topic: string) {
  const url = new URL("http://localhost:8000/api/script");
  url.searchParams.append("topic", topic);

  const ret = await fetch(url, { cache: "no-cache" });
  const data = await ret.json();

  if (!ret.ok) {
    throw new Error(data);
  }

  return data;
}
