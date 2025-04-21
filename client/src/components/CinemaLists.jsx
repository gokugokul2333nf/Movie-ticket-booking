import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from './Loading'

const CinemaLists = ({
  cinemas,
  selectedCinemaIndex,
  setSelectedCinemaIndex,
  fetchCinemas,
  auth,
  isFetchingCinemas = false
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm()

  const [isAdding, SetIsAdding] = useState(false)

  const onAddCinema = async (data) => {
    try {
      SetIsAdding(true)
      const response = await axios.post('/cinema', data, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      reset()
      fetchCinemas(data.name)
      toast.success('Cinema added successfully!', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
    } catch (error) {
      console.error(error)
      toast.error('Error adding cinema', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
    } finally {
      SetIsAdding(false)
    }
  }

  const CinemaLists = ({ cinemas }) => {
    const cinemasList = cinemas?.filter((cinema) =>
      cinema.name.toLowerCase().includes(watch('search')?.toLowerCase() || '')
    )

    return cinemasList.length ? (
      cinemasList.map((cinema, index) => {
        return cinemas[selectedCinemaIndex]?._id === cinema._id ? (
          <button
            className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-red-600 to-black px-3 py-2 text-lg font-medium text-white shadow-sm hover:from-red-500 hover:to-black transition-all"
            onClick={() => {
              setSelectedCinemaIndex(null)
              sessionStorage.setItem('selectedCinemaIndex', null)
            }}
            key={index}
          >
            {cinema.name}
          </button>
        ) : (
          <button
            className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 px-3 py-2 text-lg font-medium text-white shadow-sm hover:from-gray-500 hover:to-gray-700 transition-all"
            onClick={() => {
              setSelectedCinemaIndex(index)
              sessionStorage.setItem('selectedCinemaIndex', index)
            }}
            key={index}
          >
            {cinema.name}
          </button>
        )
      })
    ) : (
      <div className="text-gray-600 text-center w-full py-2">No cinemas found</div>
    )
  }

  return (
    <div className="mx-4 flex flex-col gap-4 rounded-md bg-gradient-to-br from-red-100 to-white p-4 shadow-lg sm:mx-6 sm:p-6">
      <form
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
        onSubmit={handleSubmit(onAddCinema)}
      >
        <h2 className="text-2xl font-semibold text-black">Cinema Lists</h2>
        {auth.role === 'admin' && (
          <div className="flex w-full sm:w-auto grow sm:justify-end items-center gap-2">
            <input
              placeholder="Cinema name"
              className="w-full sm:max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-red-500"
              required
              {...register('name', { required: true })}
            />
            <button
              disabled={isAdding}
              className="flex items-center rounded-md bg-gradient-to-r from-red-600 to-black px-3 py-2 text-sm font-medium text-white hover:from-red-500 hover:to-black transition-all disabled:bg-gray-400"
            >
              {isAdding ? 'Adding...' : 'Add Cinema'}
            </button>
          </div>
        )}
      </form>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
        </div>
        <input
          type="search"
          className="block w-full rounded-lg border border-gray-300 px-8 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500"
          placeholder="Search cinemas"
          {...register('search')}
        />
      </div>

      {isFetchingCinemas ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap gap-3">
          <CinemaLists cinemas={cinemas} />
        </div>
      )}
    </div>
  )
}

export default CinemaLists
