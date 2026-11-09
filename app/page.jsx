
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, localToday } from "@/lib/api";
import { unsplash as U } from "@/lib/constants";
import EventCard from "@/components/EventCard";
import CardSkeletons from "@/components/Skeletons";
import SafeImg from "@/components/SafeImg";
import Icon from "@/components/Icons";
import { SectionHead } from "@/components/Heads";

// Edit these placeholder numbers to match your own community.
const stats = [
  ["1,450+", "Active Volunteers", "text-primary"],
  ["180+", "Events Completed", "text-emerald-500"],
  ["24,000+", "Lives Impacted", "text-secondary"],
  ["100%", "Community Driven", "text-accent"],
];

const features = [
  [
    "edit",
    "Create Events",
    "Post a clean-up, distribution drive or camp in under a minute.",
  ],
  [
    "users",
    "Join with One Click",
    "Sign up for drives near you and leave any time.",
  ],
  [
    "shield",
    "Manage Your Drives",
    "Edit or delete only the events you organise, protected by secure login.",
  ],
  [
    "moon",
    "Light & Dark Mode",
    "Switch themes to suit your eyes, day or night.",
  ],
];

const gallery = [
  [
    "photo-1593113598332-cd288d649433",
    "Winter Clothes Drive",
    "Mirpur 10, Dhaka",
    "Warm clothes",
  ],
  [
    "photo-1532629345422-7515f3d16bb6",
    "Night Blanket Relief",
    "Mohammadpur, Dhaka",
    "Shelter support",
  ],
  [
    "photo-1618477461853-cf6ed80faba5",
    "Lake Clean-up",
    "Dhanmondi, Dhaka",
    "Eco-friendly",
  ],
  [
    "photo-1542601906990-b4d3fb778b09",
    "Tree Plantation",
    "Uttara, Dhaka",
    "Green city",
  ],
  [
    "photo-1559027615-cd4628902d4a",
    "Relief Packing",
    "Kawran Bazar, Dhaka",
    "Food relief",
  ],
  [
    "photo-1488521787991-ed7bbaae773c",
    "Book & Bag Drive",
    "Old Dhaka",
    "Education",
  ],
];

export default function Home() {
  const [events, setEvents] = useState(null);
  const [email, setEmail] = useState("");

  // Load upcoming events
  useEffect(() => {
    let active = true;

    api(`/events?limit=6&from=${localToday()}`)
      .then((response) => {
        console.log("Events API Response:", response);

        // Handle different API response structures
        let eventList = [];

        if (Array.isArray(response)) {
          eventList = response;
        } else if (Array.isArray(response?.data)) {
          eventList = response.data;
        } else if (Array.isArray(response?.events)) {
          eventList = response.events;
        } else if (Array.isArray(response?.data?.events)) {
          eventList = response.data.events;
        }

        if (active) {
          setEvents(eventList);
        }
      })
      .catch((error) => {
        console.error("Events API Error:", error);

        if (active) {
          toast.error(error.message || "Failed to load events.");
          setEvents([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Newsletter subscription
  const subscribe = (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return toast.error("Enter a valid email address.");
    }

    toast.success(
      "Thanks for subscribing! You will hear about new events."
    );

    setEmail("");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-6">
            <Icon n="heart" className="w-3.5 h-3.5" />
            Community-Driven Social Development Platform
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Small Acts.{" "}
            <span className="text-primary">
              Whole Neighbourhoods Changed.
            </span>
          </h1>

          <p className="mt-5 opacity-70 max-w-2xl mx-auto">
            Create, discover and join local social service drives in your
            neighbourhood. From winter clothes and blanket distribution
            in Mirpur and Mohammadpur to urban tree plantations and clean-ups.
          </p>

          <div className="flex gap-3 justify-center flex-wrap mt-8">
            <Link href="/events" className="btn btn-primary">
              Explore Upcoming Events
              <Icon n="right" />
            </Link>

            <Link
              href="/create-event"
              className="btn btn-outline bg-base-100"
            >
              <Icon n="plus" />
              Create an Event
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {stats.map(([value, label, color]) => (
              <div key={label} className="surface py-4 px-2">
                <p className={`text-2xl font-extrabold ${color}`}>
                  {value}
                </p>
                <p className="text-xs opacity-60 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <SectionHead
          eyebrow="Platform Features"
          title="Built for Grassroots Action"
          sub="A frictionless platform connecting compassionate citizens with direct local community needs."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([icon, title, description]) => (
            <div key={title} className="surface p-6 h-full">
              <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon n={icon} className="w-5 h-5" />
              </span>

              <h3 className="font-bold mb-1">{title}</h3>

              <p className="text-sm opacity-70">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <SectionHead
          eyebrow="Upcoming Drives"
          title="Recent Upcoming Events"
          sub="The next community drives that need volunteers like you."
        />

        {!events ? (
          <CardSkeletons />
        ) : events.length === 0 ? (
          <p className="text-center">
            No upcoming events yet.{" "}
            <Link
              className="link link-primary"
              href="/create-event"
            >
              Create the first one.
            </Link>
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/events" className="btn btn-primary">
                View All Events
                <Icon n="right" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Visual Stories Gallery */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <SectionHead
          eyebrow="Visual Stories"
          title="Community in Action"
          sub="Moments from volunteer drives, relief distributions and green initiatives across Dhaka and beyond."
        />

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {gallery.map(([id, title, location, tag]) => (
            <div
              key={id}
              className="relative h-44 md:h-60 rounded-xl overflow-hidden group"
            >
              <SafeImg
                src={U(id)}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-primary rounded px-1.5 py-0.5 mb-1">
                  {tag}
                </span>

                <p className="font-bold text-sm md:text-base leading-tight">
                  {title}
                </p>

                <p className="text-xs opacity-80 flex items-center gap-1">
                  <Icon n="pin" className="w-3 h-3" />
                  {location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary text-white text-center py-14 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Get Event Alerts
          </h2>

          <p className="mt-3 mb-6 opacity-90 max-w-md mx-auto">
            Be the first to hear when a new drive, plantation or clean-up
            is planned near you.
          </p>

          <form
            className="join max-w-full"
            onSubmit={subscribe}
            noValidate
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="input join-item w-56 sm:w-80 text-base-content bg-white"
            />

            <button className="btn join-item bg-base-content text-base-100 border-0 hover:bg-black">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
