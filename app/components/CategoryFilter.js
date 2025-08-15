'use client';

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
          selectedCategory === 'all'
            ? 'bg-white text-black'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            selectedCategory === category
              ? 'bg-white text-black'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}