"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { TbAward } from "react-icons/tb";
import { PiMoneyWavy } from "react-icons/pi";
import { MdOutlineAccessTime } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import solarlanding from "../public/landing.jpg";
import { FaWhatsapp } from "react-icons/fa";
import Goods from "./component/Goods";
import { solarProductsData } from "./component/data";
import Link from "next/link";

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
          <Link href="https://wa.link/a4gni5" target="_blank">
            <motion.button
              whileTap={{ scale: 0.7 }}
              className="mt-8 flex gap-2 items-center bg-green-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition"
            >
              <FaWhatsapp className="animate-pulse" /> Buy Now
            </motion.button>
          </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 space-y-10 lg:grid-cols-4 gap-4">
          {solarProductsData.map((item, index) => (
            <Goods key={index} {...item} />
          ))}
        </div>
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
          <div className="px-3 py-3 rounded-xl mb-3 w-fit bg-green-800 text-white mx-auto">
            <TbAward className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Warranty</h3>
          <p className="w-5/6 mx-auto text-muted-foreground text-gray-500 ">
            Our Solar Street lights comes with 2 Years Warranty
          </p>
        </div>

        <div className="text-center shadow-lg rounded-2xl p-8 bg-linear-to-b from-amber-50 via-white to-white">
          <div className="px-3 py-3 rounded-xl mb-3 w-fit bg-green-800 text-white mx-auto">
            <PiMoneyWavy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Payment</h3>
          <p className="w-5/6 mx-auto text-muted-foreground text-gray-500">
            Payment on Delivery anywhere in Nigeria
          </p>
        </div>

        <div className="text-center shadow-lg rounded-2xl p-8 bg-linear-to-b from-amber-50 via-white to-white">
          <div className="px-3 py-3 rounded-xl mb-3 w-fit bg-green-800 text-white mx-auto">
            <MdOutlineAccessTime className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Lifespan</h3>
          <p className="w-5/6 mx-auto text-muted-foreground text-gray-500">
            Up to 10 Years Lifespan guranteed
          </p>
        </div>
      </motion.div>

      <section className="my-20 py-10 text-white text-center w-5/6 mx-auto rounded-3xl bg-linear-to-r from-black via-slate-800 to-green-950">
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

      <section className="my-20 mx-auto w-5/6">
        <div className="flex justify-center"><p className="text-2xl font-semibold text-center mb-10 lg:w-3/6">
          FILL THE FORM BELOW TO ORDER FOR THIS SOLAR LIGHT.
        </p></div>
        <div className="space-y-5">
          <div className="lg:flex gap-10 justify-between space-y-5 lg:space-y-0">
            <input
              type="text"
              placeholder="Full Name"
              className="block border w-full border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="text"
              placeholder="Phone Number, preferably WhatsApp"
              className="block border w-full border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <input
              type="text"
              placeholder="Address (Where you want the product delivered)"
              className="block border w-full border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            {/* State picker */}
            <select
              className="block border lg:w-3/6 w-full border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
              defaultValue=""
            >
              <option value="" disabled>Select the state of delivery address</option>
              <option value="Abia">Abia</option>
              <option value="Adamawa">Adamawa</option>
              <option value="Akwa Ibom">Akwa Ibom</option>
              <option value="Anambra">Anambra</option>
              <option value="Bauchi">Bauchi</option>
              <option value="Bayelsa">Bayelsa</option>
              <option value="Benue">Benue</option>
              <option value="Borno">Borno</option>
              <option value="Cross River">Cross River</option>
              <option value="Delta">Delta</option>
              <option value="Ebonyi">Ebonyi</option>
              <option value="Edo">Edo</option>
              <option value="Ekiti">Ekiti</option>
              <option value="Enugu">Enugu</option>
              <option value="FCT">Federal Capital Territory</option>
              <option value="Gombe">Gombe</option>
              <option value="Imo">Imo</option>
              <option value="Jigawa">Jigawa</option>
              <option value="Kaduna">Kaduna</option>
              <option value="Kano">Kano</option>
              <option value="Katsina">Katsina</option>
              <option value="Kebbi">Kebbi</option>
              <option value="Kogi">Kogi</option>
              <option value="Kwara">Kwara</option>
              <option value="Lagos">Lagos</option>
              <option value="Nasarawa">Nasarawa</option>
              <option value="Niger">Niger</option>
              <option value="Ogun">Ogun</option>
              <option value="Ondo">Ondo</option>
              <option value="Osun">Osun</option>
              <option value="Oyo">Oyo</option>
              <option value="Plateau">Plateau</option>
              <option value="Rivers">Rivers</option>
              <option value="Sokoto">Sokoto</option>
              <option value="Taraba">Taraba</option>
              <option value="Yobe">Yobe</option>
              <option value="Zamfara">Zamfara</option>
            </select>

            {/* Select product you need */}
            

            <select
              className="block border lg:w-3/6 w-full border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
              defaultValue=""
            >
              <option value="" disabled>Select delivery timing</option>
              <option value="immediate">Deliver As Soon As Possible</option>
              <option value="weekend">Deliver within 24hours</option>
              <option value="next-week">Deliver within 48hours</option>
            </select>

          <div className="flex justify-center mt-12"><button className="bg-green-800 flex gap-1 items-center text-white px-8 py-3 rounded-full w-fit font-semibold hover:bg-green-600 transition">
            <LuSend/> Submit Order
          </button></div>
          <p className="text-xs text-red-600 text-center -mt-3">Only click this button if you are ready to place this order!!</p>
        </div>
      </section>

      <section className="mx-auto w-5/6 my-20 text-center">
        <div className="space-y-8">
          <p className="text-xl">
            For enquiries, call or WhatsApp us on{" "}
            <span className="font-semibold">09123456789</span>
          </p>
          <div className="flex justify-center">
            <Link href="https://wa.link/a4gni5" target="_blank">
              <motion.button
                whileTap={{ scale: 0.7 }}
                className="flex gap-2 items-center bg-green-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition"
              >
                <FaWhatsapp className="animate-pulse" /> Contact Us
              </motion.button>
            </Link>
          </div>
          <hr className="w-4/6 text-gray-700 mx-auto" />
          <p className="text-xl">All Rights Reserved | Nzeoma 2025</p>
        </div>
      </section>
    </main>
  );
}
