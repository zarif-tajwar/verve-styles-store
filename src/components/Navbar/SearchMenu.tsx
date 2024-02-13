import { SearchIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';

const SearchMenu = () => {
  return (
    <div className="lg:hidden">
      <Button variant={'ghost'} size={'square'} className="text-primary-500">
        <SearchIcon />
      </Button>
    </div>
  );
};

export default SearchMenu;
