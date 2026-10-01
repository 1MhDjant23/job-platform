import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useState } from "react";


export  function Navbar() {
    const   { user, logout } = useAuth();
    const   navigate = useNavigate();
    const   location = useLocation();
    const   [menuOpen, setMenuOpen] = useState<boolean>(false);
    const   [loggingOut, setLoggingOut] = useState<boolean>(false);

    const   handleLogout = async () => {
        setLoggingOut(true);

        try {
            await logout();
            navigate('/login', { replace: true });
        } finally {
            setLoggingOut(false);
        }
    };

    // active link check
    const   isActive = (path: string) =>
        location.pathname === path
            ? 'text-blue-600 font-medium'
            : 'text-gray-600 hover:text-gray-900';

    // links depend on Role
    const navLinks = user?.role === 'EMPLOYER'
        ? [
            { to: '/jobs', label: 'Browse Jobs' },
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/post-job', label: 'Post a Job' },
          ]
        : user?.role === 'JOB_SEEKER'
        ? [
            { to: '/jobs', label: 'Browse Jobs' },
            { to: '/applications', label: 'My Applications' },
          ]
        : [
            { to: '/jobs', label: 'Browse Jobs' },
          ];
    
    
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    {/* logo  */}
                    <Link
                        to={'/'}
                        className="font-semibold text-gray-900 text-base"
                    >
                        JobBoard
                    </Link>

                    {/* Desktop links  */}
                    <div className="hidden sm:flex items-center gap-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`text-sm transition-colors ${isActive(link.to)}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Desktop auth  */}
                        <div className="hidden sm:flex items-center gap-3">
                            {user ? (
                                <>
                                    {/* avatar + name  */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100
                                            flex items-center justify-center
                                            overflow-hidden">
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.firstname}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-semibold text-blue-600">
                                                    {user.firstname.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-700">
                                            {user.firstname}
                                        </span>
                                    </div>
                                    {/* Logout  */}
                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="text-sm text-gray-500 hover:text-gray-900
                                            disabled:opacity-50 transition-colors" 
                                    >
                                        {loggingOut ? 'Signing out...' : 'Sign out'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to={'/login'}
                                        className="text-sm text-gray-600 hover:text-gray-900
                                            transition-colors" 
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to={'/register'}
                                        className="text-sm px-4 py-1.5 bg-blue-600 text-white
                                            rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile humburger */}
                        <button
                            onClick={() => setMenuOpen(prev => !prev)}
                            className="sm:hidden p-2 text-gray-500 hover:text-gray-900"
                            aria-label="toggle menu"
                        >
                            {menuOpen ? (
                                <span className="text-xl leading-none">×</span>
                            ) : (
                                <div className="space-y-1">
                                    <div className="w-5 h-0.5 bg-current" />
                                    <div className="w-5 h-0.5 bg-current" />
                                    <div className="w-5 h-0.5 bg-current" />
                                </div>
                            )}
                        </button>
                    </div>

                    {/* mobile menu  */}
                    {menuOpen && (
                        <div className="sm:hidden border-t border-gray-100 py-3
                            flex flex-col gap-1"
                        >
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-2 py-2 text-sm rounded-lg transition-colors
                                        ${location.pathname === link.to
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="border-t border-gray-100 mt-2 pt-2">
                                {user ? (
                                    <>
                                        <div className="px-2 py-2 text-sm text-gray-500">
                                            {user.firstname} . {user.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}
                                        </div>
                                        <button
                                            onClick={() => { handleLogout(); setMenuOpen(false); }}
                                            className="w-full text-left px-2 py-2 text-sm
                                            text-red-600 hover:bg-red-50 rounded-lg
                                            transition-colors"
                                        >
                                            Sign out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to={'/login'}
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-2 py-2 text-sm text-gray-700
                                               hover:bg-gray-50 rounded-lg"     
                                        >
                                            Sing in
                                        </Link>
                                        <Link
                                            to={'/register'}
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-2 py-2 text-sm text-blue-600
                                               font-medium hover:bg-blue-50 rounded-lg"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                )}

                            </div>
                        </div>
                    )}

                </div>

            </div>
             
        </nav>
    );
}