import { forwardRef } from 'react';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = forwardRef<HTMLInputElement, Props>(({ value, onChange, placeholder = 'Search…' }: Props, ref) => {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <Search
        size={15}
        style={{
          position: 'absolute',
          left: 12,
          color: 'var(--text-2)',
          pointerEvents: 'none',
        }}
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: 38, width: 260 }}
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
