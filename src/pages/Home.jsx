import React, { useEffect } from 'react';
import TutorBoard from '../components/TutorBoard';
import Bulletin from '../components/BulletinBoard';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faBuilding, faThumbTack , faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    if(location.hash === "#bulletinboard"){
      document.getElementById("bulletinboard").scrollIntoView()
    }
  })

  return (
    <>
      <div className="w-full mt-16"></div>     
      <div className="flex flex-col md:flex-row justify-around w-full h-auto md:h-80 bg-slate-100 px-4">
        <div className="flex flex-col md:text-left h-full justify-center py-8">
          <h2 className="text-gray-700 text-3xl md:text-4xl font-bold mb-5 md:mb-0">Find resources from <span className="text-blue-500">IMSA students</span></h2>
          <h2 className="text-gray-400 text-sm font-bold mb-3">Find help in your very own hall! Discover tutors and find them during their schedules!</h2>
          <button className="md:w-1/3 bg-blue-500 text-white py-2 px-4 rounded"><a href="/findTutors">Find tutors now →</a></button>
        </div>
        <img src="/smartguy.png" className="w-full md:w-auto"></img>
      </div>
      <div className="mt-10 mx-2 mb-4 px-4 md:mx-20 md:px-0">
        <h2 className="text-gray-700 text-3xl md:text-5xl font-bold w-full">IMSA students <span className="text-blue-500">for their peers</span></h2>
        <div className="mt-8 flex flex-col md:flex-row w-full justify-evenly gap-4">
          <div className="bg-slate-50 p-4 w-full md:w-2/7">
            <FontAwesomeIcon icon={faUserGroup} className="text-2xl text-blue-500" />
            <h2 className="text-gray-700 text-2xl font-bold mb-2">Peer Tutors on Campus</h2>
            <h2 className="text-gray-600 text-md">Find peer tutors that are willing to help you in any class of your choosing, in your hall! Find different peer tutor schedules so that you can go find them when you need help!</h2>
          </div>
          <div className="bg-slate-50 p-4 w-full md:w-2/7">
            <FontAwesomeIcon icon={faBuilding} className="text-2xl text-blue-500" />
            <h2 className="text-gray-700 text-2xl font-bold mb-2">Class Materials</h2>
            <h2 className="text-gray-600 text-md">Are you struggling to find practice problems, looking for things to study, or trying to find ways to get ahead in class? Find the solution to all of these and more in teacher-approved class materials!</h2>
          </div>
          <div className="bg-slate-50 p-4 w-full md:w-2/7">
            <FontAwesomeIcon icon={faThumbTack} className="text-2xl text-blue-500" />
            <h2 className="text-gray-700 text-2xl font-bold mb-2">Bulletin</h2>
            <h2 className="text-gray-600 text-md">Curious about upcoming events at IMSA? Want to connect with many peer tutors at the same time? Head over to the bulletin to see events happening soon, whether it be study sessions, opportunities to talk to teachers, and more!</h2>
          </div>
        </div>
      </div>
      <div id ="bulletinboard" className="mt-20 flex flex-col justify-center items-center p-4 md:p-10 w-full">
        <div className="w-full">
          <Bulletin />
        </div>
        <div className="m-4 md:m-10"></div>
        <TutorBoard/>
      </div>
    </>
  );
}

// export default Homepage;
