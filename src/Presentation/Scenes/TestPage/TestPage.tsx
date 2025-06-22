import React, { useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import tributeApiService from '../../../Data/api';

const TestPage = () => {
  const [response, setResponse] = useState<any>(null);

  const handleGetDashboard = async () => {
    try {
      const dashboardData = await tributeApiService.getDashboard();
      setResponse(JSON.stringify(dashboardData, null, 2));
    } catch (err: any) {
      setResponse(err.message);
    }
  };

  const handleCreateUser = async () => {
    try {
      const res = await tributeApiService.createUser();
      setResponse(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setResponse(err.message);
    }
  };

  const handleHealthCheck = async () => {
    try {
      const res = await tributeApiService.healthCheck();
      setResponse(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setResponse(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <div className="space-x-2 mb-4">
        <button onClick={handleGetDashboard} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Get Dashboard
        </button>
        <button onClick={handleCreateUser} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Create User
        </button>
        <button onClick={handleHealthCheck} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Health Check
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded mt-4">
        <h2 className="font-bold">Response:</h2>
        <pre className="whitespace-pre-wrap break-all">{response}</pre>
      </div>
    </div>
  );
};

export default TestPage; 