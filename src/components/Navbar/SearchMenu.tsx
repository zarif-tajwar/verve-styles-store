import { SearchIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';

const SearchMenu = () => {
  return (
    <Button variant={'ghost'} size={'square'} className="text-primary-500">
      <SearchIcon />
    </Button>
  );
};

export default SearchMenu;
