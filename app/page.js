"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { TbAward } from "react-icons/tb";
import { PiMoneyWavy } from "react-icons/pi";
import { FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import solarlanding from "../public/landing.jpg";
import { FaWhatsapp } from "react-icons/fa";
import Goods from "./component/Goods";

export default function Home() {
  return (
    <main>
      <section className="mx-auto lg:grid lg:grid-cols-2 lg:gap-20 w-5/6 my-20 lg:my-32 items-center">
        <div>
          <h1 className="font-black text-4xl">
            Premium Solar Street Lights{" "}
            <span className="lg:block">— Built to Last</span>
          </h1>
          <p className="mt-5">
            Brighten your streets and compounds with high-efficiency solar
            lights available in all watt options. Designed for durability with a
            2-year warranty and up to 10 years lifespan, giving you reliable
            lighting powered by the sun.
          </p>
          <motion.button
            whileTap={{ scale: 0.7 }}
            className="mt-8 flex gap-2 items-center bg-amber-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition"
          >
            <FaWhatsapp className="animate-pulse" /> Buy Now
          </motion.button>
        </div>
        <Image
          src={solarlanding}
          alt="Solar Street Light"
          className="mt-10 lg:mt-0 rounded-3xl shadow-lg"
        />
      </section>

      <section className="mx-auto w-5/6 my-20">
        <div className="lg:flex justify-between mb-10">
          <p className="text-3xl font-semibold">Browse Our Catalog</p>
          <p className="lg:w-3/6 lg:text-right mt-3 lg:mt-0">
            We have a range of Solar Powered Lights that are{" "}
            <span className="font-semibold">Energy Saving</span>,{" "}
            <span className="font-semibold">Environmentally Friendly</span>,
            built with <span className="font-semibold">IP65 Water</span> and{" "}
            <span className="font-semibold">Dust Resistance</span>
          </p>
        </div>
        <Goods />
      </section>

      <section>
        <div className="w-5/6 mx-auto text-center">
          <p className="text-red-800 text-4xl font-semibold animate-pulse">
            Limited Time Offer
          </p>
          <p className="mt-5 text-2xl font-semibold">
            Buy 10 psc and Get 1 Free. For Every 10 You Buy, You Get Additional
            1 Free.{" "}
          </p>
        </div>
      </section>

      <motion.div
            initial={{ opacity: 0, y: -70 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-20 w-5/6 mx-auto"
          >
            <div className="text-center shadow-lg rounded-2xl p-8 bg-linear-to-b from-amber-50 via-white to-white">
              <div className="px-3 py-3 rounded-xl mb-3 w-fit bg-amber-200 text-amber-950 mx-auto">
                <TbAward className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Warranty</h3>
              <p className="w-5/6 mx-auto text-muted-foreground text-gray-500 ">
                Our Solar Street lights comes with 2 Years Warranty
              </p>
              
            </div>

            <div className="text-center shadow-lg rounded-2xl p-8 bg-linear-to-b from-amber-50 via-white to-white">
              <div className="px-3 py-3 rounded-xl mb-3 w-fit bg-amber-200 text-amber-950 mx-auto">
                <PiMoneyWavy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Payment</h3>
              <p className="w-5/6 mx-auto text-muted-foreground text-gray-500">
                Payment on Delivery anywhere in Nigeria
              </p>
            </div>

            <div className="text-center shadow-lg rounded-2xl p-8 bg-linear-to-b from-amber-50 via-white to-white">
              <div className="px-3 py-3 rounded-xl mb-3 w-fit bg-amber-200 text-amber-950 mx-auto">
                <FiMapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Headquarters</h3>
              <p className="text-sm text-muted-foreground text-gray-500 mb-5">
                Worldwide Delivery
              </p>
              <p className="">Ottawa, Canada</p>
              
            </div>
          </motion.div>

      <section className="my-20 py-10 text-white text-center w-5/6 mx-auto rounded-3xl bg-linear-to-r from-black via-slate-800 to-amber-950">
        <div className="">
          <p className="font-semibold text-2xl">VERY IMPORTANT INFORMATION</p>
          <div className="mt-5 w-5/6 mx-auto space-y-10">
            <p>
              1. IF YOU DON'T HAVE MONEY TO PAY WITHIN 24 - 48HRS FROM THE
              MOMENT YOU ORDER, PLEASE DONT BOTHER TO ORDER THIS PRODUCT.
            </p>
            <p>
              2. DON'T ORDER FOR JOKE, OR JUST FOR FUN. WE ARE NOT JOKING HERE.
            </p>
            <p>
              3. DONT ORDER AND ASK US TO COME NEXT WEEK... PLEASE FOR GOD SAKE,
              WE WANT SERIOUS BUYERS ONLY!!!!
            </p>
            <p>
              4. IF YOU WILL BE TRAVELING, OR WON'T BE FREE TO RECEIVE THIS
              LIGHT, PLEASE DON'T ORDER, UNLESS YOU HAVE SOMEONE YOU CAN GIVE
              THE MONEY, AND TELL THE PERSON TO COLLECT THE LIGHT FOR YOU WHEN
              OUR AGENT GETS THERE.{" "}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-5/6 my-20 text-center">
        <div className="space-y-8">
          <p className="text-xl">
            For enquiries, call or WhatsApp us on{" "}
            <span className="font-semibold">09123456789</span>
          </p>
          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.7 }}
              className="flex gap-2 items-center bg-amber-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition"
            >
              <FaWhatsapp className="animate-pulse" /> Contact Us
            </motion.button>
          </div>
          <hr className="w-4/6 text-gray-700 mx-auto" />
          <p className="text-xl">All Rights Reserved | Nzeoma 2025</p>
        </div>
      </section>
    </main>
  );
}
