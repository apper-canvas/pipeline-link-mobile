import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "contacts", label: "Contacts", icon: "Users" },
    { path: "pipeline", label: "Pipeline", icon: "TrendingUp" }
  ];

  const isActive = (path) => {
    if (path === "") {
      return location.pathname === "/";
    }
    return location.pathname.includes(`/${path}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <ApperIcon name="Zap" className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">Pipeline Pro</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path === "" ? "/" : `/${item.path}`}
                  className="relative"
                >
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-primary bg-blue-50"
                      : "text-secondary hover:bg-gray-100"
                  }`}>
                    <ApperIcon name={item.icon} size={18} />
                    {item.label}
                  </div>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar 
              placeholder="Search contacts, deals..." 
              className="hidden sm:block w-64 lg:w-80"
            />
            <button className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200">
              <ApperIcon name="Bell" size={20} className="text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50">
        <nav className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path === "" ? "/" : `/${item.path}`}
              className={`flex flex-col items-center gap-1 py-2 ${
                isActive(item.path) ? "text-primary" : "text-secondary"
              }`}
            >
              <ApperIcon name={item.icon} size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;