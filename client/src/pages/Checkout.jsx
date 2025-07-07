import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const planDetails = {
    pro: {
        name: "Pro",
        price: "$29/month",
        description: "Ideal for small teams",
    },
    business: {
        name: "Business",
        price: "$99/month",
        description: "Perfect for growing organizations",
    },
};

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const plan = params.get("plan");

    useEffect(() => {
        if (!plan || !["pro", "business"].includes(plan)) {
            navigate("/pricing");
        }
    }, [plan, navigate]);

    if (!plan || !["pro", "business"].includes(plan)) return null;

    const selectedPlan = planDetails[plan];

    return (
        <div className="bg-black text-white min-h-screen py-4 px-4 flex flex-col">
            <div className="bg-black text-white flex flex-col items-center justify-center">
                <div className="max-w-md w-full bg-zinc-900 p-6 mt-30 rounded shadow border border-zinc-700">
                    <h1 className="text-2xl font-bold mb-2 text-orange-500">
                        Checkout: {selectedPlan.name} Plan
                    </h1>
                    <p className="text-zinc-300 mb-6">{selectedPlan.description}</p>

                    <div className="mb-6">
                        <p className="text-lg font-semibold">Total: {selectedPlan.price}</p>
                    </div>

                    {/* Replace with your payment integration */}
                    <button
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold transition"
                    //   onClick={() => alert("Integrate LemonSqueezy/Stripe here")}
                    >
                        Coming Sooon...
                    </button>

                    <button
                        onClick={() => navigate("/pricing")}
                        className="mt-4 text-sm text-zinc-400 underline hover:text-white"
                    >
                        Go back to pricing
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
