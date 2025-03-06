
interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

const SizeSelector = ({ sizes, selectedSize, onSelectSize }: SizeSelectorProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-3">Size</h3>
      <div className="grid grid-cols-6 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`py-2 px-3 text-sm border ${
              selectedSize === size
                ? 'border-black bg-black text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onSelectSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
