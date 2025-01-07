import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/logs');
        setLogs(response.data.reverse());
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, []);

  const get_status = useCallback(() => {
    if (logs.length > 0) {
      const now = new Date().getTime() / 1000;
      const diff = now - logs[0].seconds;
      if (diff > 86400 * 7) {
        return ["dead or kidnapped 💀", "text-red-500"];
      }
      if (diff > 86400) {
        return ["alive and happy 🏕️", "text-[#3fae3f]"];
      }
      return ["alive and on the grind 🗿", "text-[#3fae3f]"];
    }
    return ["", ""];
  }, [logs]);

  const [status, statusColor] = useMemo(() => get_status(), [get_status]);

  return (
    <div className="container mx-auto px-4 flex flex-col lg:flex-row items-start justify-center gap-10 lg:py-8">

      <div className="flex flex-col items-center gap-16 lg:w-1/2 pt-8">
        <div className="text-3xl text-center max-w-2xl">
          For Ma,
          <p className="mt-4">
            This page shows the exact time when I last logged into my laptop using an automated custom login script.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="text-4xl mb-2">
            I am probably:
          </div>
          <div className={`text-5xl font-bold ${statusColor}`}>
            {status}
          </div>
          <div className="text-xl text-gray-400 mt-4">
            (Last login: {logs[0]?.created})
          </div>
        </div>
      </div>


      <div className="flex flex-col items-center w-full lg:w-1/3">
        <div className="text-xl mb-2">All logs (UK time)</div>
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <div className="h-[52vh] overflow-y-auto p-4 space-y-2">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="text-center hover:bg-gray-500 p-2 rounded transition-colors"
              >
                {log.created}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;