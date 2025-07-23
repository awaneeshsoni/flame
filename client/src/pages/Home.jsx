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

          {/* <div className="mt-16">
            <img
              src="https://pub-53811a87b70948d3b472a354aefe49fb.r2.dev/Screenshot%202025-07-23%20180316.png"
              alt="Flameio logo"
              className="w-full mx-auto rounded-sm shadow-2xl p-2 md:p-4 bg-white/30"
            />
          </div> */}
          <div className="w-full mt-16">
            <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl overflow-hidden">
              <img
                src="https://pub-53811a87b70948d3b472a354aefe49fb.r2.dev/Screenshot%202025-07-23%20180316.png"
                alt="hero image"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 px-6 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Tired of Endless Feedback Revisions?</h2>
          <p className="text-sm text-white/70">
            Email chains. Vague comments. Misunderstood feedback. We know the struggle.
          </p>
        </div>
      </section>


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


      <section className="py-20 px-6 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12">Why Editors Love <span className="text-orange-600">Flame</span></h2>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            {[
              ["Time-Stamped Feedback", "Clients can leave comments directly on the video timeline."],
              ["Streamlined Communication", "All feedback in one place. No scattered messages."],
              ["Faster Revisions", "Clear feedback means faster turnaround times."],
              ["Easy to Use", "No learning curve. Just clarity and control."],
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


      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Flame Features</h2>

          <div className="space-y-24">
            {[
              {
                title: "Precision Feedback with Time-Stamping",
                desc: "Clients click on the video timeline to leave specific, easy-to-understand comments.",
                img: "https://pub-53811a87b70948d3b472a354aefe49fb.r2.dev/Screenshot%202025-07-23%20180316.png",
              },
              {
                title: "Invite Team Members",
                desc: "Invite your team to a workspace and collaborate on video projects seamlessly via invite code.",
                img: "https://pub-53811a87b70948d3b472a354aefe49fb.r2.dev/Screenshot%202025-07-23%20182159.png",
              },
              // {
              //   title: "Simple for Clients",
              //   desc: "No complicated tools. Everything works in the browser, even for non-tech-savvy clients.",
              //   img: "https://your-cdn.com/simple-client.png",
              // },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
              >
                <div className="w-full lg:w-1/2">
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl overflow-hidden">
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-base text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



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
