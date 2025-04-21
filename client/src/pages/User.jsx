import {
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	MagnifyingGlassIcon,
	TicketIcon,
	TrashIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const User = () => {
	const { auth } = useContext(AuthContext)
	const [users, setUsers] = useState(null)
	const [ticketsUser, setTicketsUser] = useState(null)
	const [tickets, setTickets] = useState([])
	const [isUpdating, SetIsUpdating] = useState(false)
	const [isDeleting, SetIsDeleting] = useState(false)
	const [isChatbotVisible, setIsChatbotVisible] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const fetchUsers = async (data) => {
		try {
			// setIsFetchingShowtimesDone(false)
			const response = await axios.get('/auth/user', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data.data)
			setUsers(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			// setIsFetchingShowtimesDone(true)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const onUpdateUser = async (data) => {
		try {
			SetIsUpdating(true)
			const response = await axios.put(`/auth/user/${data.id}`, data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchUsers()
			toast.success(`Update ${response.data.data.username} to ${response.data.data.role} successful!`, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsUpdating(false)
		}
	}

	const handleDelete = (data) => {
		const confirmed = window.confirm(`Do you want to delete user ${data.username}?`)
		if (confirmed) {
			onDeleteUser(data)
		}
	}

	const onDeleteUser = async (data) => {
		try {
			SetIsDeleting(true)
			const response = await axios.delete(`/auth/user/${data.id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchUsers()
			toast.success(`Delete successful!`, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsDeleting(false)
		}
	}

	const toggleChatbot = () => {
		setIsChatbotVisible(!isChatbotVisible)
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-white pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-2 rounded-lg bg-white p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<h2 className="text-3xl font-bold text-gray-900">Users</h2>
				<div className="relative drop-shadow-sm">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-gray-500" />
					</div>
					<input
						type="search"
						className="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-gray-900"
						placeholder="Search username"
						{...register('search')}
					/>
				</div>
				<div
					className={`mt-2 grid max-h-[60vh] overflow-auto rounded-md bg-gradient-to-br from-indigo-100 to-white`}
					style={{ gridTemplateColumns: 'repeat(3, minmax(max-content, 1fr)) max-content max-content' }}
				>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
						Username
					</p>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
						Email
					</p>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
						Role
					</p>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
						Ticket
					</p>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
						Action
					</p>
					{users
						?.filter((user) => user.username.toLowerCase().includes(watch('search')?.toLowerCase() || ''))
						.map((user, index) => {
							return (
								<Fragment key={index}>
									<div className="border-t-2 border-indigo-200 px-2 py-1">{user.username}</div>
									<div className="border-t-2 border-indigo-200 px-2 py-1">{user.email}</div>
									<div className="border-t-2 border-indigo-200 px-2 py-1">{user.role}</div>
									<div className="border-t-2 border-indigo-200 px-2 py-1">
										<button
											className={`flex items-center justify-center gap-1 rounded bg-gradient-to-r py-1 pl-2 pr-1.5 text-sm font-medium text-white  disabled:from-slate-500 disabled:to-slate-400
										${
											ticketsUser === user.username
												? 'from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400'
												: 'from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400'
										}`}
											onClick={() => {
												setTickets(user.tickets)
												setTicketsUser(user.username)
											}}
										>
											View {user.tickets.length} Tickets
											<TicketIcon className="h-6 w-6" />
										</button>
									</div>
									<div className="flex gap-2 border-t-2 border-indigo-200 px-2 py-1">
										{user.role === 'user' && (
											<button
												className="flex w-[115px] items-center justify-center gap-1 rounded bg-gradient-to-r from-indigo-600 to-blue-500 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400"
												onClick={() => onUpdateUser({ id: user._id, role: 'admin' })}
												disabled={isUpdating}
											>
												Set Admin
												<ChevronDoubleUpIcon className="h-5 w-5" />
											</button>
										)}
										{user.role === 'admin' && (
											<button
												className="flex w-[115px] items-center justify-center gap-1 rounded bg-gradient-to-r from-indigo-600 to-blue-500 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400"
												onClick={() => onUpdateUser({ id: user._id, role: 'user' })}
												disabled={isUpdating}
											>
												Set User
												<ChevronDoubleDownIcon className="h-5 w-5" />
											</button>
										)}
										<button
											className="flex w-[115px] items-center justify-center gap-1 rounded bg-gradient-to-r from-red-700 to-rose-600 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-red-600 hover:to-rose-500 disabled:from-slate-500 disabled:to-slate-400"
											onClick={() => handleDelete({ id: user._id, username: user.username })}
											disabled={isDeleting}
										>
											DELETE
											<TrashIcon className="h-5 w-5" />
										</button>
									</div>
								</Fragment>
							)
						})}
				</div>
				{ticketsUser && (
					<>
						<h2 className="mt-4 text-2xl font-bold text-gray-900">Viewing {ticketsUser}'s tickets</h2>
						{tickets.length === 0 ? (
							<p className="text-center">This user have not purchased any tickets yet</p>
						) : (
							<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-[1920px]:grid-cols-3">
								{tickets.map((ticket, index) => {
									return (
										<div className="flex flex-col" key={index}>
											<ShowtimeDetails showtime={ticket.showtime} />
											<div className="flex h-full flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
												<div className="flex h-full flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
													<p className="whitespace-nowrap font-semibold">Seats : </p>
													<p>
														{ticket.seats.map((seat) => seat.row + seat.number).join(', ')}
													</p>
													<p className="whitespace-nowrap">({ticket.seats.length} seats)</p>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</>
				)}
			</div>
			<img
				src="data:image/png;base64,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" // Replace this with your chatbot logo URL
				alt="Chatbot Logo"
				style={{
					position: 'fixed',
					bottom: '20px',
					right: '20px',
					cursor: 'pointer',
					width: '50px',
					height: '50px',
				}}
				onClick={toggleChatbot}
			/>

			{/* Chatbot iframe */}
			{isChatbotVisible && (
				<iframe
					src="https://landbot.online/v3/H-2891691-TNWZPK9DT0763C0S/index.html"
					style={{
						position: 'fixed',
						bottom: '80px', // Adjust to avoid overlap with icon
						right: '20px',
						width: '300px',
						height: '400px',
						border: 'none',
						borderRadius: '10px',
						boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
					}}
					title="Chatbot"
				/>
			)}
		</div>
	)
}

export default User
