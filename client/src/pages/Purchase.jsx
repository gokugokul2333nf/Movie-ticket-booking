import { TicketIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'


const Purchase = () => {
	const navigate = useNavigate()
	const { auth } = useContext(AuthContext)
	const location = useLocation()
	const showtime = location.state.showtime
	const selectedSeats = location.state.selectedSeats || []

	const [showPaymentForm, setShowPaymentForm] = useState(false)
	const [paymentMethod, setPaymentMethod] = useState('card')
	const [isProcessingPayment, setIsProcessingPayment] = useState(false)
	const [ticketConfirmed, setTicketConfirmed] = useState(false)

	const onPurchase = () => {
		setShowPaymentForm(true)
	}

	const handlePayment = async () => {
		setIsProcessingPayment(true)
		try {
			await axios.post(
				`/showtime/${showtime._id}`,
				{ seats: selectedSeats },
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)

			setTicketConfirmed(true)
			toast.success('Payment successful & Tickets confirmed!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error(error.response?.data?.message || 'Payment failed!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			setIsProcessingPayment(false)
		}
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-white pb-8 sm:gap-8">
			<Navbar />
			<div className="mx-4 h-fit rounded-lg bg-white p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<ShowtimeDetails showtime={showtime} />
				<div className="flex flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
					<div className="flex flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
						<p className="font-semibold">Selected Seats : </p>
						<p className="text-start">{selectedSeats.join(', ')}</p>
						{!!selectedSeats.length && (
							<p className="whitespace-nowrap">({selectedSeats.length} seats)</p>
						)}
					</div>
					{!!selectedSeats.length && !showPaymentForm && !ticketConfirmed && (
						<button
							onClick={onPurchase}
							className="flex items-center justify-center gap-2 rounded-b-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-4 py-1 font-semibold text-white hover:from-indigo-500 hover:to-blue-500 md:rounded-none md:rounded-br-lg"
						>
							<p>Confirm Purchase</p>
							<TicketIcon className="h-7 w-7 text-white" />
						</button>
					)}
				</div>

				{/* Payment Form */}
				{showPaymentForm && !ticketConfirmed && (
					<div className="mx-auto mt-6 w-full max-w-md rounded-lg bg-white p-4 shadow-md">
						<h2 className="mb-4 text-xl font-bold text-gray-700">Complete Payment</h2>

						<div className="mb-4 flex gap-4">
							<label>
								<input
									type="radio"
									value="card"
									checked={paymentMethod === 'card'}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="mr-2"
								/>
								Card
							</label>
							<label>
								<input
									type="radio"
									value="upi"
									checked={paymentMethod === 'upi'}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="mr-2"
								/>
								UPI
							</label>
						</div>

						{paymentMethod === 'card' ? (
							<div className="space-y-2">
								<input type="text" placeholder="Card Number" className="w-full rounded border p-2" />
								<input type="text" placeholder="Cardholder Name" className="w-full rounded border p-2" />
								<div className="flex gap-2">
									<input type="text" placeholder="MM/YY" className="w-1/2 rounded border p-2" />
									<input type="text" placeholder="CVV" className="w-1/2 rounded border p-2" />
								</div>
							</div>
						) : (
							<input type="text" placeholder="Enter UPI ID" className="w-full rounded border p-2" />
						)}

						<button
							onClick={handlePayment}
							className="mt-4 w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
							disabled={isProcessingPayment}
						>
							{isProcessingPayment ? 'Processing Payment...' : 'Pay Now'}
						</button>
					</div>
				)}

				{/* Ticket Preview + Download */}
				{ticketConfirmed && (
					<div className="mx-auto mt-6 w-full max-w-md rounded-lg bg-green-100 p-4 text-center shadow-md">
						<h2 className="text-2xl font-bold text-green-800">🎉 Ticket Confirmed!</h2>
						<p className="mt-2 text-gray-800">Your seats are booked successfully.</p>
						<button
							onClick={() => navigate('/cinema')}
							className="mt-2 w-full rounded border border-green-700 py-2 font-semibold text-green-700 hover:bg-green-200"
						>
							Back to Home
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default Purchase
