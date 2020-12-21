async function apiClient(url, body) {
  const options = {};
  if (body != null) {
    options.method = "POST";
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, { ...options });

  const contentType = response.headers.get("content-type");
  if (!contentType) {
    return;
  }

  const data = await response.json();
  if (response.ok) {
    return data;
  }

  const error = new Error("Error fetching data.");
  error.response = data;
  throw error;
}
export default apiClient;
