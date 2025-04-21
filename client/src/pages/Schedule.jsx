import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-tailwindcss-select'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CinemaLists from '../components/CinemaLists'
import DateSelector from '../components/DateSelector'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ScheduleTable from '../components/ScheduleTable'
import { AuthContext } from '../context/AuthContext'

const Schedule = () => {
	const { auth } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors }
	} = useForm()
	const [selectedDate, setSelectedDate] = useState(
		(sessionStorage.getItem('selectedDate') && new Date(sessionStorage.getItem('selectedDate'))) || new Date()
	)
	const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
		parseInt(sessionStorage.getItem('selectedCinemaIndex')) || 0
	)
	const [cinemas, setCinemas] = useState([])
	const [isFetchingCinemas, setIsFetchingCinemas] = useState(true)
	const [movies, setMovies] = useState()
	const [isAddingShowtime, SetIsAddingShowtime] = useState(false)
	const [selectedMovie, setSelectedMovie] = useState(null)
	const [isChatbotVisible, setIsChatbotVisible] = useState(false)

	const fetchCinemas = async (data) => {
		try {
			setIsFetchingCinemas(true)
			let response
			if (auth.role === 'admin') {
				response = await axios.get('/cinema/unreleased', {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get('/cinema')
			}
			// console.log(response.data.data)
			setCinemas(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingCinemas(false)
		}
	}

	useEffect(() => {
		fetchCinemas()
	}, [])

	const fetchMovies = async (data) => {
		try {
			const response = await axios.get('/movie')
			// console.log(response.data.data)
			setMovies(response.data.data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	useEffect(() => {
		setValue('autoIncrease', true)
		setValue('rounding5', true)
		setValue('gap', '00:10')
	}, [])

	const onAddShowtime = async (data) => {
		try {
			SetIsAddingShowtime(true)
			if (!data.movie) {
				toast.error('Please select a movie', {
					position: 'top-center',
					autoClose: 2000,
					pauseOnHover: false
				})
				return
			}
			let showtime = new Date(selectedDate)
			const [hours, minutes] = data.showtime.split(':')
			showtime.setHours(hours, minutes, 0)
			const response = await axios.post(
				'/showtime',
				{ movie: data.movie, showtime, theater: data.theater, repeat: data.repeat, isRelease: data.isRelease },
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			// console.log(response.data)
			fetchCinemas()
			if (data.autoIncrease) {
				const movieLength = movies.find((movie) => movie._id === data.movie).length
				const [GapHours, GapMinutes] = data.gap.split(':').map(Number)
				const nextShowtime = new Date(showtime.getTime() + (movieLength + GapHours * 60 + GapMinutes) * 60000)
				if (data.rounding5 || data.rounding10) {
					const totalMinutes = nextShowtime.getHours() * 60 + nextShowtime.getMinutes()
					const roundedMinutes = data.rounding5
						? Math.ceil(totalMinutes / 5) * 5
						: Math.ceil(totalMinutes / 10) * 10
					let roundedHours = Math.floor(roundedMinutes / 60)
					const remainderMinutes = roundedMinutes % 60
					if (roundedHours === 24) {
						nextShowtime.setDate(nextShowtime.getDate() + 1)
						roundedHours = 0
					}
					setValue(
						'showtime',
						`${String(roundedHours).padStart(2, '0')}:${String(remainderMinutes).padStart(2, '0')}`
					)
				} else {
					setValue(
						'showtime',
						`${String(nextShowtime.getHours()).padStart(2, '0')}:${String(
							nextShowtime.getMinutes()
						).padStart(2, '0')}`
					)
				}
				if (data.autoIncreaseDate) {
					setSelectedDate(nextShowtime)
					sessionStorage.setItem('selectedDate', nextShowtime)
				}
			}
			toast.success('Add showtime successful!', {
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
			SetIsAddingShowtime(false)
		}
	}

	const props = {
		cinemas,
		selectedCinemaIndex,
		setSelectedCinemaIndex,
		fetchCinemas,
		auth,
		isFetchingCinemas
	}

	const toggleChatbot = () => {
		setIsChatbotVisible(!isChatbotVisible)
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-white pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<CinemaLists {...props} />
			{selectedCinemaIndex !== null &&
				(cinemas[selectedCinemaIndex]?.theaters?.length ? (
					<div className="mx-4 flex flex-col gap-2 rounded-lg bg-white p-4 drop-shadow-xl sm:mx-8 sm:gap-4 sm:p-6">
						<h2 className="text-3xl font-bold text-gray-900">Schedule</h2>
						<DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
						{auth.role === 'admin' && (
							<form
								className="flex flex-col lg:flex-row gap-4 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4"
								onSubmit={handleSubmit(onAddShowtime)}
							>
								<div className="flex grow flex-col gap-2 rounded-lg">
									<div className="flex flex-col gap-2 rounded-lg lg:flex-row lg:items-stretch">
										<div className="flex grow items-center gap-x-2 gap-y-1 lg:flex-col lg:items-start">
											<label className="whitespace-nowrap text-lg font-semibold leading-5">
												Theater:
											</label>
											<select
												className="h-9 w-full rounded bg-white px-2 py-1 font-semibold text-gray-900 drop-shadow-sm"
												required
												{...register('theater', { required: true })}
											>
												<option value="" defaultValue>
													Choose a theater
												</option>
												{cinemas[selectedCinemaIndex].theaters?.map((theater, index) => {
													return (
														<option key={index} value={theater._id}>
															{theater.number}
														</option>
													)
												})}
											</select>
										</div>
										<div className="flex grow-[2] items-center gap-x-2 gap-y-1 lg:flex-col lg:items-start">
											<label className="whitespace-nowrap text-lg font-semibold leading-5">
												Movie:
											</label>
											<Select
												value={selectedMovie}
												options={movies?.map((movie) => ({
													value: movie._id,
													label: movie.name
												}))}
												onChange={(value) => {
													setValue('movie', value.value)
													setSelectedMovie(value)
												}}
												isSearchable={true}
												primaryColor="indigo"
												classNames={{
													menuButton: (value) =>
														'flex font-semibold text-sm border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20'
												}}
											/>
										</div>
										<div className="flex items-center gap-x-2 gap-y-1 lg:flex-col lg:items-start">
											<label className="whitespace-nowrap text-lg font-semibold leading-5">
												Showtime:
											</label>
											<input
												type="time"
												className="h-9 w-full rounded bg-white px-2 py-1 font-semibold text-gray-900 drop-shadow-sm"
												required
												{...register('showtime', { required: true })}
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2 rounded-lg lg:flex-row lg:items-stretch">
										<div className="flex items-center gap-x-2 gap-y-1 lg:flex-col lg:items-start">
											<label className="whitespace-nowrap text-lg font-semibold leading-5">
												Repeat (Day):
											</label>
											<input
												type="number"
												min={1}
												defaultValue={1}
												max={31}
												className="h-9 w-full rounded bg-white px-2 py-1 font-semibold text-gray-900 drop-shadow-sm"
												required
												{...register('repeat', { required: true })}
											/>
										</div>
										<label className="flex items-center gap-x-2 gap-y-1 whitespace-nowrap text-lg font-semibold leading-5 lg:flex-col lg:items-start">
											Release now:
											<input
												type="checkbox"
												className="h-6 w-6 lg:h-9 lg:w-9"
												{...register('isRelease')}
											/>
										</label>
										<div className="flex flex-col items-start gap-2 lg:flex-row lg:items-end">
											<p className="font-semibold text-right underline">Auto increase</p>
											<label
												className="flex items-center gap-x-2 gap-y-1 whitespace-nowrap font-semibold leading-5 lg:flex-col lg:items-start"
												title="After add, update showtime value to the movie ending time"
											>
												Showtime:
												<input
													type="checkbox"
													className="h-6 w-6 lg:h-9 lg:w-9"
													{...register('autoIncrease')}
												/>
											</label>
											<label
												className="flex items-center gap-x-2 gap-y-1 whitespace-nowrap font-semibold leading-5 lg:flex-col lg:items-start"
												title="After add, update date value to the movie ending time"
											>
												Date:
												<input
													type="checkbox"
													className="h-6 w-6 lg:h-9 lg:w-9"
													disabled={!watch('autoIncrease')}
													{...register('autoIncreaseDate')}
												/>
											</label>
										</div>
										<div
											className="flex items-center gap-x-2 gap-y-1 lg:flex-col lg:items-start"
											title="Gap between showtimes"
										>
											<label className="whitespace-nowrap font-semibold leading-5">Gap:</label>
											<input
												type="time"
												className="h-9 w-full rounded bg-white px-2 py-1 font-semibold text-gray-900 drop-shadow-sm disabled:bg-gray-300"
												disabled={!watch('autoIncrease')}
												{...register('gap')}
											/>
										</div>
										<div className="flex flex-col items-start gap-2 lg:flex-row lg:items-end">
											<p className="font-semibold text-right underline">Rounding</p>
											<label
												className="flex items-center gap-x-2 gap-y-1 whitespace-nowrap font-semibold leading-5 lg:flex-col lg:items-start"
												title="Rounding up to the nearest five minutes"
											>
												5-min:
												<input
													type="checkbox"
													className="h-6 w-6 lg:h-9 lg:w-9"
													disabled={!watch('autoIncrease')}
													{...register('rounding5', {
														onChange: () => setValue('rounding10', false)
													})}
												/>
											</label>
											<label
												className="flex items-center gap-x-2 gap-y-1 whitespace-nowrap font-semibold leading-5 lg:flex-col lg:items-start"
												title="Rounding up to the nearest ten minutes"
											>
												10-min:
												<input
													type="checkbox"
													className="h-6 w-6 lg:h-9 lg:w-9"
													disabled={!watch('autoIncrease')}
													{...register('rounding10', {
														onChange: () => setValue('rounding5', false)
													})}
												/>
											</label>
										</div>
									</div>
								</div>
								<button
									title="Add showtime"
									disabled={isAddingShowtime}
									className="whitespace-nowrap rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 px-2 py-1 font-medium text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400"
									type="submit"
								>
									ADD +
								</button>
							</form>
						)}
						{isFetchingCinemas ? (
							<Loading />
						) : (
							<div>
								<h2 className="text-2xl font-bold">Theaters</h2>
								{cinemas[selectedCinemaIndex]?._id && (
									<ScheduleTable
										cinema={cinemas[selectedCinemaIndex]}
										selectedDate={selectedDate}
										auth={auth}
									/>
								)}
							</div>
						)}
					</div>
				) : (
					<div className="mx-4 flex flex-col gap-2 rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:gap-4 sm:p-6">
						<p className="text-center">There are no theaters available</p>
					</div>
				))}
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

export default Schedule
