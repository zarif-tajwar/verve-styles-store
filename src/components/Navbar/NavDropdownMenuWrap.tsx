import { auth, getUserObjectClient } from '@/lib/server/auth';
import CartMenu from './CartMenu';
import NavUserDropdown from './NavUserDropdown';
import SearchMenu from './SearchMenu';

const NavDropdownMenuWrap = async () => {
  const authObject = await auth();

  const isLoggedIn = !!authObject.session;

  const userObjectClient = getUserObjectClient(authObject.user);

  return (
    <div className="flex items-center lg:-mx-2">
      <SearchMenu />
      <CartMenu isLoggedIn={isLoggedIn} />
      <NavUserDropdown user={userObjectClient} />
    </div>
  );
};

export default NavDropdownMenuWrap;
