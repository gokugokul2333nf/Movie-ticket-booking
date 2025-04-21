import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
	const navigate = useNavigate()
	const [errorsMessage, setErrorsMessage] = useState('')
	const [isRegistering, SetIsRegistering] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const onSubmit = async (data) => {
		SetIsRegistering(true)
		try {
			const response = await axios.post('/auth/register', data)
			// console.log(response.data)
			toast.success('Registration successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
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
			SetIsRegistering(false)
		}
	}

	const inputClasses = () => {
		return 'appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500'
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-cover bg-center relative"
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
				<div>
					<h2 className="mb-6 text-center text-4xl font-bold text-white drop-shadow-md">Register</h2>
				</div>
				<form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<input
						name="username"
						type="text"
						autoComplete="username"
						{...register('username', { required: true })}
						className={inputClasses`${errors.username ? 'border-red-500' : ''}`}
						placeholder="Username"
					/>
					{errors.username && <span className="text-sm text-red-500">Username is required</span>}
					<input
						name="email"
						type="email"
						autoComplete="email"
						{...register('email', { required: true })}
						className={inputClasses`${errors.email ? 'border-red-500' : ''}`}
						placeholder="Email"
					/>
					{errors.username && <span className="text-sm text-red-500">Email is required</span>}
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message: 'Password must be at least 6 characters long'
							}
						})}
						className={inputClasses`${errors.password ? 'border-red-500' : ''}`}
						placeholder="Password"
					/>
					{errors.password && <span className="text-sm text-red-500">{errors.password?.message}</span>}
					<div>
						{errorsMessage && <span className="text-sm text-red-500">{errorsMessage}</span>}
						<button
							type="submit"
							className="mt-4 w-[200px] mx-auto block rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
							disabled={isRegistering}
						>
							{isRegistering ? 'Processing...' : 'Register'}
						</button>
					</div>
					<p className="text-center text-sm text-white mt-4">
						Already have an account?{' '}
						<Link to={'/login'} className="font-bold text-blue-600">
							Sign In
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Register
