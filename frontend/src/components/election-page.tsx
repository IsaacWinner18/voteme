import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const saveVoteToLocalStorage = (candidateId: string) => {
  localStorage.setItem("vote", candidateId.toString());
};

// Mock data for candidates
// const initialCandidates = [
//   {
//     id: 1,
//     name: "Candidate A",
//     image: "https://placehold.co/600x400",
//     description: "Innovative solutions for a brighter future",
//     votes: 0,
//   },
//   {
//     id: 2,
//     name: "Candidate B",
//     image: "https://placehold.co/600x400",
//     description: "Empowering communities through technology",
//     votes: 0,
//   },
//   {
//     id: 3,
//     name: "Candidate C",
//     image: "https://placehold.co/600x400",
//     description: "Sustainable development for all",
//     votes: 0,
//   },
//   {
//     id: 4,
//     name: "Candidate D",
//     image: "https://placehold.co/600x400",
//     description: "Bridging gaps in education and opportunity",
//     votes: 0,
//   },
// ];

const Election = () => {
  const [candidates, setCandidates] = useState<
    {
      _id: string;
      name: string;
      votes: number;
      image: string;
    }[]
  >([]);
  const [votedCandidate, setVotedCandidate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // const server_url = "http://localhost:5000";
  // const server_url = "http://192.168.21.122:5000";
  const server_url = "https://voteme-production.up.railway.app";

  const fetchUsers = async () => {
    const data = await fetch(`${server_url}/users`);
    const { data: userData } = await data.json();
    setCandidates(userData);
  };

  const voteUser = async (id: string) => {
    const data = await fetch(`${server_url}/user/vote/${id}`, {
      method: "PATCH",
    });
    const { data: userData } = await data.json();
    setCandidates((candidate) => {
      const newCandidates = candidate.map((can) => {
        if (can._id === id) {
          return userData;
        }
        return can;
      });

      saveVoteToLocalStorage(id);
      return newCandidates;
    });
  };

  useEffect(() => {
    fetchUsers();
    const voteExists = localStorage.getItem("vote");
    // const candidatesDataExists = localStorage.getItem("candidatesData");

    if (voteExists) setVotedCandidate(voteExists);

    // if (candidatesDataExists) setCandidates(JSON.parse(candidatesDataExists));

    setLoading(false);
  }, []);

  const handleVote = (candidateId: string) => {
    if (votedCandidate === null) {
      // setCandidates(() => {
      //   const newCandidates = candidates.map((candidate) =>
      //     candidate.id === candidateId
      //       ? { ...candidate, votes: candidate.votes + 1 }
      //       : candidate
      //   );
      //   return newCandidates;
      // });
      voteUser(candidateId);
      setVotedCandidate(candidateId);
    }
  };

  if (loading)
    return (
      <div className="grid place-content-center">
        <p>Loading...</p>
      </div>
    );
  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white pt-4">
      <h1 className="text-5xl font-bold text-center mb-12 text-white">
        Cast Your Vote!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {candidates.map((candidate) => {
          return (
            <motion.div
              key={candidate._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className={`bg-white text-gray-900 overflow-hidden transition-all duration-300 ${
                  votedCandidate && votedCandidate !== candidate._id
                    ? "opacity-50 scale-95"
                    : "hover:shadow-lg hover:shadow-blue-500/20"
                }`}
              >
                <div className="relative pb-[100%]">
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {candidate.name}
                  </h2>
                  <p className="text-gray-600 mb-4">lorem ipsum</p>
                  <div className="space-y-2">
                    <Progress
                      value={candidate.votes * 1}
                      className="h-2 bg-gray-200"
                    />
                    <p className="text-sm text-gray-500 text-right">
                      {candidate.votes}% of votes
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full py-6 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
                      votedCandidate && votedCandidate === candidate._id
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => handleVote(candidate._id)}
                    disabled={votedCandidate !== null}
                  >
                    <AnimatePresence>
                      {votedCandidate === candidate._id ? (
                        <motion.span
                          key="voted"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="flex items-center justify-center"
                        >
                          Voted! <Heart className="ml-2 fill-current" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="vote"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="flex items-center justify-center"
                        >
                          Vote <Heart className="ml-2" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Election;
