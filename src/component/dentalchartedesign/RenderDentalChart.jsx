import React from "react";
import UpperRight from "./UpperRight";
import UpperLeft from "./UpperLeft";
import LowerRight from "./LowerRight";
import LowerLeft from "./LowerLeft";

const RenderDentalChart = ({ dentalChart }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {dentalChart.map((chart, index) => {
        const region = chart.substring(0, 2); // Extract region (e.g., 'UR', 'UL', 'LL', 'LR')
        const number = chart.substring(2); // Extract number (e.g., '2', '4')

        switch (region) {
          case "UR":
            return (
              <div className="marginTop">
                <UpperRight key={index} text={number} />{" "}
              </div>
            );
          case "UL":
            return (
              <div className="marginTop">
                {" "}
                <UpperLeft key={index} text={number} />{" "}
              </div>
            );
          case "LL":
            return (
              <div className="marginTop">
                <LowerLeft key={index} text={number} />{" "}
              </div>
            );
          case "LR":
            return (
              <div className="marginTop">
                <LowerRight key={index} text={number} />{" "}
              </div>
            );
          default:
            // Render default full-border box for unmatched regions
            return (
              <div key={index} className="size-4  cursor-pointer  text-xs  ">
                {chart},
              </div>
            );
        }
      })}
    </div>
  );
};

export default RenderDentalChart;
