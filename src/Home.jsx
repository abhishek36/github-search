import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        setLoading(true);
        fetch(
          `https://api.github.com/search/users?q=${search}&page=${
            page + 1
          }&per_page=6`
        )
          .then((res) => res.json())
          .then((data) => {
            setUsers(data.items || []);
            setTotalPages(Math.ceil((data.total_count || 1) / 6));
            setLoading(false);
          })
          .catch(() => {
            setUsers([]);
            setLoading(false);
          });
      } else {
        setUsers([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-400">
        GitHub User Finder
      </h1>
      <p className="text-center text-gray-400 mb-6">
        Search and explore GitHub user profiles
      </p>

      <input
        type="text"
        placeholder="Search GitHub users..."
        className="w-full max-w-xl mx-auto block p-3 border border-gray-700 bg-gray-800 text-white rounded mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
      />

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 border border-gray-700 p-4 rounded-lg animate-pulse"
            >
              <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 w-1/2 mx-auto mb-2 rounded"></div>
              <div className="h-3 bg-gray-600 w-2/3 mx-auto rounded"></div>
            </div>
          ))}
        </div>
      ) : search.trim() === "" ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">Start by typing a username above 👆</p>
        </div>
      ) : users.length > 0 ? (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link to={`/user/${user.login}`}>
                  <div className="bg-gray-800 hover:bg-gray-700 border border-gray-700 p-6 rounded-2xl shadow-md transition-all duration-300">
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <h2 className="text-xl text-center font-semibold">
                      {user.login}
                    </h2>
                    <p className="text-center text-sm text-gray-400 mt-2">
                      View Profile →
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected)}
            containerClassName={"flex justify-center gap-2 mt-10 flex-wrap"}
            pageClassName={
              "px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
            }
            activeClassName={"bg-blue-500 text-white"}
            previousClassName={
              "px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
            }
            nextClassName={
              "px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
            }
            disabledClassName={"opacity-50 pointer-events-none"}
          />
        </>
      ) : (
        <p className="text-center text-gray-400 mt-10">No results found.</p>
      )}

      <footer className="mt-16 text-center text-gray-600 text-sm">
        Built with ❤️ by Abhishek Sharma
      </footer>
    </div>
  );
}
