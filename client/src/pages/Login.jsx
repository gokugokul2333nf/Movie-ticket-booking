import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
	const navigate = useNavigate()
	const { auth, setAuth } = useContext(AuthContext)
	const [errorsMessage, setErrorsMessage] = useState('')
	const [isLoggingIn, SetLoggingIn] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const onSubmit = async (data) => {
		SetLoggingIn(true)
		try {
			const response = await axios.post('/auth/login', data)
			// console.log(response.data)
			toast.success('Login successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			setAuth((prev) => ({ ...prev, token: response.data.token }))
			navigate('/')
		} catch (error) {
			console.error(error.response.data)
			setErrorsMessage(error.response.data)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetLoggingIn(false)
		}
	}

	const inputClasses = () => {
		return 'appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500'
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center bg-cover bg-center relative"
			style={{
				backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaKiwpDplmNdC2VXs5tVhWyWSvWo16awJbFg&s')"
			}}
		>
			<div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

			<div
				className="relative z-10 w-full max-w-md rounded-2xl bg-white bg-opacity-10 p-8 shadow-2xl backdrop-blur-lg border border-white border-opacity-30"
				style={{
					position: "relative",
					background: "rgba(255, 255, 255, 0.15)",
					backdropFilter: "blur(12px)",
					borderRadius: "40px 5px 40px 5px",
					padding: "40px",
					maxWidth: "450px",
					width: "100%",
					textAlign: "center",
					border: "1px solid rgba(255, 255, 255, 0.25)",
					boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
					animation: "floating 3s ease-in-out infinite",
					transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
				}}
			>
				<style>
					{`
        @keyframes floating {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}
				</style>
				<h2 className="mb-6 text-center text-4xl font-bold text-white drop-shadow-md">Login</h2>

				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<input
						name="username"
						type="text"
						autoComplete="username"
						{...register('username', { required: true })}
						className={`${inputClasses()} ${errors.username ? 'border-red-500' : ''}`}
						placeholder="Username"
					/>
					{errors.username && <span className="text-sm text-red-300">Username is required</span>}

					<input
						name="password"
						type="password"
						autoComplete="current-password"
						{...register('password', { required: true })}
						className={`${inputClasses()} ${errors.password ? 'border-red-500' : ''}`}
						placeholder="Password"
					/>
					{errors.password && <span className="text-sm text-red-300">Password is required</span>}

					{errorsMessage && <span className="text-sm text-red-400">{errorsMessage}</span>}

					<button
						type="submit"
						disabled={isLoggingIn}
						className="mt-4 w-[200px] mx-auto block rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
					>
						{isLoggingIn ? 'Processing...' : 'Login'}
					</button>

					<p className="text-center text-sm text-white mt-4">
						New User?{' '}
						<Link to="/register" className="font-bold text-blue-300 hover:text-blue-400">
							Sign Up
						</Link>
					</p>

				</form>
			</div>
		</div>

	)
}

export default Login
