import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const Tickets = () => {
	const { auth } = useContext(AuthContext)
	const [tickets, setTickets] = useState([])
	const [isFetchingticketsDone, setIsFetchingticketsDone] = useState(false)
	const [isChatbotVisible, setIsChatbotVisible] = useState(false)
	const fetchTickets = async () => {
		try {
			setIsFetchingticketsDone(false)
			const response = await axios.get('/auth/tickets', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			setTickets(
				response.data.data.tickets?.sort((a, b) => {
					if (a.showtime.showtime > b.showtime.showtime) {
						return 1
					}
					return -1
				})
			)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingticketsDone(true)
		}
	}

	useEffect(() => {
		fetchTickets()
	}, []);

	const toggleChatbot = () => {
		setIsChatbotVisible(!isChatbotVisible)
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-white pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-white p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<h2 className="text-3xl font-bold text-gray-900">My Tickets</h2>
				{isFetchingticketsDone ? (
					<>
						{tickets.length === 0 ? (
							<p className="text-center">You have not purchased any tickets yet</p>
						) : (
							<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-[1920px]:grid-cols-3">
								{tickets.map((ticket, index) => {
									return (
										<div className="flex flex-col" key={index}>
											<ShowtimeDetails showtime={ticket.showtime} />
											<div className="flex h-full flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
												<div className="flex h-full flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
													<p className="whitespace-nowrap font-semibold">Seats : </p>
													<p className="text-left">
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
				) : (
					<Loading />
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

export default Tickets
