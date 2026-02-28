class ApiClient {
  async request(endpoint, options = {}) {
    const { method = "GET", body, headers = {} } = options;

    const isFormData = body instanceof FormData;

    const res = await fetch(`/api/${endpoint}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });

    let data;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.message || `API error: ${res.status}`);
    }

    return data;
  }

  getVideos() {
    return this.request("videos");
  }

  createVideo(data) {
    return this.request("videos", {
      method: "POST",
      body: data,
    });
  }

  deleteVideo(id) {
    return this.request(`videos?id=${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();