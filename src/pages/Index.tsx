import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FloatingVoiceButton } from "@/components/FloatingVoiceButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <HomePage />
      <FeedbackForm />
      <FloatingVoiceButton />
    </div>
  );
};

export default Index;
