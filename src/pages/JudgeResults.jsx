import React, { useEffect, useState } from 'react';
import { fetchJudgeResults } from '../api/gagambi';

function JudgeResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJudgeResults()
      .then(data => {
        // Ensure we have an array
        const safeData = Array.isArray(data) ? data : [];
        setResults(safeData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getDeltaColor = (delta) => {
    const absDelta = Math.abs(delta);
    if (absDelta < 1) return 'text-green-600';
    if (absDelta < 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error: {error}</div>;

  // Safe array operations
  const validResults = Array.isArray(results) ? results : [];

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Judge Scoring Results</h1>
      
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Campaigns</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{validResults.length}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Delta</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {validResults.length > 0 
                ? (validResults.reduce((sum, r) => sum + Math.abs((r.llm_score || 0) - (r.human_score || 0)), 0) / validResults.length).toFixed(2)
                : '0.00'
              }
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Accuracy Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {validResults.length > 0 
                ? ((validResults.filter(r => Math.abs((r.llm_score || 0) - (r.human_score || 0)) < 1).length / validResults.length) * 100).toFixed(1) + '%'
                : '0%'
              }
            </dd>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judge</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LLM Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Human Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {validResults.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No judge results found
                      </td>
                    </tr>
                  ) : (
                    validResults.map((r, i) => {
                      const llmScore = r.llm_score || 0;
                      const humanScore = r.human_score || 0;
                      const delta = llmScore - humanScore;
                      return (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.campaign_name || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.judge_name || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{llmScore.toFixed(1)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{humanScore.toFixed(1)}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getDeltaColor(delta)}`}>
                            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              Math.abs(delta) < 1 ? 'bg-green-100 text-green-800' :
                              Math.abs(delta) < 2 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {Math.abs(delta) < 1 ? 'Accurate' : Math.abs(delta) < 2 ? 'Close' : 'Divergent'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JudgeResults;
