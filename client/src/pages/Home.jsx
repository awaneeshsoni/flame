import React from "react";
import { Link } from "react-router-dom";
import logo from "../fire.svg";
import { FaCheckCircle } from "react-icons/fa";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-black text-white font-sans">
      <section className="py-20 px-6 text-center bg-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-orange-600">Ignite</span> Your Video Editing Workflow
          </h1>
          <p className="text-sm md:text-base text-white/70 mb-10">
            Get precise, time-stamped feedback on your video projects, faster than ever.
          </p>
          <Link
            to="/signup"
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-3 px-8 rounded-md transition duration-300"
          >
            Try Flame For Free
          </Link>

          <div className="mt-16">
            <img
              src={logo}
              alt="Flame Hero"
              className="w-full max-w-md mx-auto rounded-md shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Tired of Endless Feedback Revisions?</h2>
          <p className="text-sm text-white/70">
            Email chains. Vague comments. Misunderstood feedback. We know the struggle.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Flame Makes Feedback <span className="text-orange-600">Simple</span>.
          </h2>
          <p className="text-sm text-white/70">
            Streamline your workflow and eliminate confusion. Get clear, actionable feedback directly on your video timeline.
          </p>
        </div>
      </section>

      {/* Why Editors Love Flame */}
      <section className="py-20 px-6 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12">Why Editors Love <span className="text-orange-600">Flame</span></h2>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            {[
              ["Time-Stamped Feedback", "Clients can leave comments directly on the video timeline."],
              ["Streamlined Communication", "All feedback in one place. No scattered messages."],
              ["Faster Revisions", "Clear feedback means faster turnaround times."],
              ["Easy to Use", "No learning curve. Just clarity and control."],
              ["Version Control", "Track all versions and feedback history with ease."],
              ["Secure and Private", "Your videos and feedback stay confidential."],
            ].map(([title, desc], i) => (
              <div key={i}>
                <FaCheckCircle className="text-orange-600 text-lg mb-2" />
                <h3 className="text-base font-semibold mb-1">{title}</h3>
                <p className="text-sm text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12">Flame Features</h2>
          <div className="space-y-16">
            {[
              ["Precision Feedback with Time-Stamping", "Clients click on video timeline to leave specific, easy-to-understand comments."],
              ["Organized Version History", "Upload new video versions and organize feedback by each."],
              ["Simple for Clients", "No complicated tools. Everything works in the browser."],
            ].map(([title, desc], i) => (
              <div key={i} className="flex flex-col items-center">
                <img src={logo} alt="Feature" className="w-full max-w-sm rounded-md shadow-md mb-4" />
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <p className="text-sm text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-black border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to <span className="text-orange-600">Supercharge</span> Your Video Reviews?
          </h2>
          <p className="text-sm text-white/70 mb-8">
            Start your free trial of Flame today.
          </p>
          <Link
            to="/signup"
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-3 px-8 rounded-md transition duration-300"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
