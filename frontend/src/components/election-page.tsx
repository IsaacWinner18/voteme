import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { LoginPopupComponent } from "./login-popup";
import { ClipLoader } from "react-spinners";
// import { server_url } from "@/config";
// import { div } from "framer-motion/client";
import AnonymousPostCard from "./anonymous-post-card";

const Election = () => {
  const [candidates, setCandidates] = useState<
    {
      _id: string;
      name: string;
      votes: {
        _id: "6740ce47bc6707b3a8b20f89";
        email: "11@gmail.com1";
        verified: true;
        code: null;
        __v: 0;
      }[];
      image: string;
    }[]
  >([]);
  const [votedCandidate, setVotedCandidate] = useState<string | null>(null);
  const [user, setUser] = useState<null | {
    _id: "6740ce47bc6707b3a8b20f89";
    email: "11@gmail.com1";
    verified: true;
    code: null;
    __v: 0;
  }>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // const server_url = "http://localhost:5000";
  // const server_url = "http://192.168.21.122:5000";
  const server_url = "https://voteme-production.up.railway.app";

  const fetchUsers = async () => {
    const data = await fetch(`${server_url}/users`);
    const { data: userData } = await data.json();
    setCandidates(userData);
  };

  useEffect(() => {
    setInterval(() => {
      fetchUsers();
    }, 10000);
  }, []);
  // const Logout = async () => {
  //   const data = await fetch(`${server_url}/logout`, {
  //     credentials: "include",
  //   });

  //   if (!data.ok) throw new Error("Error while trying to log out.");

  //   setUser(null);
  //   setVotedCandidate(null);
  // };

  const voteUser = async (id: string) => {
    const request = await fetch(`${server_url}/user/vote/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    const { data: userData } = await request.json();

    if (!request.ok) throw new Error("Error while trying to vote user.");

    setCandidates((candidate) => {
      const votedCandidate = candidate.map((can) => {
        if (can._id === id) {
          return {
            ...can,
            votes: [...can.votes, userData],
          };
        }
        return can;
      });

      return votedCandidate;
    });
  };

  const handleVote = (candidateId: string) => {
    if (votedCandidate === null) {
      if (!user) {
        return setIsOpen(true);
      }
      voteUser(candidateId);
      setVotedCandidate(candidateId);
    }
  };

  const fetchUser = async () => {
    const request = await fetch(`${server_url}/me`, {
      method: "GET",
      credentials: "include",
    });

    const response = await request.json();

    if (!request.ok) throw new Error("Error while trying to fetch user data.");

    setUser(response.user);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchUsers();
        await fetchUser();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    hasVoted();
  }, [user]);

  const hasVoted = () => {
    console.log(user);
    if (user)
      candidates.forEach((cand) => {
        const voteExists = cand.votes.find(
          (cand_user) => cand_user._id === user?._id
        );
        if (voteExists) {
          setVotedCandidate(cand._id);
        }
      });
  };

  return (
    <div>
      {!loading && isOpen && (
        <LoginPopupComponent
          onClose={() => setIsOpen(false)}
          onLogin={fetchUser}
          setIsOpen={setIsOpen}
          setUser={setUser}
        />
      )}

      <div
        className={`bg-gradient-to-br from-gray-900 to-blue-900 text-white pt-4 `}
      >
        <div>
           <h1 className="text-2xl md:text-4xl font-bold text-center md:mb-12 mb-6 text-white m-1">
            <p onClick={hasVoted} className="opacity-40">
              Achievers University Voting week.
            </p>

            <p className="text-blue-200">Vote for the beauty of the week!</p>
          </h1> 
        </div>

        {!loading && (
          <div>
            <div className="grid grid-cols-1 py-8 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              {candidates.map((candidate) => {
                // console.log(candidate);
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
                          loading="lazy"
                          src={candidate.image}
                          // src="/pexels-dear.jpg"
                          alt={candidate.name}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-2 text-gray-800">
                        {candidate.name}
                      </h2>
                      <p className="text-gray-600 mb-4">Achievers University</p>
                      <div className="space-y-2">
                        <Progress
                          value={candidate.votes.length}
                          className="h-2 bg-gray-200"
                        />
                        <p className="text-sm text-gray-500 text-right">
                          {candidate.votes.length}% of votes
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

                    <footer></footer>
                  </motion.div>
                );
              })}
            </div>

            {/* <div>
       {user && (
          <div className="w-full flex justify-center">
            <button
              className="w-fit bg-white text-black mx-auto py-2 px-4"
              onClick={Logout}
            >
              Logout
            </button>
          </div>
        )}
        </div> */}

            <AnonymousPostCard />
          </div>
        )}
        <div
          className={`${
            loading ? "grid" : "hidden"
          } h-screen place-content-center`}
        >
          <ClipLoader
            color={"#fffff"}
            loading={true}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    </div>
  );
};

export default Election;
