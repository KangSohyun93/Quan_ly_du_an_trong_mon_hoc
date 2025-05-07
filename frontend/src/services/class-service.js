// Gọi API class_search_join
export async function SearchClass({ searchText }) {
  try {
    const response = await fetch("http://localhost:5000/api/class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: searchText }), // Truyền dữ liệu chỉ có searchText
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không lấy được dữ liệu");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function JoinClass({ joinCode }) {
  try {
    const response = await fetch("http://localhost:5000/api/class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: joinCode }), // Truyền dữ liệu chỉ có joinCode
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không lấy được dữ liệu");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
