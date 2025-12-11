"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";

const testimonials = [
  {
    name: "Aarav Mehta",
    review: `I’ve been using this platform for a few months now, and it has completely transformed how I manage my business.  
The interface is clean and easy to navigate, even for beginners.  
Customer support is responsive and genuinely cares about resolving issues quickly.`,
    rating: 5,
  },
  {
    name: "Sofia Patel",
    review: `The quality of service is beyond what I expected.  
Every feature feels thoughtfully designed and practical for everyday use.  
I appreciate how updates are frequent and always improve performance.`,
    rating: 4,
  },
  {
    name: "Rahul Sharma",
    review: `At first, I wasn’t sure if this would fit our workflow, but after trying it for a week, I was convinced.  
It saves us hours every day and makes team collaboration so much smoother.  
Highly recommend it for small and medium businesses.`,
    rating: 5,
  },
  {
    name: "Nisha Verma",
    review: `What stands out the most is the customer-centric approach.  
Whenever I reached out for help, the support team responded within minutes.  
The experience feels personal and professional at the same time.`,
    rating: 4,
  },
  {
    name: "Aditya Singh",
    review: `I’ve tried several similar tools before, but this one tops them all.  
The dashboard is modern, intuitive, and extremely fast.  
It feels like the developers truly understand what users need.`,
    rating: 5,
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 768, // For small screens (mobile)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">
        Customer Reviews
      </h2>
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <div key={index} className="p-5">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <BsChatQuote size={30} className="mb-3 text-gray-500" />
              <p className="mb-5 text-gray-700 leading-relaxed">{item.review}</p>
              <h4 className="font-semibold">{item.name}</h4>
              <div className="flex mt-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <IoStar key={`star-${i}`} className="text-yellow-400" size={20} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;
