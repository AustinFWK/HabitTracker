import { useAuth } from "@clerk/clerk-react";

export function Dashboard() {
  const { getToken } = useAuth();

  async function fetchData() {
    const token = await getToken({ template: "backend" });

    const response = await fetch("http://127.0.0.1:8000", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data);
  }
  return <button onClick={fetchData}>Get data button</button>;
}
