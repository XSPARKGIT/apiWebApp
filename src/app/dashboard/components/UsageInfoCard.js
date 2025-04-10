'use client';

export default function UsageInfoCard() {
  return (
    <div className="mb-8 p-8 rounded-lg" style={{
      background: 'linear-gradient(135deg, #f5a88e 0%, #a57bcd 100%)',
      color: 'white'
    }}>
      <div className="flex justify-between mb-4">
        <div className="uppercase text-sm font-bold opacity-80">Current Plan</div>
        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-1 rounded-md flex items-center">
          <span>Manage Plan</span>
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-6">Researcher</h1>
      
      <div>
        <div className="flex items-center mb-2">
          <div className="font-semibold mr-2">API Usage</div>
          <div className="text-white opacity-70 cursor-help">ⓘ</div>
        </div>
        <div className="mb-1 flex justify-between">
          <div>Plan</div>
          <div>0 / 1,000 Credits</div>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
          <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
        
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-white mr-2 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
          <div>Pay as you go</div>
          <div className="text-white opacity-70 cursor-help ml-2">ⓘ</div>
        </div>
      </div>
    </div>
  );
} 