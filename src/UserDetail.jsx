import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserDetail() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRepos = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();

        const repoRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`
        );
        const repoData = await repoRes.json();

        setUser(userData);
        const sortedRepos = (repoData || [])
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5);
        setRepos(sortedRepos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRepos();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-gray-700"></div>
            <div className="flex-1 space-y-3">
              <div className="w-2/3 h-5 bg-gray-700 rounded"></div>
              <div className="w-1/3 h-4 bg-gray-700 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-700 rounded p-4 space-y-2">
                <div className="w-1/2 h-4 bg-gray-600 rounded"></div>
                <div className="w-full h-3 bg-gray-600 rounded"></div>
                <div className="w-1/4 h-3 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.message === "Not Found") {
    return (
      <div className="text-center text-red-400 mt-20">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <Link to="/" className="text-blue-400 underline mt-4 block">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Link to="/" className="text-blue-400 underline mb-6 block">
        ← Back to Search
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        {/* Profile */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-32 h-32 rounded-full border-4 border-gray-700"
          />
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {user.name || user.login}
            </h1>
            <p className="text-gray-400 mb-2">@{user.login}</p>
            {user.bio && <p className="mb-4">{user.bio}</p>}
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold transition"
            >
              Visit GitHub Profile
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-700 rounded p-4">
            <p className="text-xl font-bold">{user.followers}</p>
            <p className="text-gray-400">Followers</p>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-xl font-bold">{user.following}</p>
            <p className="text-gray-400">Following</p>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-xl font-bold">{user.public_repos}</p>
            <p className="text-gray-400">Repos</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-6 text-sm text-gray-400 space-y-2">
          {user.location && (
            <p>
              <strong>📍 Location:</strong> {user.location}
            </p>
          )}
          {user.blog && (
            <p>
              <strong>🔗 Website:</strong>{" "}
              <a
                href={
                  user.blog.startsWith("http")
                    ? user.blog
                    : `https://${user.blog}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                {user.blog}
              </a>
            </p>
          )}
          {user.company && (
            <p>
              <strong>🏢 Company:</strong> {user.company}
            </p>
          )}
          {user.twitter_username && (
            <p>
              <strong>🐦 Twitter:</strong>{" "}
              <a
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                @{user.twitter_username}
              </a>
            </p>
          )}
        </div>

        {/* Top Repositories */}
        {repos.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">⭐ Top Repositories</h2>
            <div className="space-y-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-gray-700 rounded p-4 hover:bg-gray-600 transition"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold">{repo.name}</h3>
                    <span className="text-yellow-400">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-sm text-gray-300">{repo.description}</p>
                  )}
                  <div className="text-xs mt-2 text-gray-400">
                    {repo.language && `🛠 ${repo.language}`}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
