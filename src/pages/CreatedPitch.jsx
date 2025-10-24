import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const getStartupByUid = async (uid) => {
  const q = query(collection(db, "startups"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return [];
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const CreatedPitch = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["startups", currentUser?.uid],
    queryFn: () => getStartupByUid(currentUser.uid),
    enabled: !!currentUser?.uid, // only run when user is available
  });

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "startups", id));
    toast.success("Deleted Successfully!");
    refetch();
  };

  if (isLoading) {
    return(
      <h1 className="text-center text-2xl my-10">Loading! Please Wait...</h1>
    )
  }
  if (isError) {
    return <h1 className="text-center text-red-500">Error loading data</h1>;
  }
  console.log(data)
  return (
    <div className="max-w-6xl mx-auto p-3">
      <h2 className="text-2xl font-bold mb-4 text-center">
        My Created Pitches
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-[800px] w-full border-collapse text-left">
          <thead className="bg-gray-100 text-gray-700 border-b border-gray-400">
            <tr>
              <th className="py-3 px-4 w-16">#</th>
              <th className="py-3 px-4 min-w-[250px]">Title</th>
              <th className="py-3 px-4 min-w-[180px]">Created Date</th>
              <th className="py-3 px-4 text-center min-w-[180px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>

                  <td
                    className="py-3 px-4 max-w-[350px] truncate"
                    title={item.title}
                  >
                    {item.title}
                  </td>

                  <td className="py-3 px-4">
                    {item.createdAt?.seconds
                      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/pitch-details/${item.id}`)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No startups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreatedPitch;
