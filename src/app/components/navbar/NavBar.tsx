import { AppUser } from "@/app/home/page";
import { Avatar } from "@mui/material";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation"; // For navigation
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdVaccines } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
interface NavBarProps {
  profilePicture: string | null;
  firstName: string | null;
  isRegistered: boolean; // Check if the user is registered
}
const NavBar = ({ profilePicture, firstName, isRegistered }: NavBarProps) => {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter(); 
  const auth = getAuth(); 
  const db = getFirestore();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const appUserFetch = localStorage.getItem("user");
    if (appUserFetch) {
      const x = JSON.parse(appUserFetch) as AppUser;
      setAppUser(x);
    }
  }, []);
  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      const storedUsername = localStorage.getItem("username");

      if (storedUsername) {
        setUserName(storedUsername);
        return;
      }

      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const fetchedName = userDoc.data()?.name || "User";
          setUserName(fetchedName);
          console.log(localStorage.setItem("username", fetchedName));
        } else {
          setUserName("");
        }
      }
    };

    fetchUserName();
  }, [auth, db]);

  const handleDashboardClick = () => {
    router.push("/dash"); // Navigate to the dashboard
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
         
          <div className="flex items-center">
            <MdVaccines className="text-3xl text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">
              Vaccine Reminder
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {appUser?.name ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-800 font-medium">
                  {appUser.name}
                </span>

                <button
                  onClick={handleDashboardClick}
                  className="text-gray-800 hover:text-blue-600 focus:outline-none"
                >
                  <RxDashboard className="text-2xl" />
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300"
              >
                Login
              </a>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {isRegistered ? (
              <>
                {profilePicture && (
                  <div className="flex items-center space-x-2">
                    <Avatar src={profilePicture} alt="Profile" />
                    {firstName && (
                      <span className="text-gray-800 font-medium">
                        {firstName}
                      </span>
                    )}
                  </div>
                )}
                <a
                  href="/dash"
                  className="block text-gray-800 hover:text-blue-600 text-sm font-medium transition duration-300"
                >
                  Dashboard
                </a>
              </>
            ) : (
              <a
                href="/login"
                className="block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300 text-center"
              >
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
