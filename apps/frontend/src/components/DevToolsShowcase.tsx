'use client';

import { useEffect, useState } from 'react';

const DevToolsShowcase = () => {
  const [networkStats, setNetworkStats] = useState({
    requests: 0,
    totalSize: 0,
    loadTime: 0,
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    domNodes: 0,
  });

  const [consoleMessages] = useState([
    { type: 'info', message: '🚀 Todo app loaded successfully!', timestamp: new Date().toISOString() },
    { type: 'warn', message: '⚠️ Large image detected - consider optimization', timestamp: new Date().toISOString() },
    { type: 'log', message: '📊 Performance metrics initialized', timestamp: new Date().toISOString() },
  ]);

  useEffect(() => {
    // Simulate network monitoring
    const updateNetworkStats = () => {
      setNetworkStats(prev => ({
        requests: prev.requests + Math.floor(Math.random() * 3),
        totalSize: prev.totalSize + Math.floor(Math.random() * 500),
        loadTime: Math.floor(Math.random() * 200) + 50,
      }));
    };

    // Simulate performance monitoring
    const updatePerformanceMetrics = () => {
      setPerformanceMetrics({
        fps: Math.floor(Math.random() * 10) + 55,
        memoryUsage: Math.floor(Math.random() * 50) + 10,
        domNodes: document.querySelectorAll('*').length,
      });
    };

    // Log console messages for demo
    console.info('🚀 Todo app loaded successfully!');
    console.warn('⚠️ Large image detected - consider optimization');
    console.log('📊 Performance metrics initialized');

    const networkInterval = setInterval(updateNetworkStats, 3000);
    const performanceInterval = setInterval(updatePerformanceMetrics, 2000);

    // Initial update
    updateNetworkStats();
    updatePerformanceMetrics();

    return () => {
      clearInterval(networkInterval);
      clearInterval(performanceInterval);
    };
  }, []);

  const triggerNetworkActivity = async () => {
    console.log('🌐 Triggering network activity for DevTools demo...');
    
    // Create multiple requests to show in Network tab
    const requests = [
      fetch('/api/todos'),
      fetch('https://jsonplaceholder.typicode.com/posts/1'),
      fetch('https://picsum.photos/100/100?random=' + Date.now()),
    ];

    try {
      await Promise.all(requests);
      console.log('✅ Network requests completed successfully');
    } catch (error) {
      console.error('❌ Some network requests failed:', error);
    }
  };

  const triggerPerformanceTest = () => {
    console.log('⚡ Running performance test...');
    
    const start = performance.now();
    
    // Create a computationally expensive task
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    
    const end = performance.now();
    
    console.log(`🎯 Performance test completed in ${(end - start).toFixed(2)}ms`);
    console.log(`📈 Result: ${result.toFixed(2)}`);
    
    // Trigger a performance mark for DevTools
    performance.mark('performance-test-completed');
  };

  const triggerMemoryTest = () => {
    console.log('🧠 Creating objects for memory analysis...');
    
    // Create objects to show memory usage in DevTools
    const largeArray = new Array(100000).fill(null).map((_, i) => ({
      id: i,
      data: `Item ${i}`,
      timestamp: new Date().toISOString(),
      randomData: Math.random().toString(36).substring(7),
    }));
    
    console.log(`📊 Created ${largeArray.length} objects in memory`);
    
    // Store in window for inspection in DevTools
    (window as unknown as { testData?: typeof largeArray }).testData = largeArray;
    
    setTimeout(() => {
      delete (window as unknown as { testData?: typeof largeArray }).testData;
      console.log('🗑️ Test data cleaned up');
    }, 5000);
  };

  return (
    <div className="mt-12 bg-gray-900 text-white rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">🔧</span>
        Chrome DevTools Showcase
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Network Stats */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-blue-400">📡</span>
            Network Monitor
          </h3>
          <div className="space-y-2 text-sm">
            <div>Requests: <span className="text-blue-400">{networkStats.requests}</span></div>
            <div>Total Size: <span className="text-green-400">{networkStats.totalSize} KB</span></div>
            <div>Load Time: <span className="text-yellow-400">{networkStats.loadTime}ms</span></div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-green-400">⚡</span>
            Performance
          </h3>
          <div className="space-y-2 text-sm">
            <div>FPS: <span className="text-green-400">{performanceMetrics.fps}</span></div>
            <div>Memory: <span className="text-yellow-400">{performanceMetrics.memoryUsage} MB</span></div>
            <div>DOM Nodes: <span className="text-purple-400">{performanceMetrics.domNodes}</span></div>
          </div>
        </div>

        {/* Console Messages */}
        <div className="bg-gray-800 rounded-lg p-4 md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-purple-400">💬</span>
            Console Activity
          </h3>
          <div className="space-y-1 text-xs">
            {consoleMessages.slice(-3).map((msg, i) => (
              <div key={i} className={`${
                msg.type === 'warn' ? 'text-yellow-400' : 
                msg.type === 'info' ? 'text-blue-400' : 'text-gray-300'
              }`}>
                {msg.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={triggerNetworkActivity}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>📊</span>
          Trigger Network Activity
        </button>
        
        <button
          onClick={triggerPerformanceTest}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>⚡</span>
          Performance Test
        </button>
        
        <button
          onClick={triggerMemoryTest}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>🧠</span>
          Memory Test
        </button>
      </div>

      {/* DevTools Instructions */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="font-semibold mb-3 text-yellow-400 flex items-center gap-2">
          <span>💡</span>
          DevTools Instructions
        </h3>
        <div className="text-sm space-y-2 text-gray-300">
          <div><strong>Network Tab:</strong> Click &quot;Trigger Network Activity&quot; and watch requests appear</div>
          <div><strong>Performance Tab:</strong> Click &quot;Performance Test&quot; and record a performance profile</div>
          <div><strong>Memory Tab:</strong> Click &quot;Memory Test&quot; and take a heap snapshot</div>
          <div><strong>Console Tab:</strong> All button clicks log messages with different severity levels</div>
          <div><strong>Elements Tab:</strong> Inspect this component&apos;s DOM structure and styling</div>
        </div>
      </div>
    </div>
  );
};

export default DevToolsShowcase;