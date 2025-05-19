import React from "react";
import { Link } from "react-router-dom";
import logo from "../fire.svg"; 
import { FaCheckCircle } from 'react-icons/fa';
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white">
     
      <div className="py-4 px-4 text-center md:text-left md:flex md:items-center md:justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center text-white text-2xl font-bold">
          <img src={logo} alt="Flame Logo" className="h-8 w-8 mr-2" /> 
            Flame
        </Link>
      </div>

      
        <section className="py-16 px-4 text-center bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Ignite Your Video Editing Workflow
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Get precise, time-stamped feedback on your video projects, faster than ever.
          </p>
          <Link
            to="/signup"
            className="bg-white hover:bg-gray-300 text-black font-bold py-3 px-8 rounded-full transition duration-300 inline-block"
          >
            Try Flame For Free
          </Link>

          
          <div className="mt-8">
            <img
              src="../fire.svg" 
              alt="Flame Hero Mobile"
              className="w-full rounded-lg shadow-lg md:hidden" 
            />
            <img
              src="../fire.svg" 
              alt="Flame Hero Desktop"
              className="w-full rounded-lg shadow-lg hidden md:block" 
            />
          </div>
        </div>
      </section>

      
        <section className="py-16 px-4 bg-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Tired of Endless Feedback Revisions?
            </h2>
            <p className="text-lg text-gray-300">
              Email chains. Vague comments.  Misunderstood feedback.  We know the struggle.
            </p>
          </div>
        </section>

      
        <section className="bg-gray-700 py-16 px-4">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Flame Makes Feedback <span className="text-white">Simple</span>.</h2>
                <p className="text-lg text-gray-300">
                  Flame is the video review tool designed to streamline your workflow and eliminate confusion. Get clear, actionable feedback, directly on your video timeline.
                </p>
            </div>
        </section>
      
      <section className="py-16 px-4 bg-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Why Editors Love Flame
          </h2>
          <div className="grid grid-cols-1 gap-8">
            
            <div>
            <FaCheckCircle className="text-white text-3xl mb-2 inline-block" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Time-Stamped Feedback
              </h3>
              <p className="text-gray-300">
                Clients can leave comments directly on the video timeline,
                eliminating guesswork.
              </p>
            </div>
            <div>
            <FaCheckCircle className="text-white text-3xl mb-2 inline-block" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Streamlined Communication
              </h3>
              <p className="text-gray-300">
                Keep all feedback in one central location. No more scattered
                emails or messages.
              </p>
            </div>
            <div>
            <FaCheckCircle className="text-white text-3xl mb-2 inline-block" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Faster Revisions
              </h3>
              <p className="text-gray-300">
                Clear feedback means faster turnaround times and happier
                clients.
              </p>
            </div>
            <div>
            <FaCheckCircle className="text-white text-3xl mb-2 inline-block" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Easy to Use
              </h3>
              <p className="text-gray-300">
                Simple and intuitive interface for both editors and clients. No
                learning curve.
              </p>
            </div>
            <div>
            <FaCheckCircle className="text-white text-3xl mb-2 inline-block" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Version Control
              </h3>
              <p className="text-gray-300">
                Keep track of different video versions and feedback history.
              </p>
            </div>
            <div>
            <FaCheckCircle className="text-white text-3xl mb-2 inline-block" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Secure and Private
              </h3>
              <p className="text-gray-300">
                Your videos and feedback are kept safe and confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      
        <section className="bg-gray-700 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold  text-center mb-12 text-white">
            Flame Features
          </h2>
          <div className="space-y-8">
           
            <div className="flex flex-col items-center">
              <img
                src="../fire.svg" 
                alt="Link Management"
                className="w-full rounded-lg shadow-md mb-4"
              />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Precision Feedback with Time-Stamping
              </h3>
              <p className="text-gray-300 text-center">
               Clients can click anywhere on the video timeline to leave a
                comment, ensuring feedback is specific and easy to understand.
              </p>
            </div>

            
            <div className="flex flex-col items-center">
              <img
                src="../fire.svg" 
                alt="Page Customization"
                className="w-full rounded-lg shadow-md mb-4"
              />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Organized Version History
              </h3>
              <p className="text-gray-300 text-center">
                Upload new versions of your video and keep all feedback organized
                by version.
              </p>
            </div>
            
             <div className="flex flex-col items-center">
              <img
                src="../fire.svg" 
                alt="Link Management"
                className="w-full rounded-lg shadow-md mb-4"
              />
              <h3 className="text-2xl font-semibold text-white mb-2">
                 Simple for Clients
              </h3>
              <p className="text-gray-300 text-center">
                No complicated software to learn. Clients can review videos and
                leave feedback directly in their web browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-gray-900 py-16 px-4 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold  mb-4">
            Ready to Supercharge Your Video Reviews?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your free trial of Flame today.
          </p>
          <Link
            to="/signup"
            className="bg-white hover:bg-gray-300 text-black font-bold py-3 px-8 rounded-full transition duration-300 inline-block"
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