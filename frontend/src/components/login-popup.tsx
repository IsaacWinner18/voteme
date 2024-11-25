import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { server_url } from "@/config";
// import { div } from "framer-motion/client";

type LoginPopupProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<
    React.SetStateAction<{
      _id: "6740ce47bc6707b3a8b20f89";
      email: "11@gmail.com1";
      verified: true;
      code: null;
      __v: 0;
    } | null>
  >;
  onClose: () => void;
  onLogin: (email: string) => void;
};

export function LoginPopupComponent({
  setIsOpen,
  setUser,
  onClose,
  onLogin,
}: LoginPopupProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<
    "email" | "verify" | "success" | "error" | null
  >("email");
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${server_url}/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      await response.json();

      if (response.ok) {
        setStep("verify");
      } else throw new Error();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("SOMETHIGN WENT WRONG WHILE TRYING TO LOGIN THE USER");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !verificationCode)
        throw new Error("Invalid credentials provided.");

      const response = await fetch(`${server_url}/verify-code`, {
        method: "PATCH",
        body: JSON.stringify({
          email,
          code: Number(verificationCode),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setUser(data.user);
        setStep("success");

        setTimeout(() => {
          setIsOpen(false);
        }, 1000);
        return;
      } else
        throw new Error(
          "Something went wrong while trying to verify user's code."
        );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    // Here you would typically verify the code with your backend
    // For this example, we'll just check if the code is '1234'
    if (verificationCode === "1234") {
      setStep("success");
      setTimeout(() => {
        onLogin(email);
        onClose();
      }, 2000);
    } else {
      setStep("error");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>

          {loading && <p>I am currently loading </p>}
          {step === "email" && (
            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Send Verification Code
              </Button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  className="text-black"
                  id="verificationCode"
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" /> Verify
              </Button>
            </form>
          )}

          {step === "success" && (
            <Alert className="bg-green-100 border-green-500 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Login successful!</AlertDescription>
            </Alert>
          )}

          {step === "error" && (
            <div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Invalid verification code.{" "}
                  <span
                    className="underline cursor-pointer"
                    onClick={() => setStep("verify")}
                  >
                    Please try again.
                  </span>
                </AlertDescription>
              </Alert>
              <button className="text-white bg-blue-600 rounded-xl px-8 py-2 m-4 font-bold flex items-center justify-center">
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
