import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-5 items-center h-[calc(100vh-200px)] justify-center">
      <h1 className="text-2xl md:text-6xl font-bold text-center">
        <span className="text-slate-600">Pitch</span> Perfect:{" "}
        <span className="text-slate-600">Craft</span> Your Success Story.
      </h1>
      <p className="text-lg md:text-3xl text-center">Transform your ideas into compelling presentations that captivate audiences and secure your goals.</p>
      <button onClick={()=> navigate('/generate-pitch')} className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 text-white bg-black`}>Get Started</button>
    </div>
  );
};

export default Home;
