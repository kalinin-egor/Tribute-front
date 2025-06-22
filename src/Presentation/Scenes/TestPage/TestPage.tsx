import React, { useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { useAppState } from '../../hooks/useAppState';
import tributeApiService from '../../../Data/api';

const TestPage: React.FC = () => {
  const { isReady, webApp, user } = useTelegram();
  const { isLoading, error, isOnboarded, dashboardData } = useAppState();
  const [testResult, setTestResult] = useState<string>('');

  const testHealthCheck = async () => {
    try {
      setTestResult('Testing health check...');
      const result = await tributeApiService.healthCheck();
      setTestResult(`Health check successful: ${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      setTestResult(`Health check failed: ${error.message}`);
    }
  };

  const testDashboard = async () => {
    try {
      setTestResult('Testing dashboard...');
      const result = await tributeApiService.getDashboard();
      setTestResult(`Dashboard successful: ${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      setTestResult(`Dashboard failed: ${error.message}`);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await tributeApiService.createUser();
      setTestResult(JSON.stringify(response, null, 2));
    } catch (err: any) {
      setTestResult(err.message);
    }
  };

  const handlePublishSubscription = async () => {
    try {
      // ... existing code ...
    } catch (err: any) {
      // ... existing code ...
    }
  };

  const apiUrl = 'https://gateway.statgram.org/api/v1';

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Environment Info</h2>
          <p><strong>Port:</strong> {window.location.port || '80/443'}</p>
          <p><strong>Hostname:</strong> {window.location.hostname}</p>
          <p><strong>Environment:</strong> Production</p>
          <p><strong>API URL:</strong> {apiUrl}</p>
          <p><strong>Dashboard Endpoint:</strong> {apiUrl}/dashboard</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Telegram State</h2>
          <p><strong>isReady:</strong> {isReady ? 'Yes' : 'No'}</p>
          <p><strong>webApp:</strong> {webApp ? 'Available' : 'Not available'}</p>
          <p><strong>User:</strong> {user ? `${user.first_name} ${user.last_name || ''}` : 'Not available'}</p>
          <p><strong>initData:</strong> {webApp?.initData ? 'Present' : 'Missing'}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">App State</h2>
          <p><strong>isLoading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>isOnboarded:</strong> {isOnboarded ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>Dashboard Data:</strong> {dashboardData ? 'Available' : 'Not available'}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">API Tests</h2>
        <div className="space-y-2">
          <button 
            onClick={testHealthCheck}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            Test Health Check
          </button>
          <button 
            onClick={testDashboard}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
          >
            Test Dashboard
          </button>
          <button 
            onClick={handleCreateUser}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mr-2"
          >
            Create User
          </button>
          <button 
            onClick={handlePublishSubscription}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mr-2"
          >
            Publish Subscription
          </button>
        </div>
      </div>

      {testResult && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Test Result</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestPage; 