import {
	ChevronDownIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
	EyeIcon,
	EyeSlashIcon,
	FunnelIcon,
	InformationCircleIcon,
	MapIcon
} from '@heroicons/react/24/outline'
import { ArrowDownIcon, TrashIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-tailwindcss-select'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

const Search = () => {
	const { auth } = useContext(AuthContext)
	const [isOpenFilter, setIsOpenFilter] = useState(true)
	const [isDeletingCheckedShowtimes, setIsDeletingCheckedShowtimes] = useState(false)
	const [deletedCheckedShowtimes, setDeletedCheckedShowtimes] = useState(0)
	const [isReleasingCheckedShowtimes, setIsReleasingCheckedShowtimes] = useState(false)
	const [releasedCheckedShowtimes, setReleasedCheckedShowtimes] = useState(0)
	const [isUnreleasingCheckedShowtimes, setIsUnreleasingCheckedShowtimes] = useState(false)
	const [unreleasedCheckedShowtimes, setUnreleasedCheckedShowtimes] = useState(0)
	const [isFetchingShowtimesDone, setIsFetchingShowtimesDone] = useState(false)

	const [showtimes, setShowtimes] = useState([])
	const [filterCinema, setFilterCinema] = useState(null)
	const [filterTheater, setFilterTheater] = useState(null)
	const [filterMovie, setFilterMovie] = useState(null)
	const [filterDate, setFilterDate] = useState(null)
	const [filterDateFrom, setFilterDateFrom] = useState(null)
	const [filterDateTo, setFilterDateTo] = useState(null)
	const [filterPastDate, setFilterPastDate] = useState(null)
	const [filterToday, setFilterToday] = useState(null)
	const [filterFutureDate, setFilterFutureDate] = useState(null)
	const [filterTime, setFilterTime] = useState(null)
	const [filterTimeFrom, setFilterTimeFrom] = useState(null)
	const [filterTimeTo, setFilterTimeTo] = useState(null)
	const [filterReleaseTrue, setFilterReleaseTrue] = useState(null)
	const [filterReleaseFalse, setFilterReleaseFalse] = useState(null)
	const [isCheckAll, setIsCheckAll] = useState(false)
	const [checkedShowtimes, setCheckedShowtimes] = useState([])

	const [sortCinema, setSortCinema] = useState(0) // -1: descending, 0 no sort, 1 ascending
	const [sortTheater, setSortTheater] = useState(0)
	const [sortMovie, setSortMovie] = useState(0)
	const [sortDate, setSortDate] = useState(0)
	const [sortTime, setSortTime] = useState(0)
	const [sortBooked, setSortBooked] = useState(0)
	const [sortRelease, setSortRelease] = useState(0)
	const [isChatbotVisible, setIsChatbotVisible] = useState(false)

	const resetSort = () => {
		setSortCinema(0)
		setSortTheater(0)
		setSortMovie(0)
		setSortDate(0)
		setSortTime(0)
		setSortBooked(0)
		setSortRelease(0)
	}

	const filteredShowtimes = showtimes
		.filter((showtime) => {
			const showtimeDate = new Date(showtime.showtime)
			const year = showtimeDate.getFullYear()
			const month = showtimeDate.toLocaleString('default', { month: 'short' })
			const day = showtimeDate.getDate().toString().padStart(2, '0')
			const formattedDate = `${day} ${month} ${year}`
			const hours = showtimeDate.getHours().toString().padStart(2, '0')
			const minutes = showtimeDate.getMinutes().toString().padStart(2, '0')
			const formattedTime = `${hours} : ${minutes}`
			return (
				(!filterCinema || filterCinema.map((cinema) => cinema.value).includes(showtime.theater.cinema._id)) &&
				(!filterTheater || filterTheater.map((theater) => theater.value).includes(showtime.theater.number)) &&
				(!filterMovie || filterMovie.map((movie) => movie.value).includes(showtime.movie._id)) &&
				(!filterDate || filterDate.map((showtime) => showtime.value).includes(formattedDate)) &&
				(!filterDateFrom || new Date(filterDateFrom.value) <= new Date(formattedDate)) &&
				(!filterDateTo || new Date(filterDateTo.value) >= new Date(formattedDate)) &&
				(!filterPastDate ||
					new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) >
						new Date(formattedDate)) &&
				(!filterToday ||
					(new Date().getFullYear() === new Date(formattedDate).getFullYear() &&
						new Date().getMonth() === new Date(formattedDate).getMonth() &&
						new Date().getDate() === new Date(formattedDate).getDate())) &&
				(!filterFutureDate ||
					new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) <
						new Date(formattedDate)) &&
				(!filterTime || filterTime.map((showtime) => showtime.value).includes(formattedTime)) &&
				(!filterTimeFrom || filterTimeFrom.value <= formattedTime) &&
				(!filterTimeTo || filterTimeTo.value >= formattedTime) &&
				(!filterReleaseTrue || showtime.isRelease) &&
				(!filterReleaseFalse || !showtime.isRelease)
			)
		})
		.sort((a, b) => {
			if (sortCinema) {
				return sortCinema * a.theater.cinema.name.localeCompare(b.theater.cinema.name)
			}
			if (sortTheater) {
				return sortTheater * (a.theater.number - b.theater.number)
			}
			if (sortMovie) {
				return sortMovie * a.movie.name.localeCompare(b.movie.name)
			}
			if (sortDate) {
				return sortDate * (new Date(a.showtime) - new Date(b.showtime))
			}
			if (sortTime) {
				return (
					sortTime *
					(new Date(a.showtime)
						.getHours()
						.toString()
						.padStart(2, '0')
						.concat(new Date(a.showtime).getMinutes().toString().padStart(2, '0')) -
						new Date(b.showtime)
							.getHours()
							.toString()
							.padStart(2, '0')
							.concat(new Date(b.showtime).getMinutes().toString().padStart(2, '0')))
				)
			}
			if (sortBooked) {
				return sortBooked * (a.seats.length - b.seats.length)
			}
			if (sortRelease) {
				return sortRelease * (a.isRelease - b.isRelease)
			}
		})
		const toggleChatbot = () => {
			setIsChatbotVisible(!isChatbotVisible)
		}

	const fetchShowtimes = async (data) => {
		try {
			setIsFetchingShowtimesDone(false)
			let response
			if (auth.role === 'admin') {
				response = await axios.get('/showtime/unreleased', {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get('/showtime')
			}
			// console.log(response.data.data)
			setShowtimes(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingShowtimesDone(true)
		}
	}

	useEffect(() => {
		fetchShowtimes()
	}, [])

	const handleDeleteCheckedShowtimes = () => {
		const confirmed = window.confirm(
			`Do you want to delete ${checkedShowtimes.length} checked showtimes, including its tickets?`
		)
		if (confirmed) {
			onDeleteCheckedShowtimes()
		}
	}

	const onDeleteCheckedShowtimes = async () => {
		setIsDeletingCheckedShowtimes(true)
		setDeletedCheckedShowtimes(0)
		let successCounter = 0
		let errorCounter = 0
		const deletePromises = checkedShowtimes.map(async (checkedShowtime) => {
			try {
				const response = await axios.delete(`/showtime/${checkedShowtime}`, {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
				setDeletedCheckedShowtimes((prev) => prev + 1)
				successCounter++
				return response
			} catch (error) {
				console.error(error)
				errorCounter++
			}
		})
		await Promise.all(deletePromises)
		toast.success(`Delete ${successCounter} checked showtimes successful!`, {
			position: 'top-center',
			autoClose: 2000,
			pauseOnHover: false
		})
		errorCounter > 0 &&
			toast.error(`Error deleting ${errorCounter} checked showtime`, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		resetState()
		fetchShowtimes()
		setIsDeletingCheckedShowtimes(false)
	}

	const handleReleaseCheckedShowtimes = () => {
		const confirmed = window.confirm(`Do you want to release ${checkedShowtimes.length} checked showtimes?`)
		if (confirmed) {
			onReleaseCheckedShowtimes()
		}
	}

	const onReleaseCheckedShowtimes = async () => {
		setIsReleasingCheckedShowtimes(true)
		setReleasedCheckedShowtimes(0)
		let successCounter = 0
		let errorCounter = 0
		const releasePromises = checkedShowtimes.map(async (checkedShowtime) => {
			try {
				const response = await axios.put(
					`/showtime/${checkedShowtime}`,
					{ isRelease: true },
					{
						headers: {
							Authorization: `Bearer ${auth.token}`
						}
					}
				)
				setReleasedCheckedShowtimes((prev) => prev + 1)
				successCounter++
				return response
			} catch (error) {
				console.error(error)
				errorCounter++
			}
		})
		await Promise.all(releasePromises)
		toast.success(`Release ${successCounter} checked showtimes successful!`, {
			position: 'top-center',
			autoClose: 2000,
			pauseOnHover: false
		})
		errorCounter > 0 &&
			toast.error(`Error releasing ${errorCounter} checked showtime`, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		resetState()
		fetchShowtimes()
		setIsReleasingCheckedShowtimes(false)
	}

	const handleUnreleasedCheckedShowtimes = () => {
		const confirmed = window.confirm(`Do you want to unreleased ${checkedShowtimes.length} checked showtimes?`)
		if (confirmed) {
			onUnreleasedCheckedShowtimes()
		}
	}

	const onUnreleasedCheckedShowtimes = async () => {
		setIsUnreleasingCheckedShowtimes(true)
		setUnreleasedCheckedShowtimes(0)
		let successCounter = 0
		let errorCounter = 0
		const releasePromises = checkedShowtimes.map(async (checkedShowtime) => {
			try {
				const response = await axios.put(
					`/showtime/${checkedShowtime}`,
					{ isRelease: false },
					{
						headers: {
							Authorization: `Bearer ${auth.token}`
						}
					}
				)
				setUnreleasedCheckedShowtimes((prev) => prev + 1)
				successCounter++
				return response
			} catch (error) {
				console.error(error)
				errorCounter++
			}
		})
		await Promise.all(releasePromises)
		toast.success(`Unreleased ${successCounter} checked showtimes successful!`, {
			position: 'top-center',
			autoClose: 2000,
			pauseOnHover: false
		})
		errorCounter > 0 &&
			toast.error(`Error unreleasing ${errorCounter} checked showtime`, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		resetState()
		fetchShowtimes()
		setIsUnreleasingCheckedShowtimes(false)
	}

	const resetState = () => {
		setIsCheckAll(false)
		setCheckedShowtimes([])
	}

	const navigate = useNavigate()

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-white pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-2 rounded-lg bg-white p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<h2 className="text-3xl font-bold text-gray-900">Search Showtimes</h2>
				<div className="flex flex-col gap-2 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4 transition-all duration-500 ease-in-out">
					<div className="flex items-center justify-between" onClick={() => setIsOpenFilter((prev) => !prev)}>
						<div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
							<FunnelIcon className="h-6 w-6" />
							Filter
						</div>
						{!isOpenFilter && (
							<ChevronDownIcon className="h-6 w-6 transition-all hover:scale-125 hover:cursor-pointer" />
						)}
						{isOpenFilter && (
							<ChevronUpIcon className="h-6 w-6 transition-all hover:scale-125 hover:cursor-pointer" />
						)}
					</div>
					{isOpenFilter && (
						<div className="">
							<div className="flex flex-col">
								<h4 className="pt-1 text-lg font-bold text-gray-800">Cinema :</h4>
								<Select
									value={filterCinema}
									options={Array.from(
										new Set(showtimes.map((showtime) => showtime.theater.cinema._id))
									).map((value) => ({
										value,
										label: showtimes.find((showtime) => showtime.theater.cinema._id === value)
											.theater.cinema.name
									}))}
									onChange={(value) => {
										setFilterCinema(value)
										resetState()
									}}
									isClearable={true}
									isMultiple={true}
									isSearchable={true}
									primaryColor="indigo"
								/>
							</div>
							<div className="flex flex-col">
								<h4 className="pt-1 text-lg font-bold text-gray-800">Theater :</h4>
								<Select
									value={filterTheater}
									options={Array.from(new Set(showtimes.map((showtime) => showtime.theater.number)))
										.sort((a, b) => a - b)
										.map((value) => ({
											value,
											label: value.toString()
										}))}
									onChange={(value) => {
										setFilterTheater(value)
										resetState()
									}}
									isClearable={true}
									isMultiple={true}
									isSearchable={true}
									primaryColor="indigo"
								/>
							</div>
							<div className="flex flex-col">
								<h4 className="pt-1 text-lg font-bold text-gray-800">Movie :</h4>
								<Select
									value={filterMovie}
									options={Array.from(new Set(showtimes.map((showtime) => showtime.movie._id))).map(
										(value) => ({
											value,
											label: showtimes.find((showtime) => showtime.movie._id === value).movie.name
										})
									)}
									onChange={(value) => {
										setFilterMovie(value)
										resetState()
									}}
									isClearable={true}
									isMultiple={true}
									isSearchable={true}
									primaryColor="indigo"
								/>
							</div>
							<div className="flex flex-col">
								<h4 className="pt-1 text-lg font-bold text-gray-800">Date :</h4>
								<Select
									value={filterDate}
									options={Array.from(
										new Set(
											showtimes.map((showtime) => {
												const showtimeDate = new Date(showtime.showtime)
												const year = showtimeDate.getFullYear()
												const month = showtimeDate.toLocaleString('default', { month: 'short' })
												const day = showtimeDate.getDate().toString().padStart(2, '0')
												return `${day} ${month} ${year}`
											})
										)
									).map((value) => ({
										value,
										label: value
									}))}
									onChange={(value) => {
										setFilterDate(value)
										resetState()
									}}
									isClearable={true}
									isMultiple={true}
									isSearchable={true}
									primaryColor="indigo"
								/>
								<div className="my-2 flex flex-col items-start gap-x-2 gap-y-1 sm:flex-row sm:items-center">
									<label className="text-md font-semibold text-gray-800">From</label>
									<Select
										value={filterDateFrom}
										options={Array.from(
											new Set(
												showtimes.map((showtime) => {
													const showtimeDate = new Date(showtime.showtime)
													const year = showtimeDate.getFullYear()
													const month = showtimeDate.toLocaleString('default', {
														month: 'short'
													})
													const day = showtimeDate.getDate().toString().padStart(2, '0')
													return `${day} ${month} ${year}`
												})
											)
										)
											// .filter((value) => !filterDateTo || new Date(filterDateTo.value) >= new Date(value))
											.map((value) => ({
												value,
												label: value
											}))}
										onChange={(value) => {
											setFilterDateFrom(value)
											resetState()
										}}
										isClearable={true}
										isSearchable={true}
										primaryColor="indigo"
									/>
									<label className="text-md font-semibold text-gray-800">To</label>
									<Select
										value={filterDateTo}
										options={Array.from(
											new Set(
												showtimes.map((showtime) => {
													const showtimeDate = new Date(showtime.showtime)
													const year = showtimeDate.getFullYear()
													const month = showtimeDate.toLocaleString('default', {
														month: 'short'
													})
													const day = showtimeDate.getDate().toString().padStart(2, '0')
													return `${day} ${month} ${year}`
												})
											)
										)
											// .filter((value) => !filterDateFrom || new Date(filterDateFrom.value) <= new Date(value))
											.map((value) => ({
												value,
												label: value
											}))}
										onChange={(value) => {
											setFilterDateTo(value)
											resetState()
										}}
										isClearable={true}
										isSearchable={true}
										primaryColor="indigo"
									/>
								</div>
								<div className="flex flex-col items-start gap-x-8 gap-y-2 sm:flex-row sm:items-center">
									<label className="text-md flex items-center justify-between gap-2 font-semibold text-gray-800">
										Past Date
										<input
											type="checkbox"
											className="h-6 w-6"
											checked={filterPastDate}
											onClick={(event) => {
												setFilterPastDate(event.target.checked)
												setFilterToday(false)
												setFilterFutureDate(false)
												resetState()
											}}
										/>
									</label>
									<label className="text-md flex items-center justify-between gap-2 font-semibold text-gray-800">
										Today
										<input
											type="checkbox"
											className="h-6 w-6"
											checked={filterToday}
											onClick={(event) => {
												setFilterPastDate(false)
												setFilterToday(event.target.checked)
												setFilterFutureDate(false)
												resetState()
											}}
										/>
									</label>
									<label className="text-md flex items-center justify-between gap-2 font-semibold text-gray-800">
										Future Date
										<input
											type="checkbox"
											className="h-6 w-6"
											checked={filterFutureDate}
											onClick={(event) => {
												setFilterPastDate(false)
												setFilterToday(false)
												setFilterFutureDate(event.target.checked)
												resetState()
											}}
										/>
									</label>
								</div>
							</div>
							<div className="flex flex-col">
								<h4 className="pt-1 text-lg font-bold text-gray-800">Time :</h4>
								<Select
									value={filterTime}
									options={Array.from(
										new Set(
											showtimes.map((showtime) => {
												const showtimeDate = new Date(showtime.showtime)
												const hours = showtimeDate.getHours().toString().padStart(2, '0')
												const minutes = showtimeDate.getMinutes().toString().padStart(2, '0')
												return `${hours} : ${minutes}`
											})
										)
									)
										.sort()
										.map((value) => ({
											value,
											label: value
										}))}
									onChange={(value) => {
										setFilterTime(value)
										resetState()
									}}
									isClearable={true}
									isMultiple={true}
									isSearchable={true}
									primaryColor="indigo"
								/>
								<div className="my-2 flex flex-col items-start gap-x-2 gap-y-1 sm:flex-row sm:items-center">
									<label className="text-md font-semibold text-gray-800">From</label>
									<Select
										value={filterTimeFrom}
										options={Array.from(
											new Set(
												showtimes.map((showtime) => {
													const showtimeDate = new Date(showtime.showtime)
													const hours = showtimeDate.getHours().toString().padStart(2, '0')
													const minutes = showtimeDate
														.getMinutes()
														.toString()
														.padStart(2, '0')
													return `${hours} : ${minutes}`
												})
											)
										)
											.sort()
											.map((value) => ({
												value,
												label: value
											}))}
										onChange={(value) => {
											setFilterTimeFrom(value)
											resetState()
										}}
										isClearable={true}
										isSearchable={true}
										primaryColor="indigo"
									/>
									<label className="text-md font-semibold text-gray-800">To</label>
									<Select
										value={filterTimeTo}
										options={Array.from(
											new Set(
												showtimes.map((showtime) => {
													const showtimeDate = new Date(showtime.showtime)
													const hours = showtimeDate.getHours().toString().padStart(2, '0')
													const minutes = showtimeDate
														.getMinutes()
														.toString()
														.padStart(2, '0')
													return `${hours} : ${minutes}`
												})
											)
										)
											.sort()
											.map((value) => ({
												value,
												label: value
											}))}
										onChange={(value) => {
											setFilterTimeTo(value)
											resetState()
										}}
										isClearable={true}
										isSearchable={true}
										primaryColor="indigo"
									/>
								</div>
							</div>
							<div className="flex flex-col">
								<h4 className="pt-1 text-lg font-bold text-gray-800">Release :</h4>
								<div className="mt-1 flex flex-col items-start gap-x-8 gap-y-2 sm:flex-row sm:items-center">
									<label className="text-md flex items-center justify-between gap-2 font-semibold text-gray-800">
										True
										<input
											type="checkbox"
											className="h-6 w-6"
											checked={filterReleaseTrue}
											onClick={(event) => {
												setFilterReleaseTrue(event.target.checked)
												setFilterReleaseFalse(false)
												resetState()
											}}
										/>
									</label>
									<label className="text-md flex items-center justify-between gap-2 font-semibold text-gray-800">
										False
										<input
											type="checkbox"
											className="h-6 w-6"
											checked={filterReleaseFalse}
											onClick={(event) => {
												setFilterReleaseTrue(false)
												setFilterReleaseFalse(event.target.checked)
												resetState()
											}}
										/>
									</label>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="flex items-end">
					<ArrowDownIcon className="h-8 min-h-[32px] w-8 min-w-[32px] px-1" />
					<div className="flex flex-wrap items-center gap-2 px-1">
						<button
							className="flex w-fit items-center justify-center gap-1 rounded bg-gradient-to-r from-indigo-600 to-blue-500 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400 md:min-w-fit"
							onClick={() => handleReleaseCheckedShowtimes()}
							disabled={checkedShowtimes.length === 0 || isReleasingCheckedShowtimes}
						>
							{isReleasingCheckedShowtimes ? (
								`${releasedCheckedShowtimes} / ${checkedShowtimes.length} showtimes released`
							) : (
								<>
									<EyeIcon className="h-5 w-5" />
									{`Release ${checkedShowtimes.length} checked showtimes`}
								</>
							)}
						</button>
						<button
							className="flex w-fit items-center justify-center gap-1 rounded bg-gradient-to-r from-indigo-600 to-blue-500 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400 md:min-w-fit"
							onClick={() => handleUnreleasedCheckedShowtimes()}
							disabled={checkedShowtimes.length === 0 || isUnreleasingCheckedShowtimes}
						>
							{isUnreleasingCheckedShowtimes ? (
								`${unreleasedCheckedShowtimes} / ${checkedShowtimes.length} showtimes unreleased`
							) : (
								<>
									<EyeSlashIcon className="h-5 w-5" />
									{`Unreleased ${checkedShowtimes.length} checked showtimes`}
								</>
							)}
						</button>
						<button
							className="flex w-fit items-center justify-center gap-1 rounded bg-gradient-to-r from-red-700 to-rose-600 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-red-600 hover:to-rose-500 disabled:from-slate-500 disabled:to-slate-400 md:min-w-fit"
							onClick={() => handleDeleteCheckedShowtimes()}
							disabled={checkedShowtimes.length === 0 || isDeletingCheckedShowtimes}
						>
							{isDeletingCheckedShowtimes ? (
								`${deletedCheckedShowtimes} / ${checkedShowtimes.length} showtimes deleted`
							) : (
								<>
									<TrashIcon className="h-5 w-5" />
									{`Delete ${checkedShowtimes.length} checked showtimes`}
								</>
							)}
						</button>
					</div>

					{isFetchingShowtimesDone && (
						<div className="ml-auto flex items-center gap-1 px-1 text-sm font-medium">
							<InformationCircleIcon className="h-5 w-5" /> Showing {filteredShowtimes.length} filtered
							showtimes
						</div>
					)}
				</div>

				<div
					className={`mb-4 grid max-h-screen overflow-auto rounded-md bg-gradient-to-br from-indigo-100 to-white`}
					style={{ gridTemplateColumns: '34px repeat(7, minmax(max-content, 1fr)) 104px' }}
				>
					<p className="sticky top-0 flex items-center justify-center rounded-tl-md bg-gradient-to-br from-gray-800 to-gray-700 text-center text-xl font-semibold text-white">
						<input
							type="checkbox"
							className="h-6 w-6"
							checked={isCheckAll}
							onChange={() => {
								if (isCheckAll) {
									setIsCheckAll(false)
									setCheckedShowtimes([])
								} else {
									setIsCheckAll(true)
									setCheckedShowtimes((prev) => [
										...prev,
										...filteredShowtimes.map((showtime) => showtime._id)
									])
								}
							}}
							disabled={!isFetchingShowtimesDone}
						/>
					</p>
					<button
						className="sticky top-0 flex justify-center bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-2 py-1 text-center text-xl font-semibold text-white"
						onClick={() => {
							let prevValue = sortCinema
							resetSort()
							setSortCinema(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
						}}
					>
						<p className="ml-auto">Cinema</p>
						{sortCinema === 0 && <ChevronUpDownIcon className="ml-auto w-6 h-6" />}
						{sortCinema === 1 && <ChevronUpIcon className="ml-auto w-6 h-6" />}
						{sortCinema === -1 && <ChevronDownIcon className="ml-auto w-6 h-6" />}
					</button>
					<button
						className="sticky top-0 flex justify-center bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-2 py-1 text-center text-xl font-semibold text-white"
						onClick={() => {
							let prevValue = sortTheater
							resetSort()
							setSortTheater(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
						}}
					>
						<p className="ml-auto">Theater</p>
						{sortTheater === 0 && <ChevronUpDownIcon className="ml-auto w-6 h-6" />}
						{sortTheater === 1 && <ChevronUpIcon className="ml-auto w-6 h-6" />}
						{sortTheater === -1 && <ChevronDownIcon className="ml-auto w-6 h-6" />}
					</button>
					<button
						className="sticky top-0 flex justify-center bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-2 py-1 text-center text-xl font-semibold text-white"
						onClick={() => {
							let prevValue = sortMovie
							resetSort()
							setSortMovie(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
						}}
					>
						<p className="ml-auto">Movie</p>
						{sortMovie === 0 && <ChevronUpDownIcon className="ml-auto w-6 h-6" />}
						{sortMovie === 1 && <ChevronUpIcon className="ml-auto w-6 h-6" />}
						{sortMovie === -1 && <ChevronDownIcon className="ml-auto w-6 h-6" />}
					</button>
					<button
						className="sticky top-0 flex justify-center bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-2 py-1 text-center text-xl font-semibold text-white"
						onClick={() => {
							let prevValue = sortDate
							resetSort()
							setSortDate(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
						}}
					>
						<p className="ml-auto">Date</p>
						{sortDate === 0 && <ChevronUpDownIcon className="ml-auto w-6 h-6" />}
						{sortDate === 1 && <ChevronUpIcon className="ml-auto w-6 h-6" />}
						{sortDate === -1 && <ChevronDownIcon className="ml-auto w-6 h-6" />}
					</button>
					<button
						className="sticky top-0 flex justify-center bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-2 py-1 text-center text-xl font-semibold text-white"
						onClick={() => {
							let prevValue = sortTime
							resetSort()
							setSortTime(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
						}}
					>
						<p className="ml-auto">Time</p>
						{sortTime === 0 && <ChevronUpDownIcon className="ml-auto w-6 h-6" />}
						{sortTime === 1 && <ChevronUpIcon className="ml-auto w-6 h-6" />}
						{sortTime === -1 && <ChevronDownIcon className="ml-auto w-6 h-6" />}
					</button>
					<button
						className="sticky top-0 flex justify-center bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-2 py-1 text-center text-xl font-semibold text-white"
						onClick={() => {
							let prevValue = sortBooked
							resetSort()
							setSortBooked(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
						}}
					>
						<p className="ml-auto">Booked</p>
						{sortBooked === 0 && <ChevronUpDownIcon className="ml-auto w-6 h-6" />}
						{sortBooked === 1 && <ChevronUpIcon className="ml-auto w-6 h-6" />}
						{sortBooked === -1 && <ChevronDownIcon className="ml-auto w-6 h-6" />}
					</button>
					<button
						className="sticky top-0 flex justify-center bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-2 py-1 text-center text-xl font-semibold text-white"
						onClick={() => {
							let prevValue = sortRelease
							resetSort()
							setSortRelease(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
						}}
					>
						<p className="ml-auto">Release</p>
						{sortRelease === 0 && <ChevronUpDownIcon className="ml-auto w-6 h-6" />}
						{sortRelease === 1 && <ChevronUpIcon className="ml-auto w-6 h-6" />}
						{sortRelease === -1 && <ChevronDownIcon className="ml-auto w-6 h-6" />}
					</button>
					<p className="sticky top-0 z-[1] flex items-center justify-center gap-2 rounded-tr-md bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
						<MapIcon className="h-6 w-6" />
						View
					</p>
					{isFetchingShowtimesDone &&
						filteredShowtimes.map((showtime, index) => {
							const showtimeDate = new Date(showtime.showtime)
							const year = showtimeDate.getFullYear()
							const month = showtimeDate.toLocaleString('default', { month: 'short' })
							const day = showtimeDate.getDate().toString().padStart(2, '0')
							const hours = showtimeDate.getHours().toString().padStart(2, '0')
							const minutes = showtimeDate.getMinutes().toString().padStart(2, '0')
							const isCheckedRow = checkedShowtimes.includes(showtime._id)
							return (
								<Fragment key={index}>
									<div
										className={`flex items-center justify-center border-t-2 border-indigo-200 ${
											isCheckedRow && 'border-white bg-blue-200 text-blue-800'
										}`}
									>
										<input
											id={showtime._id}
											type="checkbox"
											className="h-6 w-6"
											checked={checkedShowtimes.includes(showtime._id)}
											onChange={(e) => {
												const { id, checked } = e.target
												setCheckedShowtimes((prev) => [...prev, id])
												if (!checked) {
													setCheckedShowtimes((prev) => prev.filter((item) => item !== id))
												}
											}}
											disabled={!isFetchingShowtimesDone}
										/>
									</div>
									<div
										className={`border-t-2 border-indigo-200 px-2 py-1 ${
											isCheckedRow && 'border-white bg-blue-200 text-blue-800'
										}`}
									>
										{showtime.theater.cinema.name}
									</div>
									<div
										className={`border-t-2 border-indigo-200 px-2 py-1 ${
											isCheckedRow && 'border-white bg-blue-200 text-blue-800'
										}`}
									>
										{showtime.theater.number}
									</div>
									<div
										className={`border-t-2 border-indigo-200 px-2 py-1 ${
											isCheckedRow && 'border-white bg-blue-200 text-blue-800'
										}`}
									>
										{showtime.movie.name}
									</div>
									<div
										className={`border-t-2 border-indigo-200 px-2 py-1 ${
											isCheckedRow && 'border-white bg-blue-200 text-blue-800'
										}`}
									>{`${day} ${month} ${year}`}</div>
									<div
										className={`border-t-2 border-indigo-200 px-2 py-1 ${
											isCheckedRow && 'border-white bg-blue-200 text-blue-800'
										}`}
									>{`${hours} : ${minutes}`}</div>
									<div
										className={`border-t-2 border-indigo-200 px-2 py-1 ${
											isCheckedRow && 'border-white bg-blue-200 text-blue-800'
										}`}
									>
										{showtime.seats.length}
									</div>
									<div
										className={`flex items-center gap-2 border-t-2 border-indigo-200 px-2 py-1 ${
											isCheckedRow && 'border-white bg-blue-200 text-blue-800'
										}`}
									>
										<p>
											{String(showtime.isRelease).charAt(0).toUpperCase() +
												String(showtime.isRelease).slice(1)}
										</p>
										{!showtime.isRelease && (
											<EyeSlashIcon className="h-5 w-5" title="Unreleased showtime" />
										)}
									</div>
									<button
										className="flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-blue-500 px-2 py-1 text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400"
										onClick={() => navigate(`/showtime/${showtime._id}`)}
									>
										<MapIcon className="h-6 w-6" />
										View
									</button>
								</Fragment>
							)
						})}
				</div>
				{!isFetchingShowtimesDone && <Loading />}
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

export default Search
