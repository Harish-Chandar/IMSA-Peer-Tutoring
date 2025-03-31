import "./App.css";
import Note from "./Components/note";
import Bulletin from "./Components/bulletinBoard";
import TutorBoard from "./Components/tutorBoard";

function App() {
  return (
    <>
    <div className="display-flex flex-col"> 

    <nav className="bg-slate-50 w-full h-15 fixed top-0 left-0 flex flex-row px-6 shadow-md">
      <h2 className="self-center text-4xl text-blue-500 font-bold text-left ">Peer Tutors @ IMSA</h2>

      <div className="self-center ml-auto relative group">
        <h3 className="text-slate-500 text-lg font-bold">Class Resources</h3>
        <div className="absolute bg-slate-50 hidden group-hover:block">
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Link 1</a>
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Link 2</a>
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Link 3</a>
        </div>
      </div>
   

    </nav>
    <div className="w-full h-15"></div>
    <div className="flex flex-row justify-evenly w-screen h-80 bg-slate-100">
      <div className="self-start flex flex-col text-left h-full justify-center">
        <h2 className="text-gray-700 text-4xl font-bold">Find resources from <span className="text-blue-500">IMSA students</span></h2>
        <h2 className="text-gray-400 text-sm font-bold mb-3">Find help in your very own hall! Discover tutors and find them during their schedules!</h2>
        <button className="w-1/3">Find tutors now</button>
      </div>
      <img src="/assets/smartguy.png"></img>
    </div>
    <div className="mt-6 mb-4 ">
      <h2 className="text-gray-700 text-5xl font-bold">IMSA students <span className="text-blue-500">for their peers</span></h2>
      <div className="mt-8 flex flex-row w-full justify-evenly">
        <div className="bg-slate-50 p-4 w-80">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Peer Tutors on Campus</h2>
          <h2 className="text-gray-600 text-md">Find peer tutors that are willing to help you in any class of your choosing, in your hall! Find different peer tutor schedules so that you can go find them when you need help!</h2>
        </div>
        <div className="bg-slate-50 p-4 w-80">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Class Materials</h2>
          <h2 className="text-gray-600 text-md">Are you struggling to find practice problems, looking for things to study, or trying to find ways to get ahead in class? Find the solution to all of these and more in teacher-approved class materials!</h2>
        </div>
        <div className="bg-slate-50 p-4 w-80">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Bulletin</h2>
          <h2 className="text-gray-600 text-md">Curious about upcoming events at IMSA? Want to connect with many peer tutors at the same time? Head over to the bulletin to see events happining soon, whether it be study sessions, oppurtunities to talk to teachers, and more!</h2>
        </div>
      </div>
    </div>
    <div className="bg-nuetral-200 flex flex-col justify-center items-center flex-col shadow-2xl p-10">
      <Bulletin />
      <div className="m-10"></div>
      <TutorBoard/>
    </div>

    </div>
      
     
    </>
  );

}

export default App;
