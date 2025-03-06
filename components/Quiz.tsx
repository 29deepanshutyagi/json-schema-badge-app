"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const questions = [
  {
    question: "What does JSON stand for?",
    options: ["Java Object Notation", "JavaScript Object Notation", "Java-Oriented Notation"],
    answer: 1,
  },
  {
    question: "Which format does JSON replace?",
    options: ["XML", "YAML", "CSV"],
    answer: 0,
  },
];

export default function Quiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) throw new Error("Submission failed");
      router.push("/result");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {currentStep === 0 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <Button 
            onClick={() => setCurrentStep(1)}
            disabled={!name || !email}
            className="w-full"
          >
            Start Quiz
          </Button>
        </div>
      )}

      {currentStep > 0 && currentStep <= questions.length && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Question {currentStep} of {questions.length}
          </h2>
          <p className="text-lg">{questions[currentStep - 1].question}</p>
          <div className="space-y-2">
            {questions[currentStep - 1].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => {
                  setAnswers([...answers, index]);
                  if (currentStep === questions.length) {
                    handleSubmit();
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                className="w-full text-left justify-start"
                variant="outline"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}