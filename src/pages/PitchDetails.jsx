import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "../config/firebase";
import Markdown from "react-markdown";
import html2pdf from "html2pdf.js";

const getStartupById = async (id) => {
  const docRef = doc(db, "startups", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Startup not found");
  }
  return { id: docSnap.id, ...docSnap.data() };
};

const PitchDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["startup", id],
    queryFn: () => getStartupById(id),
    enabled: !!id,
  });

  const handleDownloadPDF = () => {
    const element = document.getElementById("pdf-content");
    const options = {
      margin: 0.5,
      filename: "pitch_craft.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    html2pdf().set(options).from(element).save();
  };

  if (isLoading)
    return <p className="text-center text-xl my-10">Loading...</p>;

  if (isError)
    return (
      <p className="text-center text-red-500 my-10">
        Error: {error.message}
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-5">
      
      <div className="flex justify-end mb-2">
        <button
          onClick={handleDownloadPDF}
          className="px-8 py-2.5 rounded-full transition-all duration-500 text-white bg-black hover:bg-gray-800"
        >
          Export to PDF
        </button>
      </div>

      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-gray-600 mb-5">
        {data.createdAt
          ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
          : "—"}
      </p>
      
      <div id="pdf-content" className="whitespace-pre-wrap text-lg leading-relaxed prose" >
        <Markdown>
        {data.content}
        </Markdown>
      </div>
    </div>
  );
};

export default PitchDetails;
