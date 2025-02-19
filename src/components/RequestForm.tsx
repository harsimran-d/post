import { useState } from "react";
import { cn } from "../lib/utils";

function RequestForm() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [sentTime, setSentTime] = useState(0);
  const [timeTaken, setTimeTaken] = useState("");
  const [error, setError] = useState("");
  const [port, setPort] = useState("3000");
  return (
    <div className="w-[600px] rounded-3xl bg-white">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setResult("");
          const target = e.target as typeof e.target & {
            endpoint: { value: string };
            method: { value: string };
            port: { value: string };
          };
          try {
            setSentTime(Date.now());
            const response = await fetch(
              `http://localhost:${target.port.value}/${target.endpoint.value}`,
              {
                method: target.method.value,
              },
            );
            setTimeTaken(((Date.now() - sentTime) / 1000).toFixed(2));

            setStatus(response.status.toString());
            if (!response.ok) {
              setError(`Error: ${response.status} ${response.statusText}`);
              return;
            }
            setResult(await response.text());
          } catch (error) {
            console.error("Fetch error:", error);

            // Infer connection error
            if (
              error instanceof TypeError &&
              error.message.includes("Failed to fetch")
            ) {
              setError("Error: Connection refused (server may be down)");
            } else {
              setError(
                `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
            }
          }
        }}
      >
        <div className="m-3 flex items-center justify-center gap-2 rounded-lg border p-3">
          <select
            className="h-[40px] rounded border p-2"
            name="method"
            id="method"
          >
            <option value="GET">GET</option>
            <option value="PATCH">PATCH</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <div>localhost</div>
          <div>:</div>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            type="number"
            name="port"
            id="port"
            className="h-[40px] w-[64px] rounded border p-1"
            minLength={4}
            maxLength={5}
          />
          <div>/</div>
          <input
            className="h-[40px] rounded border p-2"
            type="text"
            name="endpoint"
            id="endpoint"
          />
          <button className="h-[40px] rounded-lg border bg-slate-800 px-3 py-2 text-white hover:cursor-pointer hover:bg-slate-700">
            Send
          </button>
        </div>
      </form>
      <div
        className={cn(
          "m-3 rounded-lg border bg-green-50 p-3 text-green-800",
          !result && "hidden",
        )}
      >
        Status: {status}
        <br />
        Time: {`${timeTaken} ms`}
        <br />
        Size: {result.length} bytes
        <br />
        Response: {result}
      </div>
      <div
        className={cn(
          "m-3 rounded-lg border bg-red-50 p-3 text-red-800",
          !error && "hidden",
        )}
      >
        {error}
      </div>
    </div>
  );
}
export default RequestForm;
