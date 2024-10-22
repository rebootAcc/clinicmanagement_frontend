import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const AdminSideHeader = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const location = useLocation();

  const sideheader = [
    {
      icon: "/icons/dashboard.svg",
      name: "Dashboard",
      link: "/doctor/dashboard",
    },
    {
      icon: "/icons/navpatient.svg",
      name: "Patients",
      link: "/doctor/patients",
    },
    {
      icon: "/icons/estimate.svg",
      name: "Estimate",
      link: "/patient/:id/estimate",
    },

    {
      icon: "/icons/payments.svg",
      name: "Payments",
      link: "/doctor/payments",
    },
    {
      icon: "/icons/payments.svg",
      name: "Add Payment Charges",
      link: "/payments/add-payment-charges",
    },

    {
      icon: "/icons/forms.svg",
      name: "Forms",
      link: "/forms",
    },
    {
      icon: "/icons/forms.svg",
      name: "Directions",
      link: "/directions",
    },
  ];

  const handleIconClick = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div
      className={` flex flex-col gap-4 h-full bg-[white] shadow-[5px_0px_8px_0px_rgba(0,0,0,0.05)] transition-all duration-300 z-50 `}
    >
      <div className="flex justify-center items-center mt-4 border-b p-2 pb-5  border-[#00000033]">
        <img
          src="/images/dentitydentallogo.png"
          alt="Clinic Logo"
          className="h-[3rem] "
        />
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {sideheader.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col items-start"
            onClick={() => handleIconClick(index)}
          >
            <div
              className={`flex items-center p-2 pl-4 rounded-lg w-full ${
                hoveredIndex === index || location.pathname === item.link
                  ? "bg-transparent text-custom-blue"
                  : "bg-transparent"
              } `}
              style={{
                transition: "background-color 0.5s ease, width 0.5s ease",
              }}
            >
              <div className="h-[1.5rem] w-[2px] bg-[#27B3FF]"></div>
              <span className={`p-2 rounded-md  `}>
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`h-[1.4rem] w-[1.4rem]  `}
                />
              </span>
              {item.link ? (
                <Link
                  to={item.link}
                  className={` font-semibold cursor-pointer hover:text-custom-blue ml-2 ${
                    location.pathname === item.link
                      ? "text-[#27B3FF]"
                      : " text-[#666666]"
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={` font-semibold cursor-pointer hover:text-custom-blue ml-2 ${
                    location.pathname === item.link
                      ? "text-[#27B3FF]"
                      : "text-[#666666]"
                  }`}
                >
                  {item.name}
                </span>
              )}
            </div>

            {/* Render Dropdown Links if available */}
            {item.links?.length > 0 && (
              <div
                className={`flex flex-col w-full ml-4 overflow-hidden ease-in-out ${
                  activeIndex === index ? "max-h-screen" : "max-h-0"
                }`}
                style={{
                  transform: activeIndex === index ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "top",
                  transition: "transform 0.5s ease, max-height 0.9s ease",
                }}
              >
                {item.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    to={link.link}
                    className={`pl-10 py-2 transition-all duration-1000 ease-in-out ${
                      location.pathname === link.link
                        ? "text-[#BDBDBD]"
                        : "text-[#777777]"
                    }`}
                    style={{
                      transform:
                        activeIndex === index
                          ? "translateY(0)"
                          : "translateY(-10px)",
                      opacity: activeIndex === index ? 1 : 0,
                      transition:
                        "transform 0.5s ease, opacity 0.5s ease, color 0.3s ease",
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSideHeader;
