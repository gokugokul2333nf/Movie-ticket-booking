import {
	ClockIcon,
	FilmIcon,
	HomeModernIcon,
	MagnifyingGlassIcon,
	TicketIcon,
	UsersIcon,
	VideoCameraIcon
} from '@heroicons/react/24/outline'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
	const { auth, setAuth } = useContext(AuthContext)
	const [menuOpen, setMenuOpen] = useState(false)
	const [isLoggingOut, setLoggingOut] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()

	const toggleMenu = () => setMenuOpen(prev => !prev)

	const onLogout = async () => {
		try {
			setLoggingOut(true)
			await axios.get('/auth/logout')
			setAuth({ username: null, email: null, role: null, token: null })
			sessionStorage.clear()
			navigate('/')
			toast.success('Logout successful!', {
				position: 'top-center',
				autoClose: 2000
			})
		} catch (err) {
			console.error(err)
			toast.error('Error logging out', {
				position: 'top-center',
				autoClose: 2000
			})
		} finally {
			setLoggingOut(false)
		}
	}

	const navLink = (to, icon, label) => {
		const isActive = location.pathname === to
		return (
			<Link
				to={to}
				className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive
					? 'font-extrabold text-black border-b-2 border-red-600'
					: 'text-gray-700 hover:bg-gray-100'
					}`}
			>
				{icon}
				<span className="font-semibold">{label}</span>
			</Link>
		)
	}

	return (
		<nav className="bg-white shadow-md px-6 py-4">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center">
					<Link to="/">
						<img
							src="https://cdn.vectorstock.com/i/1000v/38/76/cinema-logo-movie-emblem-template-vector-19873876.jpg"
							alt="Cinema Logo"
							className="h-16 w-auto rounded-md shadow-md"
						/>
					</Link>
					<h1 className="text-gray-900 ml-2">Cinema</h1>
				</div>
				{auth.username && (
					<div className="ml-6">
						<p className="text-lg font-semibold text-gray-800">
							Welcome, {auth.username}!
						</p>
					</div>
				)}

				{/* Hamburger */}
				<div className="lg:hidden">
					<button onClick={toggleMenu}>
						{menuOpen ? (
							<XMarkIcon className="w-6 h-6 text-gray-900" />
						) : (
							<Bars3Icon className="w-6 h-6 text-gray-900" />
						)}
					</button>
				</div>

				{/* Desktop Nav */}
				<div className="hidden lg:flex lg:items-right lg:gap-6">
					{navLink('/cinema', <HomeModernIcon className="h-5 w-5" />, 'Cinema')}
					{navLink('/schedule', <ClockIcon className="h-5 w-5" />, 'Schedule')}
					{auth.role && navLink('/ticket', <TicketIcon className="h-5 w-5" />, 'Ticket')}

					{auth.role === 'admin' && (
						<>
							{navLink('/movie', <VideoCameraIcon className="h-5 w-5" />, 'Movie')}
							{navLink('/search', <MagnifyingGlassIcon className="h-5 w-5" />, 'Search')}
							{navLink('/user', <UsersIcon className="h-5 w-5" />, 'User')}
						</>
					)}
					{auth.token ? (
						<button
							onClick={onLogout}
							disabled={isLoggingOut}
							className="text-gray-900 font-bold px-5 py-2 rounded-full hover:text-gray-800 flex items-center gap-2 transition"
						>
							<i className="fas fa-sign-out-alt"></i> {/* Logout Icon */}
							{isLoggingOut ? 'Logging out...' : 'Logout'}
						</button>
					) : (
						<Link
							to="/login"
							className="text-gray-900 font-bold px-5 py-2 rounded-full hover:text-gray-800 flex items-center gap-2 transition"
						>
							<i className="fas fa-sign-in-alt"></i> {/* Login Icon */}
							Login
						</Link>
					)}
				</div>
			</div>

			{/* Mobile Nav */}
			{menuOpen && (
				<div className="lg:hidden mt-4 flex flex-col gap-3">
					{navLink('/cinema', <HomeModernIcon className="h-5 w-5" />, 'Cinema')}
					{navLink('/schedule', <ClockIcon className="h-5 w-5" />, 'Schedule')}
					{auth.role && navLink('/ticket', <TicketIcon className="h-5 w-5" />, 'Ticket')}
					{auth.role === 'admin' && (
						<>
							{navLink('/movie', <VideoCameraIcon className="h-5 w-5" />, 'Movie')}
							{navLink('/search', <MagnifyingGlassIcon className="h-5 w-5" />, 'Search')}
							{navLink('/user', <UsersIcon className="h-5 w-5" />, 'User')}
						</>
					)}
					<div className="border-t pt-3 flex flex-col gap-2">
						{auth.username && (
							<p className="text-sm text-gray-600">Welcome, {auth.username}</p>
						)}

						{auth.token ? (
							<button
								onClick={onLogout}
								disabled={isLoggingOut}
								className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-2 rounded-full hover:from-gray-700 hover:to-gray-800 transition"
							>
								{isLoggingOut ? 'Logging out...' : 'Logout'}
							</button>
						) : (
							<Link
								to="/login"
								className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-2 rounded-full hover:from-gray-700 hover:to-gray-800 transition"
							>
								Login
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	)
}

export default Navbar
