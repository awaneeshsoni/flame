import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const plans = [
    {
        name: "Free",
        id: "free",
        price: "$0/mo",
        description: "Perfect to get started — ideal for individuals and hobbyists.",
        features: [
            "1 Workspace",
            "Upto 2 GB reusable cloud Storage",
            "Up to 3 Members per Workspace",
        ],
        cta: "Start for Free",
    },
    {
        name: "Pro",
        id: "pro",
        price: "$29/mo",
        description: "Great for small teams who need more storage and control.",
        features: [
            "3 Workspaces",
            "10GB reusable cloud  storage per workspace",
            "Up to 5 Members per Workspace",
            "Priority Support",
        ],
        cta: "Upgrade to Pro",
    },
    {
        name: "Business",
        id: "business",
        price: "$99/mo",
        description: "Built for growing teams and professional use cases.",
        features: [
            "5 Workspaces",
            "20GB reusable cloud storage per workspace",
            "Up to 10 Members per Workspace",
            "Advanced Collaboration Tools",
            "Premium Support",
        ],
        cta: "Go Business",
    },
];

export default function Pricing() {
    return (
        <div className="bg-black text-white min-h-screen py-4 px-4">
            <div className="max-w-5xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">Plans that scale with you</h1>
                <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
                    From solo creators to growing teams — pick a plan that fits your needs. Upgrade anytime.
                </p>

                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-md flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-orange-400 mb-1">{plan.name}</h2>
                                <p className="text-2xl font-bold text-white mb-2">{plan.price}</p>
                                <p className="text-zinc-400 mb-4 text-sm">{plan.description}</p>

                                <ul className="space-y-2 mb-6 text-sm text-white/80 text-left">
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>• {feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                to={plan.id === "free" ? "/login" : `/checkout?plan=${plan.id}`}
                                className="mt-auto bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-semibold text-sm transition"
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
