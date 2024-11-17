const ViewOptions = ({ viewMode, setViewMode, viewModes }) => {
    return (
      <div className="flex gap-2">
        {Object.values(viewModes).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-1.5 text-md rounded transition-colors ${
              viewMode === mode
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {mode.replace('_', ' ').toLowerCase()}
          </button>
        ))}
      </div>
    );
  };

export default ViewOptions
  