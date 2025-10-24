import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

const GeneratedPitch = () => {
  const [promptData, setPromptData] = useState({
    title: "",
    language: "english",
  });
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const { currentUser } = useAuth();
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const generatePitch = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
Summarize the following startup idea briefly.

Idea: "${promptData.title}"
Language: "${promptData.language}"

Generate a short and concise output with:
1. Startup Name (1 line)
2. Tagline (1 short line)
3. Elevator Pitch (2 short sentences max)
4. Problem & Solution (2 lines max)
5. Target Audience (1 line)
6. Landing Page Headline + Subtext (max 4 lines total)

If Language = "Roman Urdu", write in fluent Roman Urdu.
Otherwise, use simple English.

Keep tone creative but concise.
         `,
      });
      await addDoc(collection(db, "startups"), {
        title: promptData.title,
        content: response.text,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setContent(response.text);
      setLoading(false);
      setPromptData({
        title: "",
        language: "english",
      });
    } catch (error) {
      console.log(error.message);
      toast.error("Please Re-generated! Internal Error");
      setLoading(false);
    }
  };

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

  const handleChange = async (e) => {
    if (e.target.id === "title") {
      setPromptData({
        ...promptData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === "english" || e.target.id === "roman-urdu") {
      setPromptData({
        ...promptData,
        language: e.target.id,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3">
      <h1 className="text-3xl md:text-5xl text-center font-bold mt-6">
        Welcome ,{" "}
        {currentUser?.displayName}
      </h1>
      <p className="text-center text-2xl mt-3 mb-13">How’s it going?</p>
      <div className="border-2 border-gray-400  rounded p-4">
        <textarea
          placeholder="Your Start up Idea...."
          rows={4}
          value={promptData.title}
          onChange={handleChange}
          id="title"
          className="w-full outline-none resize-none placeholder:text-gray-500"
        ></textarea>

        <div className="flex flex-col md:flex-row gap-3 justify-between ">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <input
                onChange={handleChange}
                checked={promptData.language === "english"}
                type="checkbox"
                id="english"
              />
              <label>English</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                onChange={handleChange}
                checked={promptData.language === "roman-urdu"}
                type="checkbox"
                id="roman-urdu"
              />
              <label>Roman English</label>
            </div>
          </div>
          <button
            disabled={loading}
            className="px-8 py-2.5 rounded-full ml-4 transition-all duration-500 text-white bg-black disabled:opacity-85"
            onClick={generatePitch}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {content && (
        <>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleDownloadPDF}
              className="px-8 py-2.5 rounded-full ml-4 transition-all duration-500 text-white bg-black "
            >
              Export to PDF
            </button>
          </div>
          <div className="bg-gray-200 p-3 rounded my-5">
            <h1 className="text-3xl md:text-5xl text-center font-bold mt-6">
              Startup Idea :
            </h1>
            <div id="pdf-content" className="prose max-w-none p-4 pb-10">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GeneratedPitch;
