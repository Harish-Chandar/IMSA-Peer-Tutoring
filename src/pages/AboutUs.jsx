import Footer from "../components/Footer.jsx";

function AboutUs() {
	return (
		<div className="w-full mt-16 bg-slate-100">
			<div className="flex flex-col md:flex-row justify-around w-full h-auto md:h-40 bg-slate-100 px-4">
				<div className="flex flex-col md:text-left h-full justify-center py-8 md:pt-14">
					<h2 className="text-gray-700 text-3xl md:text-6xl font-bold">
						Meet The{" "}
						<span className="text-blue-500">Developers</span>
					</h2>
					<h2 className="text-gray-400 text-md md:text-lg font-bold m-2 mb-3 self-center">
						Built by IMSA students for IMSA students
					</h2>
				</div>
			</div>
			<div className="flex flex-row flex-wrap justify-center gap-3 gap-y-20 w-5/6 mt-8 pb-5 self-center mx-auto bg-slate-100">
				{/*All the individual dev cards */}
				<div
					className={`w-60 h-60 shadow-2xl rounded-lg m-5 mb-20 relative hover:scale-105 duration-300`}
				>
					<img
						className="self-end h-full w-full object-cover rounded-2xl border-4 border-blue-300 hover:border-blue-500"
						src="/aarav.png"
						alt="placeholder"
					/>
					<div
						className={`bg-slate-50 shadow-2xl rounded-2xl p-2 md:px-5 w-50 relative bottom-10`}
					>
						<h3 className="text-black text-xl">
							<b>Aarav Shah</b>
						</h3>
						<h3 className="text-gray-500 text-md italics">
							<i>
								<b>Lead Developer</b>
							</i>
						</h3>
						<h3 className="text-gray-700 text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</h3>
					</div>
				</div>
				<div
					className={`w-60 h-60 shadow-2xl rounded-lg m-5 mb-20 relative hover:scale-105 duration-300`}
				>
					<img
						className="self-end h-full w-full object-cover rounded-2xl border-4 border-blue-300 hover:border-blue-500"
						src="/harish.png"
						alt="placeholder"
					/>
					<div
						className={`bg-slate-50 shadow-2xl rounded-2xl p-2 md:px-5 w-50 relative bottom-10`}
					>
						<h3 className="text-black text-xl">
							<b>Harish Chandar</b>
						</h3>
						<h3 className="text-gray-500 text-md italics">
							<i>
								<b>Lead Developer</b>
							</i>
						</h3>
						<h3 className="text-gray-700 text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</h3>
					</div>
				</div>
				<div
					className={`w-60 h-60 shadow-2xl rounded-lg m-5 mb-20 relative hover:scale-105 duration-300`}
				>
					<img
						className="self-end h-full w-full object-cover rounded-2xl border-4 border-blue-300 hover:border-blue-500"
						src="/vishnu.png"
						alt="placeholder"
					/>
					<div
						className={`bg-slate-50 shadow-2xl rounded-2xl p-2 md:px-5 w-50 relative bottom-10`}
					>
						<h3 className="text-black text-xl">
							<b>Vishnu Vijay</b>
						</h3>
						<h3 className="text-gray-500 text-md italics">
							<i>
								<b>Front-End Developer</b>
							</i>
						</h3>
						<h3 className="text-gray-700 text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</h3>
					</div>
				</div>
				<div
					className={`w-60 h-60 shadow-2xl rounded-lg m-5 mb-20 relative hover:scale-105 duration-300`}
				>
					<img
						className="self-end h-full w-full object-cover rounded-2xl border-4 border-blue-300 hover:border-blue-500"
						src="/atharv.png"
						alt="placeholder"
					/>
					<div
						className={`bg-slate-50 shadow-2xl rounded-2xl p-2 md:px-5 w-50 relative bottom-10`}
					>
						<h3 className="text-black text-xl">
							<b>Atharv Kanchi</b>
						</h3>
						<h3 className="text-gray-500 text-md italics">
							<i>
								<b>Back-End Developer</b>
							</i>
						</h3>
						<h3 className="text-gray-700 text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</h3>
					</div>
				</div>
				<div
					className={`w-60 h-60 shadow-2xl rounded-lg m-5 mb-20 relative hover:scale-105 duration-300`}
				>
					<img
						className="self-end h-full w-full object-cover rounded-2xl border-4 border-blue-300 hover:border-blue-500"
						src="/ian.png"
						alt="placeholder"
					/>
					<div
						className={`bg-slate-50 shadow-2xl rounded-2xl p-2 md:px-5 w-50 relative bottom-10`}
					>
						<h3 className="text-black text-xl">
							<b>Ian Wang</b>
						</h3>
						<h3 className="text-gray-500 text-md italics">
							<i>
								<b>Full Stack Developer</b>
							</i>
						</h3>
						<h3 className="text-gray-700 text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</h3>
					</div>
				</div>
				<div
					className={`w-60 h-60 shadow-2xl rounded-lg m-5 mb-20 relative hover:scale-105 duration-300`}
				>
					<img
						className="self-end h-full w-full object-cover rounded-2xl border-4 border-blue-300 hover:border-blue-500"
						src="/pranav.png"
						alt="placeholder"
					/>
					<div
						className={`bg-slate-50 shadow-2xl rounded-2xl p-2 md:px-5 w-50 relative bottom-10`}
					>
						<h3 className="text-black text-xl">
							<b>Pranav Gadde</b>
						</h3>
						<h3 className="text-gray-500 text-md italics">
							<i>
								<b>Front-End Developer</b>
							</i>
						</h3>
						<h3 className="text-gray-700 text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</h3>
					</div>
				</div>
				<div
					className={`w-60 h-60 shadow-2xl rounded-lg m-5 mb-20 relative hover:scale-105 duration-300`}
				>
					<img
						className="self-end h-full w-full object-cover rounded-2xl border-4 border-blue-300 hover:border-blue-500"
						src="/krithik.png"
						alt="placeholder"
					/>
					<div
						className={`bg-slate-50 shadow-2xl rounded-2xl p-2 md:px-5 w-50 relative bottom-10`}
					>
						<h3 className="text-black text-xl">
							<b>Krithik Senthilkumar</b>
						</h3>
						<h3 className="text-gray-500 text-md italics">
							<i>
								<b>Back-End Developer</b>
							</i>
						</h3>
						<h3 className="text-gray-700 text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</h3>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default AboutUs;
