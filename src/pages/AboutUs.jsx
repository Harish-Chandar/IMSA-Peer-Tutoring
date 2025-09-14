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
			<div className="flex flex-row flex-wrap justify-center gap-6 gap-y-10 w-5/6 mt-8 pb-10 self-center mx-auto bg-slate-100">
				{/*All the individual dev cards */}
				<div
					className="relative w-72 flex flex-col items-center border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-3xl transition-colors duration-200"
				>
					{/* Image container */}
					<div className="w-full h-64 overflow-hidden rounded-b-none rounded-t-3xl z-0">
						<img
							className="w-full h-full object-cover object-top"
							src="AboutUsImages/aarav.png"
							alt="Aarav Shah"
							style={{ aspectRatio: "600/600" }}
						/>
					</div>

					<div className="w-full bg-white -mt-5 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
						<h3 className="text-lg font-sans">
							<b>Aarav Shah</b>
						</h3>
						<p className="text-md text-gray-400 font-sans">
							<i>
								<b>Lead Developer</b>
							</i>
						</h3>
						<h3 className="text-gray-700 text-sm">
							Hi! I'm Aarav Shah, a current senior at IMSA. I love computer science, and hope to go into the industry someday! I'm involved with many other organizations on campus too, including Learning Enrichment Engine, IMSA.ai, TEDxIMSA, and Mu Alpha Theta. In my free time, I love to play chess and read! Feel free to visit ashah80.github.io to learn more about me, or reach out!
						</h3>
					</div>
				</div>
				<div
					className="relative w-72 flex flex-col items-center border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-3xl transition-colors duration-200"
				>
					{/* Image container */}
					<div className="w-full h-64 overflow-hidden rounded-b-none rounded-t-3xl z-0">
						<img
							className="w-full h-full object-cover object-top"
							src="AboutUsImages/harish.png"
							alt="Harish Chandar"
							style={{ aspectRatio: "600/600" }}
						/>
					</div>

					<div className="w-full bg-white -mt-5 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
						<h3 className="text-lg font-sans">
							<b>Harish Chandar</b>
						</h3>
						<p className="text-md text-gray-400 font-sans">
							<i>
								<b>Lead Developer</b>
							</i>
						</p>
						<div className="text-md text-gray-700 font-sans mt-2 overflow-hidden">
							Hi! I'm Harish Chandar, a current senior in 1505.
							I'm extremely interested in computer science and AI.
							I love computer science and programming, and am also a senior developer on the Learning Enrichment Engine.
							I'm also involved in Congressional Debate, and enjoy math and biology as well.
						</div>
					</div>
				</div>
				<div
					className="relative w-72 flex flex-col items-center border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-3xl transition-colors duration-200"
				>
					{/* Image container */}
					<div className="w-full h-64 overflow-hidden rounded-b-none rounded-t-3xl z-0">
						<img
							className="w-full h-full object-cover object-top"
							src="AboutUsImages/vishnu.png"
							alt="Vishnu Vijay"
							style={{ aspectRatio: "600/600" }}
						/>
					</div>

					<div className="w-full bg-white -mt-5 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
						<h3 className="text-lg font-sans">
							<b>Vishnu Vijay</b>
						</h3>
						<p className="text-md text-gray-400 font-sans">
							<i>
								<b>Front-End Developer</b>
							</i>
						</p>
						<div className="text-md text-gray-700 font-sans mt-2 overflow-hidden">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</div>
					</div>
				</div>
				<div
					className="relative w-72 flex flex-col items-center border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-3xl transition-colors duration-200"
				>
					{/* Image container */}
					<div className="w-full h-64 overflow-hidden rounded-b-none rounded-t-3xl z-0">
						<img
							className="w-full h-full object-cover object-top"
							src="AboutUsImages/atharv.png"
							alt="Atharv Kanchi"
							style={{ aspectRatio: "600/600" }}
						/>
					</div>

					<div className="w-full bg-white -mt-5 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
						<h3 className="text-lg font-sans">
							<b>Atharv Kanchi</b>
						</h3>
						<p className="text-md text-gray-400 font-sans">
							<i>
								<b>Back-End Developer</b>
							</i>
						</p>
						<div className="text-md text-gray-700 font-sans mt-2 overflow-hidden">
							Hi! My name is Atharv, and I am junior I'm from
							Naperville and currently live in 1504. In my free
							time, I love listening to music, hanging out with my
							friends around campus, lifting, or coding something
							new. I'm involved in a couple of STEM activities
							across campus like Qubit, Epoch, ACSL, and Math
							Team. Feel free to reach out if you want to talk
							about anything!
						</div>
					</div>
				</div>
				<div
					className="relative w-72 flex flex-col items-center border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-3xl transition-colors duration-200"
				>
					{/* Image container */}
					<div className="w-full h-64 overflow-hidden rounded-b-none rounded-t-3xl z-0">
						<img
							className="w-full h-full object-cover object-top"
							src="AboutUsImages/ian.png"
							alt="Ian Wang"
							style={{ aspectRatio: "600/600" }}
						/>
					</div>

					<div className="w-full bg-white -mt-5 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
						<h3 className="text-lg font-sans">
							<b>Ian Wang</b>
						</h3>
						<p className="text-md text-gray-400 font-sans">
							<i>
								<b>Full Stack Developer</b>
							</i>
						</p>
						<div className="text-md text-gray-700 font-sans mt-2 overflow-hidden">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</div>
					</div>
				</div>
				<div
					className="relative w-72 flex flex-col items-center border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-3xl transition-colors duration-200"
				>
					{/* Image container */}
					<div className="w-full h-64 overflow-hidden rounded-b-none rounded-t-3xl z-0">
						<img
							className="w-full h-full object-cover object-top"
							src="AboutUsImages/pranav.png"
							alt="Pranav Gadde"
							style={{ aspectRatio: "600/600" }}
						/>
					</div>

					<div className="w-full bg-white -mt-5 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
						<h3 className="text-lg font-sans">
							<b>Pranav Gadde</b>
						</h3>
						<p className="text-md text-gray-400 font-sans">
							<i>
								<b>Front-End Developer</b>
							</i>
						</p>
						<div className="text-md text-gray-700 font-sans mt-2 overflow-hidden">
							Hi, I'm Pranav! I'm a junior in 1504 and a peer tutor. In the future I want to pursue a career in computer science 
							and cybersecurity. Along with this, I'm a part of ACSL, TALENT, and Hadron. At IMSA you can find me playing tennis and chess, or strolling around with friends.
						</div>
					</div>
				</div>
				<div
					className="relative w-72 flex flex-col items-center border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-3xl transition-colors duration-200"
				>
					{/* Image container */}
					<div className="w-full h-64 overflow-hidden rounded-b-none rounded-t-3xl z-0">
						<img
							className="w-full h-full object-cover object-top"
							src="AboutUsImages/krithik.png"
							alt="Krithik Senthilkumar"
							style={{ aspectRatio: "600/600" }}
						/>
					</div>

					<div className="w-full bg-white -mt-5 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
						<h3 className="text-lg font-sans">
							<b>Krithik Senthilkumar</b>
						</h3>
						<p className="text-md text-gray-400 font-sans">
							<i>
								<b>Back-End Developer</b>
							</i>
						</p>
						<div className="text-md text-gray-700 font-sans mt-2 overflow-hidden">
							Hi, my name is Krithik. I am currently a junior living in 1504 A wing. 
                            My interests include Engineering and Computer Science. 
                            Whenever I am not at school, I like to play tennis and listen to music. 
                            Some clubs I am involved in are FRC, Epoch, and TAS. 
                            My favorite subjects are Physics and Chemistry. 
                            If you have any questions let me know!
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default AboutUs;
