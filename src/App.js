import FindTutors from "./pages/FindTutors";
import NavBar from "./components/NavBar";
import Tutor from "./pages/Tutor";
export default function App() {
  return (
    <div>
      {/* <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <TutorCard
        name="Aarav Shah"
        wing="D"
        hall="1505"
        classes={["Advanced Topics", "MI 1/2", "Anatomy and Physiology"]}
        routing_link="/tutor/ashah"
        image="/ashah.jpg"
        /> */}
      <NavBar></NavBar>
      <Tutor></Tutor>
    </div>
  );
}
