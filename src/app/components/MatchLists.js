export default function MatchList({ matches }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match, index) => (
        <div 
          key={index}
          className="bg-[#001824] p-4 rounded-lg shadow-md border border-gray-700"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {match.mentor.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-emerald-400">Parrain</h3>
                <p className="text-sm text-emerald-200">{match.mentor.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {match.mentee.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-emerald-400">Filleul</h3>
                <p className="text-sm text-emerald-200">{match.mentee.name}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}