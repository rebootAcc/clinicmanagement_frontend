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
            return <UpperRight key={index} text={number} />;
          case "UL":
            return <UpperLeft key={index} text={number} />;
          case "LL":
            return <LowerLeft key={index} text={number} />;
          case "LR":
            return <LowerRight key={index} text={number} />;
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
