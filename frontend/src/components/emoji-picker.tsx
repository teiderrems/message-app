import React, { useState } from 'react';

interface EmojiPickerProps {
  onEmojiSelect?: (emoji: string) => void;
  onClose: () => void;
  className?: string;
  setMessage:React.Dispatch<React.SetStateAction<string>>
}


const EmojiPicker: React.FC<EmojiPickerProps> = ({ 
  onClose,
  setMessage,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('frequent');

  // Mock emoji data - in a real app, this would come from an API
  const emojiData: Record<string, string[]> = {
    frequent: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚'],
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳'],
    people: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸', '🎣', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🧿', '🎮', '🕹'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', 'tractor', '🦽', '🦼', '🚲', '🛴', '🛵', '🏍', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛']
  };

  const categories: string[] = Object.keys(emojiData);
  const allEmojis: string[] = Object.values(emojiData).flat();

  const filteredEmojis: string[] | undefined = searchTerm 
    ? allEmojis.filter(emoji => emoji.includes(searchTerm))
    : emojiData[activeCategory];

  const handleEmojiClick = (emoji: string): void => {
    setMessage(state=>state+emoji);
  };

  const handleCategoryClick = (category: string): void => {
    setActiveCategory(category);
    setSearchTerm('');
  };

  return (
    <div className={`bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-auto ${className}`}>
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des émojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <svg 
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Category Sidebar */}
        <div className="w-16 bg-gray-50 border-r border-gray-100">
          {categories.map((category) => {
            let icon = '🙂';
            switch(category) {
              case 'frequent': icon = '⭐'; break;
              case 'smileys': icon = '🙂'; break;
              case 'people': icon = '👋'; break;
              case 'animals': icon = '🐶'; break;
              case 'food': icon = '🍎'; break;
              case 'activities': icon = '⚽'; break;
              case 'travel': icon = '🚗'; break;
              case 'objects': icon = '📱'; break;
            }
            
            return (
              <button
                key={category}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category);
                }}
                className={`w-full p-3 text-lg hover:bg-gray-100 transition-colors ${
                  activeCategory === category ? 'bg-white border-r-2 border-blue-500' : ''
                }`}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
              >
                {icon}
              </button>
            );
          })}
        </div>

        {/* Emoji Grid */}
        <div className="flex-1 p-3">
          <div className="grid grid-cols-8 gap-1 max-h-60 overflow-y-auto">
            {filteredEmojis?.map((emoji, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleEmojiClick(emoji);
                }}
                className="text-2xl hover:bg-gray-100 rounded p-1 transition-all duration-150 hover:scale-110 active:scale-95"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
          
          {filteredEmojis && filteredEmojis.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Aucun emoji trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onClose}
          className="w-full text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-1 px-3 rounded transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default EmojiPicker;